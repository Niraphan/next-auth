'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Profile() {
  const { data: session, status } = useSession()
  console.log('session', session)
  console.log('status', status)

  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // When after loading success and have session, show profile
  return (
    status === 'authenticated' &&
    session.user && (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
          {session.user.image && <img src={session.user.image} alt="Profile"  className='rounded-full w-12 h-12 object-cover'/>}
          <p>
            Welcome, <b>{session.user.name}!</b>
          </p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    )
  )
}