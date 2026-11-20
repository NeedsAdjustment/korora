export default function ErrorNotice({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div data-theme="green" className="min-h-screen flex items-center justify-center px-8 font-body text-neutral">
      <div className="card w-full max-w-md bg-neutral text-base-100">
        <div className="card-body items-center text-center">
          <h1 className="card-title font-display text-3xl font-light">Something went wrong</h1>
          <p className="font-light">{message}</p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-secondary mt-2 font-display font-bold tracking-wider" onClick={onRetry}>
              Try again
            </button>
            <a className="btn btn-ghost mt-2 font-display font-bold tracking-wider" href="/">
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
