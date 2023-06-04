import Head from 'next/head'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, ILogin } from './api/auth/validation'
import Penguins from '../../public/penguins.svg'

const Home: NextPage = () => {
  const { register, handleSubmit, setFocus } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  })
  const [wrong, setWrong] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const session = useSession()
  const [pushed, setPushed] = useState(false)

  useEffect(() => {
    if (session.status === 'authenticated') {
      if (pushed) return
      router.push('/dashboard')
      setPushed(true)
    }
  }, [router, session])

  const onSubmit = useCallback(async (data: ILogin) => {
    setLoading(true)
    await signIn('credentials', { ...data, redirect: false, callbackUrl: '/dashboard' })
      .then(({ ok, error }) => {
        if (ok) {
          if (pushed) return
          router.push('/dashboard')
          setPushed(true)
        }
        else {
          if (error === 'CredentialsSignin') setWrong(true)
        }
      })
    setLoading(false)
  }, [])

  const handleChange = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault()
      setFocus('lastName')
    }
    else if (/[^a-zA-Z]+$/.test(e.key)) {
      e.preventDefault()
    }
  }

  if (session.status === 'unauthenticated') {
    return (
      <div data-theme='green'>
        <Head>
          <title>Emily & Joshua</title>
          <meta name='description' content='Our Wedding' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='icon' href='/favicon.ico' />
          <style></style>
        </Head>
        <main className='flex items-center justify-center h-[calc(100dvh)] font-body tracking-wide min-w-[360px] min-h-[750px] px-8 my-8 lg:my-0'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-center flex-col w-full lg:space-x-10 lg:flex-row" >
              <Image priority style={{ display: 'flex', width: '13em' }} src={Penguins} alt='Penguins' />
              <div className='flex flex-col justify-center mt-6'>
                <h1 className="card-title font-heading font-medium tracking-wider text-7xl lg:text-8xl text-neutral whitespace-pre">Emily<span className='font-light'>&</span></h1>
                <h1 className="card-title font-heading font-medium tracking-wide text-7xl lg:text-8xl text-neutral whitespace-pre ml-5">Joshua</h1>
              </div>
              <div className="divider invisible lg:visible lg:divider-horizontal"></div>
              <div className='grid max-w-96 card  text-base-100 bg-neutral'>
                <div className='card-body'>
                  <h1 className="card-title justify-center font-display font-light text-4xl mb-6">Welcome</h1>
                  <div className='form-control w-full max-w-xs'>
                    <div className='join'>
                      <div className='join-item'>
                        <label className='label'>
                          <span className='label-text text-base-100'>First Name</span>
                        </label>
                        <input
                          type='text'
                          placeholder='Amelié'
                          className='input w-full max-w-xs text-neutral placeholder-accent'
                          onKeyDown={handleChange}
                          {...register('firstName')}
                        />
                      </div>
                      <div className='join-item'>
                        <label className='label ml-3'>
                          <span className='label-text text-base-100'>Last Name</span>
                        </label>
                        <input
                          type='text'
                          placeholder='Lacroix'
                          className='input join-item w-full max-w-xs text-neutral placeholder-accent mr-3'
                          onKeyDown={handleChange}
                          {...register('lastName')}
                        />
                      </div>
                    </div>
                    <label className='label'>
                      <span className='label-text text-base-100'>Password</span>
                    </label>
                    <input
                      type='password'
                      placeholder='•••••••'
                      className='input w-full max-w-xs mb-2 text-neutral placeholder-accent'
                      {...register('password')}
                    />
                  </div>
                  <button className='btn btn-secondary mt-2 font-display font-normal' type='submit' onClick={() => setWrong(false)}>
                    {loading && <span className='loading loading-infinity loading-sm'></span> || 'Login'}
                  </button>
                  {wrong &&
                    <div className='flex justify-center mt-2'>
                      <div className='badge badge-error'>Credentials Incorrect</div>
                    </div>}
                </div>
              </div>
            </div>
          </form>
        </main>
      </div >
    )
  }
}

export default Home