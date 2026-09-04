import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Camera, Check, CheckCircle2, Download, Eye, EyeOff, Globe2, Lock, LogOut, MapPin, Save, ShieldCheck, Smartphone, Trash2, UserRound } from 'lucide-react'
import type { Session } from '../../services/authService'
import './profile-account.css'

type ProfileData = {
  username: string
  phone: string
  bio: string
  location: string
  business: string
  gst: string
  language: string
  currency: string
  photo: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  orderNotifications: boolean
  priceAlerts: boolean
  aiRecommendations: boolean
}

const storageKey = 'direct-market-profile'

export function ProfileAccount({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const profileStorageKey = `${storageKey}-${session.email}`
  const [profile, setProfile] = useState<ProfileData>(() => {
    const stored = localStorage.getItem(profileStorageKey)
    return stored ? JSON.parse(stored) as ProfileData : {
      username: session.email.split('@')[0],
      phone: '',
      bio: '',
      location: '',
      business: session.role === 'farmer' ? 'My farm' : '',
      gst: '',
      language: 'English',
      currency: 'INR (₹)',
      photo: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(session.name)}`,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderNotifications: true,
      priceAlerts: true,
      aiRecommendations: true,
    }
  })

  useEffect(() => {
    localStorage.setItem(profileStorageKey, JSON.stringify(profile))
  }, [profile, profileStorageKey])

  const completion = useMemo(() => {
    const fields = [profile.username, session.name, session.email, profile.phone, profile.bio, profile.location, profile.business]
    return Math.round(fields.filter(Boolean).length / fields.length * 100)
  }, [profile, session])

  const update = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => setProfile((current) => ({ ...current, [key]: value }))
  const uploadPhoto = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return }
    const reader = new FileReader()
    reader.onload = () => update('photo', String(reader.result))
    reader.readAsDataURL(file)
  }
  const save = () => {
    setError('')
    if (password && password.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return <section className="profile-page">
    <div className="profile-page-heading"><div><p className="eyebrow">ACCOUNT CENTRE</p><h1>Your profile, <i>your control.</i></h1><p>Manage your identity, preferences and security in one place.</p></div><span className="account-status"><CheckCircle2 size={15} /> Account active</span></div>
    <div className="profile-overview">
      <div className="profile-identity"><div className="profile-photo-wrap"><img src={profile.photo} alt={`${session.name} profile`} /><button type="button" aria-label="Upload profile photo" onClick={() => fileRef.current?.click()}><Camera size={15} /></button><input ref={fileRef} hidden type="file" accept="image/*" onChange={(event) => uploadPhoto(event.target.files?.[0])} /><button className="profile-photo-remove" type="button" aria-label="Remove profile photo" onClick={() => update('photo', `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(session.name)}`)}><Trash2 size={12} /></button></div><div><h2>{session.name}</h2><p>{session.email}</p><span className="role-badge">{session.role === 'bulk-buyer' ? 'Buyer' : session.role}</span></div></div>
      <div className="completion-card"><div><b>{completion}%</b><span>Profile complete</span></div><div className="completion-track"><i style={{ width: `${completion}%` }} /></div><small>Add your phone, location and bio to strengthen your profile.</small></div>
    </div>
    <div className="profile-grid">
      <div className="profile-main">
        <article className="profile-card"><div className="profile-card-heading"><div><h2>Personal information</h2><p>Keep your marketplace identity up to date.</p></div><UserRound size={18} /></div><div className="profile-form-grid"><label>Username<input value={profile.username} onChange={(event) => update('username', event.target.value)} /></label><label>Full name<input value={session.name} readOnly /></label><label>Email address<div className="verified-input"><input value={session.email} readOnly /><Check size={15} /></div><small className="verified-text">Verified email address</small></label><label>Phone number<input value={profile.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+91 98765 43210" /></label><label className="profile-wide">Bio / about<textarea value={profile.bio} onChange={(event) => update('bio', event.target.value)} placeholder="Tell buyers or partners a little about you..." /></label><label>Location / address<input value={profile.location} onChange={(event) => update('location', event.target.value)} placeholder="City, state" /></label><label>{session.role === 'farmer' ? 'Farm name' : 'Business name'}<input value={profile.business} onChange={(event) => update('business', event.target.value)} placeholder="Your organisation" /></label><label>GST / business details<input value={profile.gst} onChange={(event) => update('gst', event.target.value)} placeholder="Optional" /></label></div></article>
        <article className="profile-card"><div className="profile-card-heading"><div><h2>Change password</h2><p>Use a unique password with at least 8 characters.</p></div><Lock size={18} /></div><div className="profile-form-grid"><label className="password-field">New password<input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter new password" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Show or hide password">{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></label><label>Confirm password<input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat new password" /></label></div></article>
        <article className="profile-card"><div className="profile-card-heading"><div><h2>Notifications</h2><p>Choose how Direct Market keeps you informed.</p></div><Bell size={18} /></div><div className="settings-list">{[['emailNotifications', 'Email notifications', 'Weekly updates and account messages'], ['smsNotifications', 'SMS notifications', 'Important delivery and security alerts'], ['pushNotifications', 'Push notifications', 'Real-time updates on this device'], ['orderNotifications', 'Order notifications', 'Status changes for your orders'], ['priceAlerts', 'Price alerts', 'When saved products change price'], ['aiRecommendations', 'AI recommendations', 'Personalised supply and demand suggestions']].map(([key, title, description]) => <label className="setting-row" key={key}><span><b>{title}</b><small>{description}</small></span><input type="checkbox" checked={Boolean(profile[key as keyof ProfileData])} onChange={(event) => update(key as keyof ProfileData, event.target.checked as never)} /></label>)}</div></article>
      </div>
      <aside className="profile-side">
        <article className="profile-card account-details"><h2>Account details</h2><div><span>Account ID</span><b>DM-{session.email.slice(0, 4).toUpperCase()}-2026</b></div><div><span>Role</span><b>{session.role === 'bulk-buyer' ? 'Buyer' : session.role}</b></div><div><span>Member since</span><b>September 2026</b></div><div><span>Status</span><b className="status-text"><CheckCircle2 size={14} /> Active</b></div></article>
        <article className="profile-card"><div className="profile-card-heading"><div><h2>Preferences</h2><p>Personalise your experience.</p></div><Globe2 size={18} /></div><label>Language<select value={profile.language} onChange={(event) => update('language', event.target.value)}><option>English</option><option>Hindi</option><option>Marathi</option></select></label><label>Currency<select value={profile.currency} onChange={(event) => update('currency', event.target.value)}><option>INR (₹)</option><option>USD ($)</option></select></label></article>
        <article className="profile-card security-card"><div className="profile-card-heading"><div><h2>Security</h2><p>Protect your marketplace account.</p></div><ShieldCheck size={18} /></div><div className="security-item"><Smartphone size={15} /><span><b>Active sessions</b><small>Chrome on Windows · Current device</small></span></div><div className="security-item"><Lock size={15} /><span><b>Two-factor authentication</b><small>Recommended for account protection</small></span><button type="button">Enable</button></div><button className="text-button" type="button"><Download size={14} /> Download my data</button></article>
        <article className="profile-card danger-card"><h2>Account actions</h2><button type="button" onClick={onLogout}><LogOut size={14} /> Log out all devices</button><button type="button" onClick={() => window.confirm('Delete your account permanently?') && setError('Account deletion requires support verification.') }><Trash2 size={14} /> Delete account</button></article>
      </aside>
    </div>
    {error && <p className="profile-error">{error}</p>}{saved && <p className="profile-success"><Check size={15} /> Profile changes saved.</p>}<div className="profile-save-bar"><span><MapPin size={14} /> Changes are saved securely to this device.</span><button className="primary-button" type="button" onClick={save}><Save size={15} /> Save changes</button></div>
  </section>
}
