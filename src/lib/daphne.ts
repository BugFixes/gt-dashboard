const DEFAULT_DAPHNE_URL = 'http://127.0.0.1:9000'

export type DashboardAuth = {
  clerkUserId: string
  clerkOrgId?: string | null
}

export type OrganizationAccess = {
  organization: {
    id: string
    name: string
    clerk_org_id?: string | null
  }
  membership: {
    role: 'owner' | 'admin' | 'member'
  }
}

export type EnvironmentProvisioning = {
  environment: {
    id: string
    subproject_id: string
    account_id: string
    name: string
  }
  account: {
    id: string
    name: string
    organization_id: string
    create_tickets: boolean
    ticket_provider: string
    notification_provider: string
    ai_enabled: boolean
    use_managed_ai: boolean
    notify_min_level: string
    rapid_occurrence_window_minutes: number
    rapid_occurrence_threshold: number
  }
}

export type Agent = {
  id: string
  account_id: string
  name: string
  api_key: string
  api_secret: string
}

export type ApiKeyRecord = {
  id: string
  organization_id: string
  account_id?: string | null
  key_type: 'dev' | 'system'
  scope: 'ingest' | 'read'
  name: string
  api_key: string
  clerk_user_id?: string | null
  environment?: string | null
  expires_at: string
  revoked_at?: string | null
  last_used_at?: string | null
  created_at: string
}

export type ApiKeyWithSecret = {
  api_secret: string
} & ApiKeyRecord

export type BugSummary = {
  id: string
  title: string
  severity: string
  language: string
  first_seen_at: string
  last_seen_at: string
  occurrence_count: number
  ticket_status: string
  ticket_provider: string
  notification_status: string
  account_name: string
  agent_name: string
  tone: string
}

export type BugListResponse = {
  title: string
  summary: string
  bugs: BugSummary[]
}

export type HealthResponse = {
  ok: boolean
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: DashboardAuth
}

export function getDaphneBaseUrl() {
  return import.meta.env.VITE_DAPHNE_API_URL || DEFAULT_DAPHNE_URL
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers()

  if (options.body !== undefined) {
    headers.set('content-type', 'application/json')
  }

  if (options.auth?.clerkUserId) {
    headers.set('X-Clerk-User-Id', options.auth.clerkUserId)
  }

  if (options.auth?.clerkOrgId) {
    headers.set('X-Clerk-Org-Id', options.auth.clerkOrgId)
  }

  const response = await fetch(`${getDaphneBaseUrl()}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export function getHealth() {
  return request<HealthResponse>('/healthz')
}

export function listOrganizations(auth: DashboardAuth) {
  return request<OrganizationAccess[]>('/v1/organizations', { auth })
}

export function createOrganization(
  auth: DashboardAuth,
  body: { name: string; clerk_org_id: string; owner_clerk_user_id: string; owner_name: string },
) {
  return request<OrganizationAccess>('/v1/organizations', {
    method: 'POST',
    auth,
    body,
  })
}

export function createProject(auth: DashboardAuth, body: { name: string }) {
  return request<{ id: string; name: string }>('/v1/projects', {
    method: 'POST',
    auth,
    body,
  })
}

export function createSubproject(
  auth: DashboardAuth,
  projectId: string,
  body: { name: string },
) {
  return request<{ id: string; name: string }>(`/v1/projects/${projectId}/subprojects`, {
    method: 'POST',
    auth,
    body,
  })
}

export function createEnvironment(
  auth: DashboardAuth,
  subprojectId: string,
  body: {
    name: string
    create_tickets: boolean
    ticket_provider: string
    ticketing_api_key?: string | null
    notification_provider: string
    notification_api_key?: string | null
    ai_enabled: boolean
    use_managed_ai: boolean
    ai_api_key?: string | null
    notify_min_level: string
    rapid_occurrence_window_minutes: number
    rapid_occurrence_threshold: number
  },
) {
  return request<EnvironmentProvisioning>(`/v1/subprojects/${subprojectId}/environments`, {
    method: 'POST',
    auth,
    body,
  })
}

export function createAgent(auth: DashboardAuth, body: { account_id: string; name: string }) {
  return request<Agent>('/v1/agents', {
    method: 'POST',
    auth,
    body,
  })
}

export function listApiKeys(auth: DashboardAuth) {
  return request<ApiKeyRecord[]>('/v1/api-keys', { auth })
}

export function createApiKey(
  auth: DashboardAuth,
  body: {
    name: string
    key_type: 'dev' | 'system'
    scope?: 'ingest' | 'read'
    account_id?: string
    environment?: string
    expires_at?: string
  },
) {
  return request<ApiKeyWithSecret>('/v1/api-keys', {
    method: 'POST',
    auth,
    body,
  })
}

export function revokeApiKey(auth: DashboardAuth, keyId: string) {
  return request<ApiKeyRecord>(`/v1/api-keys/${keyId}`, {
    method: 'DELETE',
    auth,
  })
}

export function listBugs(auth: DashboardAuth) {
  return request<BugListResponse>('/api/dashboard/bugs', { auth })
}
