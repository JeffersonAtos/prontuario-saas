'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { validateAccessToken } from '@/lib/supabase'

interface TokenValidatorProps {
  onValidToken: (tokenData: any) => void
  onInvalidToken: () => void
}

export default function TokenValidator({ onValidToken, onInvalidToken }: TokenValidatorProps) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [validando, setValidando] = useState(true)

  useEffect(() => {
    async function validar() {
      if (!token) {
        onInvalidToken()
        setValidando(false)
        return
      }

      try {
        const data = await validateAccessToken(token)
        if (data) {
          onValidToken(data)
        } else {
          onInvalidToken()
        }
      } catch (error) {
        onInvalidToken()
      } finally {
        setValidando(false)
      }
    }

    validar()
  }, [token])

  if (validando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Validando acesso...</p>
        </div>
      </div>
    )
  }

  return null
}
