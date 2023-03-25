import Head from 'next/head'
import Link from 'next/link'
import type { NextPage } from "next"
import { useCallback } from "react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { loginSchema, ILogin } from "./api/auth/validation"

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback(async (data: ILogin) => {
    await signIn("credentials", { ...data, callbackUrl: "/dashboard" });
  }, []);

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
              <h2 className="card-title">Welcome back!</h2>
              <input
                type="firstname"
                placeholder="Type your firstname..."
                className="input input-bordered w-full max-w-xs mt-2"
                {...register("firstname")}
              />
              <input
                type="lastname"
                placeholder="Type your lastname..."
                className="input input-bordered w-full max-w-xs mt-2"
                {...register("lastname")}
              />
              <input
                type="password"
                placeholder="Type your password..."
                className="input input-bordered w-full max-w-xs my-2"
                {...register("password")}
              />
              <div className="card-actions items-center justify-between">
                <button className="btn btn-secondary" type="submit">
                  Login
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Home