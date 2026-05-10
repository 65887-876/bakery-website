import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { pbkdf2 } from '@noble/hashes/pbkdf2.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { adminAuth } from '../config/adminAuth'
import './AdminGuard.css'

type GuardProps = {
  children: ReactNode
}

type AttemptState = {
  count: number
  lockedUntil: number
}

const SESSION_KEY = 'bakery.admin.session.v1'
const ATTEMPT_KEY = 'bakery.admin.attempts.v1'

function fromBase64(base64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(base64)
  const buffer = new ArrayBuffer(bin.length)
  const out = new Uint8Array(buffer)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out as Uint8Array<ArrayBuffer>
}

function safeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

function readAttempts(): AttemptState {
  const raw = localStorage.getItem(ATTEMPT_KEY)
  if (!raw) return { count: 0, lockedUntil: 0 }
  try {
    const parsed = JSON.parse(raw) as AttemptState
    return {
      count: Number(parsed.count || 0),
      lockedUntil: Number(parsed.lockedUntil || 0),
    }
  } catch {
    return { count: 0, lockedUntil: 0 }
  }
}

function writeAttempts(next: AttemptState) {
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(next))
}

function clearAttempts() {
  localStorage.removeItem(ATTEMPT_KEY)
}

function hasValidSession(): boolean {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return false
  try {
    const parsed = JSON.parse(raw) as { exp: number }
    if (parsed.exp > Date.now()) return true
  } catch {
    // ignore malformed session
  }
  sessionStorage.removeItem(SESSION_KEY)
  return false
}

function setSession() {
  const exp = Date.now() + adminAuth.sessionMinutes * 60_000
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ exp }))
}

async function derive(password: string): Promise<Uint8Array> {
  const enc = new TextEncoder()
  const salt = fromBase64(adminAuth.saltBase64)

  // Pure JS PBKDF2 avoids browser subtle-crypto compatibility issues.
  const out = pbkdf2(sha256, enc.encode(password), salt, {
    c: adminAuth.iterations,
    dkLen: adminAuth.keyLength,
  })

  return out
}

function timeLabel(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.ceil(seconds / 60)
  return `${mins} min`
}

function normPassword(value: string): string {
  // Avoid copy/paste hidden spaces causing false negatives.
  return value.trim()
}

function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function AdminGuard({ children }: GuardProps) {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    setAuthed(hasValidSession())
    setReady(true)
  }, [])

  useEffect(() => {
    if (authed) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [authed])

  const attempts = readAttempts()
  const locked = attempts.lockedUntil > now

  useEffect(() => {
    if (!authed) return
    const refresh = window.setInterval(() => {
      if (!hasValidSession()) {
        logoutAdmin()
        setAuthed(false)
      }
    }, 15000)
    return () => window.clearInterval(refresh)
  }, [authed])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (locked) {
      setError('Acces bloque temporairement. Reessayez plus tard.')
      return
    }

    const normalized = normPassword(password)
    if (!normalized || normalized.length < 12) {
      setError('Mot de passe invalide.')
      return
    }

    setBusy(true)
    try {
      const providedHash = await derive(normalized)
      const expectedHash = fromBase64(adminAuth.passwordHashBase64)
      const ok = safeEqual(providedHash, expectedHash)

      if (ok) {
        clearAttempts()
        setSession()
        setAuthed(true)
        setPassword('')
        return
      }

      const nextCount = attempts.count + 1
      if (nextCount >= adminAuth.maxAttempts) {
        writeAttempts({
          count: 0,
          lockedUntil: Date.now() + adminAuth.lockMinutes * 60_000,
        })
        setError(
          `Trop d'essais. Acces bloque pendant ${adminAuth.lockMinutes} minutes.`,
        )
      } else {
        writeAttempts({ count: nextCount, lockedUntil: 0 })
        setError(`Mot de passe incorrect. Essais restants: ${adminAuth.maxAttempts - nextCount}.`)
      }
    } catch (cause) {
      console.error('Admin verification failed', cause)
      setError('Erreur de verification. Rechargez la page et reessayez.')
    } finally {
      setBusy(false)
    }
  }

  if (!ready) return null
  if (authed) return <>{children}</>

  const remainingSeconds = Math.max(
    0,
    Math.ceil((attempts.lockedUntil - now) / 1000),
  )

  return (
    <div className="admin-auth">
      <form className="admin-auth__card" onSubmit={onSubmit}>
        <h1>Admin access</h1>
        <p>Zone protegee. Entrez le mot de passe proprietaire.</p>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={busy || locked}
        />
        <button type="submit" disabled={busy || locked}>
          {busy ? 'Verification...' : 'Se connecter'}
        </button>
        {locked && (
          <p className="admin-auth__lock">Reessayez dans {timeLabel(remainingSeconds)}.</p>
        )}
        {error && <p className="admin-auth__error">{error}</p>}
      </form>
    </div>
  )
}
