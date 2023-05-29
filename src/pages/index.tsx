import Head from 'next/head'
import type { NextPage } from "next"
import { useRouter } from 'next/router'
import { useCallback, useState } from "react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { loginSchema, ILogin } from "./api/auth/validation"


const Home: NextPage = () => {
  const { register, handleSubmit } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  })

  const [wrong, setWrong] = useState(false)
  const router = useRouter()

  const onSubmit = useCallback(async (data: ILogin) => {
    await signIn("credentials", { ...data, redirect: false, callbackUrl: "/dashboard" })
      .then(({ ok, error }) => {
        if (ok) { router.push("/dashboard") }
        else {
          console.log(error)
        }
      })
  }, [])

  return (
    <div>
      <Head>
        <title>Emily & Joshua</title>
        <meta name="description" content="A wedding website for perfectionists" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <form
          className="flex items-center justify-center h-screen w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Welcome!</h2>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="firstName"
                  placeholder="Amelié"
                  className="input input-bordered w-full max-w-xs"
                  {...register("firstName")}
                />
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="lastName"
                  placeholder="Lacroix"
                  className="input input-bordered w-full max-w-xs"
                  {...register("lastName")}
                />
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full max-w-xs mb-2"
                  {...register("password")}
                />
              </div>
              <button className="btn btn-secondary mt-2" type="submit">
                Login
              </button>

            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Home