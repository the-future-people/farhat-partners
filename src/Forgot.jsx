// src/Forgot.jsx
//
// /forgot: a code to the rep's phone, then a new password, and they're
// logged in. The answer is the same whether or not the number is a
// partner's, so the page can't be used to find out who is.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TopBar } from './Shell.jsx'
import { problem, resetCode, resetPassword, saveToken } from './api'

const input = 'w-full h-12 rounded-xl border border-rule px-4 text-[16px] text-ink bg-white placeholder:text-body/50 focus:outline-none focus:border-farhat'
const btn = 'h-12 px-6 rounded-xl bg-farhat text-white font-semibold disabled:opacity-60'

export default function Forgot() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [again, setAgain] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const send = async e => {
    e.preventDefault()
    setBusy(true); setError('')
    try { const { data } = await resetCode(phone); setSent(data.sent_to) } catch (err) { setError(problem(err)) }
    setBusy(false)
  }
  const save = async e => {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      const { data } = await resetPassword(phone, code, password)
      saveToken(data.token)
      navigate('/', { replace: true })
    } catch (err) { setError(problem(err)) }
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <TopBar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-[1.6rem] font-bold text-ink">Set a new password</h1>
        <p className="text-body">We'll send a code to your number.</p>
        <form onSubmit={sent ? save : send} className="mt-5 rounded-2xl border border-rule bg-white p-6">
          <label className="block text-sm text-body mb-1.5">Your number</label>
          <input className={input} inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="024 000 0000" disabled={!!sent} />
          {sent && (
            <>
              <p className="mt-2 text-xs text-body">If {sent} is on a partner account, a code is on its way.</p>
              <label className="block text-sm text-body mt-4 mb-1.5">The 6-digit code</label>
              <input className={`${input} tracking-[0.4em] font-bold`} inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} />
              <label className="block text-sm text-body mt-4 mb-1.5">New password (at least 8 characters)</label>
              <input className={input} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
              <label className="block text-sm text-body mt-4 mb-1.5">Type it again</label>
              <input className={input} type="password" autoComplete="new-password" value={again} onChange={e => setAgain(e.target.value)} />
              {again && again !== password && <p className="mt-1 text-sm text-farhat">The two passwords don't match.</p>}
            </>
          )}
          {error && <p className="mt-3 text-sm text-farhat">{error}</p>}
          <button className={`${btn} w-full mt-5`}
                  disabled={busy || (sent ? code.length !== 6 || password.length < 8 || password !== again : phone.length < 9)}>
            {busy ? 'One moment…' : sent ? 'Save and log in' : 'Send me a code'}
          </button>
          <Link to="/" className="inline-block mt-4 text-sm text-body">Back to log in</Link>
        </form>
      </div>
    </div>
  )
}
