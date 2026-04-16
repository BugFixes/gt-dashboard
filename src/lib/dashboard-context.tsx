import { useAuth, useOrganization, useUser } from '@clerk/tanstack-react-start'
import { createContext, startTransition, useContext, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  createAgent,
  createApiKey,
  createEnvironment,
  createOrganization,
  createProject,
  createSubproject,
  getHealth,
  listApiKeys,
  listBugs,
  listOrganizations,
  revokeApiKey,
  type Agent,
  type ApiKeyRecord,
  type ApiKeyWithSecret,
  type BugSummary,
  type DashboardAuth,
  type EnvironmentProvisioning,
  type OrganizationAccess,
} from '@/lib/daphne'

type OrgStatus = 'idle' | 'loading' | 'missing' | 'connected' | 'error'
type HealthStatus = 'loading' | 'up' | 'down'
type AiMode = 'managed' | 'customer' | 'disabled'

type SetupFormState = {
  projectName: string
  subprojectName: string
  environmentName: string
  createTickets: boolean
  ticketProvider: 'jira' | 'github' | 'linear' | 'tracklines' | 'none'
  ticketingApiKey: string
  notificationProvider: 'slack' | 'teams' | 'resend' | 'none'
  notificationApiKey: string
  aiMode: AiMode
  aiApiKey: string
  notifyMinLevel: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  rapidOccurrenceWindowMinutes: string
  rapidOccurrenceThreshold: string
}

type KeyFormState = {
  name: string
  keyType: 'dev' | 'system'
  scope: 'ingest' | 'read'
  accountId: string
  environment: string
  expiresAt: string
}

