import { useState, type KeyboardEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import AnimatedLetters from '@/components/AnimatedLetters'
import LoadingScreen from '@/components/LoadingScreen'
import { signIn, useSession } from '@/lib/auth-client'
import { siteConfig } from '@/lib/config'
import { loginSchema, type LoginValues } from '@/shared/schemas'
import { toDemoEmail } from '@/shared/identity'
import { loginText } from '@/utils/motionText'

function handleNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
  if (event.ctrlKey || event.metaKey || event.altKey) return
  if (event.key.length > 1) return
  if (!/[\p{L}\p{M} .'-]/u.test(event.key)) event.preventDefault()
}

export default function LoginPage() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [wrong, setWrong] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: siteConfig.demoMode
      ? {
          firstName: siteConfig.demo.firstName,
          lastName: siteConfig.demo.lastName,
          password: siteConfig.demo.password,
        }
      : undefined,
  })

  if (isPending) return <LoadingScreen />
  if (session) return <Navigate to="/dashboard" replace />

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true)
    setWrong(false)
    setServerError(null)

    try {
      const { error } = await signIn.email({
        email: toDemoEmail(values.firstName, values.lastName),
        password: values.password,
      })

      if (error) {
        if (error.status === 503) {
          setServerError(error.message ?? 'The demo database is not connected yet.')
        } else {
          setWrong(true)
        }
        return
      }

      queryClient.clear()
      navigate('/dashboard', { replace: true })
    } catch {
      setWrong(true)
    } finally {
      setLoading(false)
    }
  })

  const formError =
    errors.firstName?.message ?? errors.lastName?.message ?? errors.password?.message

  return (
    <div data-theme="green">
      <main className="flex items-center justify-center h-[calc(100dvh)] font-body tracking-wide min-w-[360px] min-h-[750px] px-8 my-8 lg:my-0">
        <form onSubmit={onSubmit} autoComplete="off">
          <div className="flex items-center justify-center flex-col w-full lg:space-x-10 lg:flex-row">
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
              <img style={{ display: 'flex', width: '13em' }} src="/penguins.svg" alt="Penguins" />
            </motion.div>
            <motion.div
              variants={loginText}
              initial="hidden"
              animate="visible"
              className="flex flex-col justify-center mt-6 mb-9 lg:my-0 card-title font-heading font-medium tracking-wide text-7xl lg:text-8xl text-neutral whitespace-pre"
            >
              <h1>
                <AnimatedLetters text="Emily" />
                <span className="font-light ml-3">
                  <AnimatedLetters text="&" />
                </span>
              </h1>
              <h1>
                <AnimatedLetters text="Joshua " />
              </h1>
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '388px' }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="divider hidden lg:flex lg:divider-horizontal self-center"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="grid max-w-96 card text-base-100 bg-neutral"
            >
              <div className="card-body">
                <h1 className="card-title justify-center font-display font-light text-5xl mb-6">Welcome</h1>
                <div className="flex flex-col w-full max-w-xs">
                  <div className="join login-name-fields">
                    <div className="join-item">
                      <label className="label login-label">
                        <span className="label-text text-base-100 font-light">First Name</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        aria-autocomplete="none"
                        placeholder="Amelié"
                        className="input login-input w-full max-w-xs text-neutral placeholder:text-accent"
                        onKeyDown={handleNameKeyDown}
                        {...register('firstName')}
                      />
                    </div>
                    <div className="join-item">
                      <label className="label login-label ml-3">
                        <span className="label-text text-base-100 font-light">Last Name</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        aria-autocomplete="none"
                        placeholder="Lacroix"
                        className="input login-input join-item w-full max-w-xs text-neutral placeholder:text-accent mr-3"
                        onKeyDown={handleNameKeyDown}
                        {...register('lastName')}
                      />
                    </div>
                  </div>
                  <label className="label login-label mt-1">
                    <span className="label-text text-base-100 font-light">Password</span>
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="•••••••"
                    className="input login-input w-full max-w-xs mb-2 text-neutral placeholder:text-accent"
                    {...register('password')}
                  />
                </div>
                <button
                  className="btn btn-secondary mt-2 font-display font-bold tracking-wider"
                  type="submit"
                  onClick={() => {
                    setWrong(false)
                    setServerError(null)
                  }}
                >
                  {(loading && <span className="loading loading-infinity loading-sm"></span>) || 'Login'}
                </button>
                {wrong && (
                  <div className="flex justify-center mt-2">
                    <div className="badge badge-error font-light">Credentials Incorrect</div>
                  </div>
                )}
                {serverError && (
                  <div className="flex justify-center mt-2">
                    <div className="badge badge-error font-light text-center whitespace-normal h-auto py-2">
                      {serverError}
                    </div>
                  </div>
                )}
                {formError && (
                  <div className="flex justify-center mt-2">
                    <div className="badge badge-error font-light">{formError}</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </form>
      </main>
    </div>
  )
}
