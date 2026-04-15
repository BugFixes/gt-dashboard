export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Panel for the Daphne API.
        </p>
        <p className="island-kicker m-0">TanStack Start, Clerk, Tailwind, shadcn/ui</p>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <a
          href="https://tanstack.com/start/latest/docs/framework/react/overview"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
        >
          <span className="sr-only">Open TanStack Start docs</span>
          Docs
        </a>
        <a
          href="https://github.com/bugfixes/gt-dashboard"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
        >
          <span className="sr-only">Open the panel repository</span>
          Repo
        </a>
      </div>
    </footer>
  )
}
