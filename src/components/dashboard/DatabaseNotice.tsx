export default function DatabaseNotice() {
  return (
    <div data-theme="green" className="min-h-screen flex items-center justify-center px-8 font-body text-neutral">
      <div className="card w-full max-w-md bg-neutral text-base-100">
        <div className="card-body items-center text-center">
          <h1 className="card-title font-display text-3xl font-light">Demo database not connected</h1>
          <p className="font-light">
            This portfolio demo needs its Postgres database connected before the dashboard can load. Please check back
            shortly.
          </p>
          <a className="btn btn-secondary mt-2 font-display font-bold tracking-wider" href="/">
            Back to login
          </a>
        </div>
      </div>
    </div>
  )
}