type DashboardContextValue = {
  authLoaded: boolean
  userLoaded: boolean
  orgLoaded: boolean
  organizationName: string | null
  hasOrgSelected: boolean
  canManageOrg: boolean
  health: HealthStatus
  orgStatus: OrgStatus
  orgError: string | null
  backendOrg: OrganizationAccess | null
  bugs: BugSummary[]
  bugsError: string | null
  apiKeys: ApiKeyRecord[]
  keysError: string | null
  provisioning: EnvironmentProvisioning | null
  latestAgent: Agent | null
  latestApiKey: ApiKeyWithSecret | null
  setupForm: SetupFormState
  setSetupForm: React.Dispatch<React.SetStateAction<SetupFormState>>
  keyForm: KeyFormState
  setKeyForm: React.Dispatch<React.SetStateAction<KeyFormState>>
  agentName: string
  setAgentName: React.Dispatch<React.SetStateAction<string>>
  setupError: string | null
  setupSuccess: string | null
  agentError: string | null
  agentSuccess: string | null
  keyCreateError: string | null
  keyCreateSuccess: string | null
  syncingOrg: boolean
  submittingSetup: boolean
  creatingAgent: boolean
  creatingKey: boolean
  revokingKeyId: string | null
  currentAccountId: string
  criticalBugCount: number
  activeSystemKeys: number
  connectOrganization: () => Promise<void>
  submitSetup: (event: FormEvent<HTMLFormElement>) => Promise<void>
  submitAgent: (event: FormEvent<HTMLFormElement>) => Promise<void>
  submitApiKey: (event: FormEvent<HTMLFormElement>) => Promise<void>
  revokeKey: (keyId: string) => Promise<void>
  refreshBugs: () => Promise<void>
  refreshKeys: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

const defaultSetupForm = (): SetupFormState => ({
  projectName: 'workspace',
  subprojectName: 'app',
  environmentName: 'production',
  createTickets: true,
  ticketProvider: 'jira',
  ticketingApiKey: '',
  notificationProvider: 'slack',
  notificationApiKey: '',
  aiMode: 'managed',
  aiApiKey: '',
  notifyMinLevel: 'error',
  rapidOccurrenceWindowMinutes: '30',
  rapidOccurrenceThreshold: '3',
})

const defaultKeyForm = (): KeyFormState => ({
  name: 'ingest-key',
  keyType: 'system',
  scope: 'ingest',
  accountId: '',
  environment: 'production',
  expiresAt: '',
})

export function DashboardStateProvider({ children }: { children: ReactNode }) {
  const { isLoaded: authLoaded, userId, orgId } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const { organization, membership, isLoaded: orgLoaded } = useOrganization()

  const auth = useMemo<DashboardAuth | null>(() => {
    if (!userId) {
      return null
    }

    return {
      clerkUserId: userId,
      clerkOrgId: orgId,
    }
  }, [orgId, userId])

  const [health, setHealth] = useState<HealthStatus>('loading')
  const [orgStatus, setOrgStatus] = useState<OrgStatus>('idle')
  const [orgError, setOrgError] = useState<string | null>(null)
  const [backendOrg, setBackendOrg] = useState<OrganizationAccess | null>(null)
  const [bugs, setBugs] = useState<BugSummary[]>([])
  const [bugsError, setBugsError] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([])
  const [keysError, setKeysError] = useState<string | null>(null)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [setupSuccess, setSetupSuccess] = useState<string | null>(null)
  const [agentError, setAgentError] = useState<string | null>(null)
  const [agentSuccess, setAgentSuccess] = useState<string | null>(null)
  const [keyCreateError, setKeyCreateError] = useState<string | null>(null)
  const [keyCreateSuccess, setKeyCreateSuccess] = useState<string | null>(null)
  const [setupForm, setSetupForm] = useState<SetupFormState>(defaultSetupForm)
  const [agentName, setAgentName] = useState('runtime-agent')
  const [keyForm, setKeyForm] = useState<KeyFormState>(defaultKeyForm)
  const [provisioning, setProvisioning] = useState<EnvironmentProvisioning | null>(null)
  const [latestAgent, setLatestAgent] = useState<Agent | null>(null)
  const [latestApiKey, setLatestApiKey] = useState<ApiKeyWithSecret | null>(null)
  const [syncingOrg, setSyncingOrg] = useState(false)
  const [submittingSetup, setSubmittingSetup] = useState(false)
  const [creatingAgent, setCreatingAgent] = useState(false)
  const [creatingKey, setCreatingKey] = useState(false)
  const [revokingKeyId, setRevokingKeyId] = useState<string | null>(null)
  const attemptedAutoCreateOrgIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    startTransition(() => {
      getHealth()
        .then((response) => setHealth(response.ok ? 'up' : 'down'))
        .catch(() => setHealth('down'))
    })
  }, [])

  useEffect(() => {
    if (!organization?.name) {
      return
    }

    setSetupForm((current) => ({
      ...current,
      projectName:
        current.projectName === 'workspace' || current.projectName.trim() === ''
          ? slugify(organization.name)
          : current.projectName,
    }))
  }, [organization?.name])

  useEffect(() => {
    if (!orgId || typeof window === 'undefined') {
      setProvisioning(null)
      setLatestAgent(null)
      return
    }

    const raw = window.localStorage.getItem(storageKey(orgId))
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw) as {
        provisioning?: EnvironmentProvisioning
        agent?: Agent
      }

      if (parsed.provisioning) {
        setProvisioning(parsed.provisioning)
        setKeyForm((current) => ({
          ...current,
          accountId: parsed.provisioning?.account.id ?? current.accountId,
          environment: parsed.provisioning?.environment.name ?? current.environment,
        }))
      }

      if (parsed.agent) {
        setLatestAgent(parsed.agent)
      }
    } catch {
      window.localStorage.removeItem(storageKey(orgId))
    }
  }, [orgId])

  useEffect(() => {
    if (!orgId) {
      attemptedAutoCreateOrgIdsRef.current.clear()
    }
  }, [orgId])

  useEffect(() => {
    const activeAuth = auth

    if (!authLoaded || !userLoaded || !orgLoaded) {
      return
    }

    if (!activeAuth?.clerkUserId) {
      setOrgStatus('idle')
      setBackendOrg(null)
      setApiKeys([])
      setBugs([])
      return
    }

    if (!activeAuth.clerkOrgId) {
      setOrgStatus('missing')
      setBackendOrg(null)
      setApiKeys([])
      setBugs([])
      return
    }

    const verifiedAuth: DashboardAuth = activeAuth
    let cancelled = false

    async function load() {
      setOrgStatus('loading')
      setOrgError(null)

      try {
        const organizations = await listOrganizations(verifiedAuth)
        if (cancelled) {
          return
        }

        const match = organizations.find(
          (entry) => entry.organization.clerk_org_id === verifiedAuth.clerkOrgId,
        )

        if (!match) {
          const orgClerkId = verifiedAuth.clerkOrgId
          const ownerClerkUserId = verifiedAuth.clerkUserId
          const orgName = organization?.name
          const ownerName = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Owner'
          const canAutoCreate =
            Boolean(orgName) &&
            Boolean(user) &&
            Boolean(orgClerkId) &&
            (membership?.role === 'org:admin' || membership?.role === 'org:owner')

          if (canAutoCreate && orgClerkId && !attemptedAutoCreateOrgIdsRef.current.has(orgClerkId)) {
            attemptedAutoCreateOrgIdsRef.current.add(orgClerkId)
            setSyncingOrg(true)

            try {
              const created = await createOrganization(verifiedAuth, {
                name: orgName || 'Organization',
                clerk_org_id: orgClerkId,
                owner_clerk_user_id: ownerClerkUserId,
                owner_name: ownerName,
              })

              if (cancelled) {
                return
              }

              setBackendOrg(created)
              setOrgStatus('connected')

              const [bugResponse, keyResponse] = await Promise.allSettled([
                listBugs(verifiedAuth),
                listApiKeys(verifiedAuth),
              ])

              if (cancelled) {
                return
              }

              if (bugResponse.status === 'fulfilled') {
                setBugs(bugResponse.value.bugs)
                setBugsError(null)
              } else {
                setBugs([])
                setBugsError(
                  bugResponse.reason instanceof Error ? bugResponse.reason.message : 'Failed to load bugs',
                )
              }

              if (keyResponse.status === 'fulfilled') {
                setApiKeys(keyResponse.value)
                setKeysError(null)
              } else {
                setApiKeys([])
                setKeysError(
                  keyResponse.reason instanceof Error ? keyResponse.reason.message : 'Failed to load API keys',
                )
              }

              return
            } catch (error) {
              if (cancelled) {
                return
              }

              setOrgStatus('error')
              setOrgError(
                error instanceof Error ? error.message : 'Failed to auto-create organization',
              )
              return
            } finally {
              if (!cancelled) {
                setSyncingOrg(false)
              }
            }
          }

          setOrgStatus('missing')
          setBackendOrg(null)
          setBugs([])
          setApiKeys([])
          return
        }

        setBackendOrg(match)
        setOrgStatus('connected')

        const [bugResponse, keyResponse] = await Promise.allSettled([
          listBugs(verifiedAuth),
          listApiKeys(verifiedAuth),
        ])

        if (cancelled) {
          return
        }

        if (bugResponse.status === 'fulfilled') {
          setBugs(bugResponse.value.bugs)
          setBugsError(null)
        } else {
          setBugs([])
          setBugsError(
            bugResponse.reason instanceof Error ? bugResponse.reason.message : 'Failed to load bugs',
          )
        }

        if (keyResponse.status === 'fulfilled') {
          setApiKeys(keyResponse.value)
          setKeysError(null)
        } else {
          setApiKeys([])
          setKeysError(
            keyResponse.reason instanceof Error ? keyResponse.reason.message : 'Failed to load API keys',
          )
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        setOrgStatus('error')
        setOrgError(error instanceof Error ? error.message : 'Failed to load organizations')
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [auth, authLoaded, membership?.role, orgLoaded, organization?.name, user, userLoaded])

  const canManageOrg = membership?.role === 'org:admin' || membership?.role === 'org:owner'
  const currentAccountId = provisioning?.account.id ?? keyForm.accountId
  const criticalBugCount = bugs.filter((bug) => bug.tone === 'critical').length
  const activeSystemKeys = apiKeys.filter((key) => key.key_type === 'system' && !key.revoked_at).length

  async function refreshBugs() {
    const activeAuth = auth

    if (!activeAuth?.clerkOrgId) {
      return
    }

    try {
      const response = await listBugs(activeAuth)
      setBugs(response.bugs)
      setBugsError(null)
    } catch (error) {
      setBugsError(error instanceof Error ? error.message : 'Failed to load bugs')
    }
  }

  async function refreshKeys() {
    const activeAuth = auth

    if (!activeAuth?.clerkOrgId) {
      return
    }

    try {
      const response = await listApiKeys(activeAuth)
      setApiKeys(response)
      setKeysError(null)
    } catch (error) {
      setKeysError(error instanceof Error ? error.message : 'Failed to load API keys')
    }
  }

  async function connectOrganization() {
    const activeAuth = auth

    if (!activeAuth?.clerkUserId || !activeAuth.clerkOrgId || !organization?.name || !user) {
      return
    }

    setSyncingOrg(true)
    setOrgError(null)

    try {
      const created = await createOrganization(activeAuth, {
        name: organization.name,
        clerk_org_id: activeAuth.clerkOrgId,
        owner_clerk_user_id: activeAuth.clerkUserId,
        owner_name: user.fullName || user.primaryEmailAddress?.emailAddress || 'Owner',
      })

      setBackendOrg(created)
      setOrgStatus('connected')
      await Promise.all([refreshBugs(), refreshKeys()])
    } catch (error) {
      setOrgStatus('error')
      setOrgError(error instanceof Error ? error.message : 'Failed to connect organization')
    } finally {
      setSyncingOrg(false)
    }
  }

  async function submitSetup(event: FormEvent<HTMLFormElement>) {
    const activeAuth = auth

    event.preventDefault()

    if (!activeAuth?.clerkOrgId) {
      return
    }

    setSubmittingSetup(true)
    setSetupError(null)
    setSetupSuccess(null)

    try {
      const project = await createProject(activeAuth, { name: setupForm.projectName.trim() })
      const subproject = await createSubproject(activeAuth, project.id, {
        name: setupForm.subprojectName.trim(),
      })
      const created = await createEnvironment(activeAuth, subproject.id, {
        name: setupForm.environmentName.trim(),
        create_tickets: setupForm.createTickets,
        ticket_provider: setupForm.createTickets ? setupForm.ticketProvider : 'none',
        ticketing_api_key:
          setupForm.createTickets && setupForm.ticketProvider !== 'none'
            ? normalizeOptional(setupForm.ticketingApiKey)
            : null,
        notification_provider: setupForm.notificationProvider,
        notification_api_key:
          setupForm.notificationProvider !== 'none'
            ? normalizeOptional(setupForm.notificationApiKey)
            : null,
        ai_enabled: setupForm.aiMode !== 'disabled',
        use_managed_ai: setupForm.aiMode === 'managed',
        ai_api_key: setupForm.aiMode === 'customer' ? normalizeOptional(setupForm.aiApiKey) : null,
        notify_min_level: setupForm.notifyMinLevel,
        rapid_occurrence_window_minutes: Number(setupForm.rapidOccurrenceWindowMinutes),
        rapid_occurrence_threshold: Number(setupForm.rapidOccurrenceThreshold),
      })

      setProvisioning(created)
      setLatestAgent(null)
      setKeyForm((current) => ({
        ...current,
        accountId: created.account.id,
        environment: created.environment.name,
      }))
      setAgentName(`${setupForm.environmentName.trim()}-agent`)
      setSetupSuccess('Workspace ready. Daphne project stack provisioned.')

      persistWorkspace(activeAuth.clerkOrgId, {
        provisioning: created,
      })
    } catch (error) {
      setSetupError(error instanceof Error ? error.message : 'Failed to finish setup')
    } finally {
      setSubmittingSetup(false)
    }
  }

  async function submitAgent(event: FormEvent<HTMLFormElement>) {
    const activeAuth = auth

    event.preventDefault()

    if (!activeAuth?.clerkOrgId || !currentAccountId) {
      return
    }

    setCreatingAgent(true)
    setAgentError(null)
    setAgentSuccess(null)

    try {
      const created = await createAgent(activeAuth, {
        account_id: currentAccountId,
        name: agentName.trim(),
      })

      setLatestAgent(created)
      setAgentSuccess('Agent credential issued. Copy secret now.')
      persistWorkspace(activeAuth.clerkOrgId, {
        provisioning,
        agent: created,
      })
    } catch (error) {
      setAgentError(error instanceof Error ? error.message : 'Failed to create agent')
    } finally {
      setCreatingAgent(false)
    }
  }

  async function submitApiKey(event: FormEvent<HTMLFormElement>) {
    const activeAuth = auth

    event.preventDefault()

    if (!activeAuth?.clerkOrgId) {
      return
    }

    setCreatingKey(true)
    setKeyCreateError(null)
    setKeyCreateSuccess(null)

    try {
      const created = await createApiKey(activeAuth, {
        name: keyForm.name.trim(),
        key_type: keyForm.keyType,
        scope: keyForm.keyType === 'system' ? keyForm.scope : undefined,
        account_id: keyForm.keyType === 'dev' ? normalizeOptional(keyForm.accountId) ?? undefined : undefined,
        environment: normalizeOptional(keyForm.environment) ?? undefined,
        expires_at: keyForm.expiresAt ? new Date(`${keyForm.expiresAt}T23:59:59Z`).toISOString() : undefined,
      })

      setLatestApiKey(created)
      setKeyCreateSuccess('API key issued. Secret shown once.')
      await refreshKeys()
    } catch (error) {
      setKeyCreateError(error instanceof Error ? error.message : 'Failed to create API key')
    } finally {
      setCreatingKey(false)
    }
  }

  async function revokeKey(keyId: string) {
    const activeAuth = auth

    if (!activeAuth?.clerkOrgId) {
      return
    }

    setRevokingKeyId(keyId)

    try {
      await revokeApiKey(activeAuth, keyId)
      await refreshKeys()
    } catch (error) {
      setKeysError(error instanceof Error ? error.message : 'Failed to revoke key')
    } finally {
      setRevokingKeyId(null)
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        authLoaded,
        userLoaded,
        orgLoaded,
        organizationName: organization?.name ?? null,
        hasOrgSelected: Boolean(orgId),
        canManageOrg,
        health,
        orgStatus,
        orgError,
        backendOrg,
        bugs,
        bugsError,
        apiKeys,
        keysError,
        provisioning,
        latestAgent,
        latestApiKey,
        setupForm,
        setSetupForm,
        keyForm,
        setKeyForm,
        agentName,
        setAgentName,
        setupError,
        setupSuccess,
        agentError,
        agentSuccess,
        keyCreateError,
        keyCreateSuccess,
        syncingOrg,
        submittingSetup,
        creatingAgent,
        creatingKey,
        revokingKeyId,
        currentAccountId,
        criticalBugCount,
        activeSystemKeys,
        connectOrganization,
        submitSetup,
        submitAgent,
        submitApiKey,
        revokeKey,
        refreshBugs,
        refreshKeys,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboardState() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboardState must be used inside DashboardStateProvider')
  }
  return context
}

export function resolveAiMode(provisioning: EnvironmentProvisioning | null) {
  if (!provisioning) {
    return 'not configured'
  }
  if (!provisioning.account.ai_enabled) {
    return 'disabled'
  }
  return provisioning.account.use_managed_ai ? 'managed' : 'customer-managed'
}

function normalizeOptional(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'workspace'
}

function storageKey(orgId: string) {
  return `gt-dashboard:${orgId}:workspace`
}

function persistWorkspace(
  orgId: string,
  payload: { provisioning?: EnvironmentProvisioning | null; agent?: Agent | null },
) {
  if (typeof window === 'undefined') {
    return
  }

  const currentRaw = window.localStorage.getItem(storageKey(orgId))
  const current = currentRaw
    ? (JSON.parse(currentRaw) as { provisioning?: EnvironmentProvisioning; agent?: Agent })
    : {}

  window.localStorage.setItem(
    storageKey(orgId),
    JSON.stringify({
      provisioning: payload.provisioning ?? current.provisioning,
      agent: payload.agent ?? current.agent,
    }),
  )
}
