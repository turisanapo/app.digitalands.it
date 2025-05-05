'use client'

import { useAuth } from '@/src/components/providers/auth-provider'
import { Button } from '@/src/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white text-black p-4">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <Image 
              src="/logo.png" 
              alt="Digital Lands" 
              width={150} 
              height={40}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Accedi a Digital Lands
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Accedi per accedere a tutte le funzionalità della piattaforma
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              onClick={signInWithGoogle}
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Accedi con Google
            </Button>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Accedendo, accetti i nostri{' '}
            <a href="#" className="text-[#FF6E00] hover:underline">
              Termini di Servizio
            </a>{' '}
            e la{' '}
            <a href="#" className="text-[#FF6E00] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </main>

      <footer className="bg-black p-8">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-8">
            <Image 
              src="/logo-black.png" 
              alt="Digital Lands Logo" 
              width={120} 
              height={30}
              style={{ width: 'auto', height: 'auto' }}
            />
            <p className="text-white text-sm">Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 