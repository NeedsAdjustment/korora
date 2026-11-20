import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '@/lib/auth-client'
import LoadingScreen from './LoadingScreen'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()

  if (isPending) return <LoadingScreen />
  if (!session) return <Navigate to="/" replace />

  return <>{children}</>
}
