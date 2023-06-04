import Head from 'next/head'
import type { NextPage } from "next"
import { useRouter } from 'next/router'
import { useCallback, useRef, useState } from "react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { loginSchema, ILogin } from "./api/auth/validation"


const Home: NextPage = () => {
  const { register, handleSubmit } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  })
  const [wrong, setWrong] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = useCallback(async (data: ILogin) => {
    setLoading(true)
    await signIn('credentials', { ...data, redirect: false, callbackUrl: '/dashboard' })
      .then(({ ok, error }) => {
        if (ok) { router.push('dashboard') }
        else {
          if (error === 'CredentialsSignin') setWrong(true)
        }
      })
    setLoading(false)
  }, [])

  let lastName = useRef<HTMLInputElement>(null)
  const handleNameTransition = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault()
      lastName.current.focus()
    }
  }
  return (
    <div data-theme='green'>
      <Head>
        <title>Emily & Joshua</title>
        <meta name="description" content="A wedding website for perfectionists" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <style></style>
      </Head>
      <main className='font-body'>
        <form
          className="flex items-center justify-center h-screen w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="card w-96 bg-neutral xl">
            <div className="card-body">
              <div className="form-control w-full max-w-xs">
                <div className="join">
                  <div className="join-item">
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      type="firstName"
                      placeholder="Amelié"
                      className="input input-bordered w-full max-w-xs"
                      onKeyDown={handleNameTransition}
                      {...register("firstName")}
                    />
                  </div>
                  <div className="join-item">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      type="lastName"
                      placeholder="Lacroix"
                      className="input join-item input-bordered w-full max-w-xs"
                      {...register("lastName")}
                      ref={lastName}
                    />
                  </div>
                </div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full max-w-xs mb-2"
                  {...register("password")}
                />
              </div>
              {wrong && <p className="text-red-500">Credentials Incorrect</p>}
              <button className="btn btn-secondary mt-2 font-display font-normal" type="submit">
                {loading && <span className="loading loading-infinity loading-sm"></span> || 'Login'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Home