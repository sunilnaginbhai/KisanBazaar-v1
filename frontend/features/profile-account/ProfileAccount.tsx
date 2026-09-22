import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Bell, Camera, Check, CheckCircle2, Download, Eye, EyeOff, Globe2, Lock, LogOut, MapPin, Save, ShieldCheck, Smartphone, Trash2, UserRound } from 'lucide-react'
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

type KycData = {
  documentType: 'Aadhaar' | 'PAN' | 'Passport'
  documentNumber: string
  legalName: string
  dateOfBirth: string
  businessType: 'Personal' | 'Farm' | 'FPO' | 'Company'
  businessName: string
  address: string
  documentFile: string
  documentMime: string
  documentSize: number
  status: 'Not started' | 'Pending' | 'Approved' | 'Rejected'
}

const storageKey = 'direct-market-profile'
const kycStorageKey = 'direct-market-kyc'

export function ProfileAccount({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [kycSaved, setKycSaved] = useState(false)
  const [kycStep, setKycStep] = useState(1)
  const [kyc, setKyc] = useState<KycData>(() => {
    const stored = localStorage.getItem(`${kycStorageKey}-${session.email}`)
    const defaults: KycData = {
      documentType: 'Aadhaar',
      documentNumber: '',
      legalName: session.name,
      dateOfBirth: '',
      businessType: session.role === 'farmer' ? 'Farm' : 'Personal',
      businessName: '',
      address: '',
      documentFile: '',
      documentMime: '',
      documentSize: 0,
      status: 'Not started',
    }
    return stored ? { ...defaults, ...JSON.parse(stored) as Partial<KycData> } : defaults
  })
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
  const updateKyc = <K extends keyof KycData>(key: K, value: KycData[K]) => setKyc((current) => ({ ...current, [key]: value }))
  const validateKycStep = (step: number) => {
    if (step === 1 && (!kyc.legalName.trim() || !kyc.dateOfBirth || !kyc.documentNumber.trim())) return 'Enter your legal name, date of birth, and document number.'
    if (step === 2 && (!kyc.businessName.trim() || !kyc.address.trim())) return 'Enter your business or personal name and full address.'
    if (step === 3 && !kyc.documentFile) return 'Choose a government-issued document before continuing.'
    return ''
  }
  const uploadKycDocument = (file?: File) => {
    if (!file) return
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) { setError('Only PDF, JPG, and PNG identity documents are accepted.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Identity documents must be 5 MB or smaller.'); return }
    setError('')
    setKyc((current) => ({ ...current, documentFile: file.name, documentMime: file.type, documentSize: file.size }))
  }
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
  const submitKyc = () => {
    setError('')
    const validationError = [1, 2, 3].map(validateKycStep).find(Boolean)
    if (validationError) {
      setError(validationError)
      return
    }
    const next = { ...kyc, status: 'Pending' as const }
    setKyc(next)
    localStorage.setItem(`${kycStorageKey}-${session.email}`, JSON.stringify(next))
    setKycSaved(true)
    window.setTimeout(() => setKycSaved(false), 2200)
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
        <article className="profile-card kyc-card"><div className="profile-card-heading"><div><h2>KYC verification</h2><p>Verify your identity to build trust with buyers and sellers.</p></div><ShieldCheck size={18} /></div><div className="kyc-status"><span>Status</span><b className={`status-text kyc-${kyc.status.toLowerCase().replace(' ', '-')}`}>{kyc.status}</b></div><div className="kyc-steps" aria-label="KYC verification steps">{['Identity', 'Details', 'Document'].map((label, index) => <span className={kycStep === index + 1 ? 'active' : kycStep > index + 1 ? 'complete' : ''} key={label}><b>{index + 1}</b>{label}</span>)}</div>{kycStep === 1 && <div className="profile-form-grid"><label>Document type<select value={kyc.documentType} onChange={(event) => updateKyc('documentType', event.target.value as KycData['documentType'])}><option>Aadhaar</option><option>PAN</option><option>Passport</option></select></label><label>Legal name<input value={kyc.legalName} onChange={(event) => updateKyc('legalName', event.target.value)} /></label><label>Date of birth<input type="date" value={kyc.dateOfBirth} onChange={(event) => updateKyc('dateOfBirth', event.target.value)} /></label><label>Document number<input value={kyc.documentNumber} onChange={(event) => updateKyc('documentNumber', event.target.value)} placeholder="Enter document number" /></label></div>}{kycStep === 2 && <div className="profile-form-grid"><label>Account type<select value={kyc.businessType} onChange={(event) => updateKyc('businessType', event.target.value as KycData['businessType'])}><option>Personal</option><option>Farm</option><option>FPO</option><option>Company</option></select></label><label>Business / personal name<input value={kyc.businessName} onChange={(event) => updateKyc('businessName', event.target.value)} placeholder="Registered name" /></label><label className="profile-wide">Full address<textarea value={kyc.address} onChange={(event) => updateKyc('address', event.target.value)} placeholder="House, village, city, state, PIN" /></label></div>}{kycStep === 3 && <div className="kyc-upload-step"><label>Government ID document<input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => uploadKycDocument(event.target.files?.[0])} /></label><small>Accepted: PDF, JPG, PNG. Maximum size: 5 MB.</small>{kyc.documentFile && <p className="kyc-file-ready"><Check size={15} /> {kyc.documentFile} · {(kyc.documentSize / 1024 / 1024).toFixed(2)} MB</p>}</div>}<div className="kyc-actions">{kycStep > 1 && <button className="secondary-button" type="button" onClick={() => { setError(''); setKycStep((step) => step - 1) }}>Back</button>}{kycStep < 3 ? <button className="primary-button" type="button" onClick={() => { const validationError = validateKycStep(kycStep); if (validationError) setError(validationError); else { setError(''); setKycStep((step) => step + 1) } }}>Continue <ArrowRight size={15} /></button> : <button className="primary-button" type="button" onClick={submitKyc}><ShieldCheck size={15} /> Submit for verification</button>}</div></article>
      </div>
      <aside className="profile-side">
        <article className="profile-card account-details"><h2>Account details</h2><div><span>Account ID</span><b>DM-{session.email.slice(0, 4).toUpperCase()}-2026</b></div><div><span>Role</span><b>{session.role === 'bulk-buyer' ? 'Buyer' : session.role}</b></div><div><span>Member since</span><b>September 2026</b></div><div><span>Status</span><b className="status-text"><CheckCircle2 size={14} /> Active</b></div></article>
        <article className="profile-card"><div className="profile-card-heading"><div><h2>Preferences</h2><p>Personalise your experience.</p></div><Globe2 size={18} /></div><label>Language<select value={profile.language} onChange={(event) => update('language', event.target.value)}><option>English</option><option>Hindi</option><option>Marathi</option></select></label><label>Currency<select value={profile.currency} onChange={(event) => update('currency', event.target.value)}><option>INR (₹)</option><option>USD ($)</option></select></label></article>
        <article className="profile-card security-card"><div className="profile-card-heading"><div><h2>Security</h2><p>Protect your marketplace account.</p></div><ShieldCheck size={18} /></div><div className="security-item"><Smartphone size={15} /><span><b>Active sessions</b><small>Chrome on Windows · Current device</small></span></div><div className="security-item"><Lock size={15} /><span><b>Two-factor authentication</b><small>Recommended for account protection</small></span><button type="button">Enable</button></div><button className="text-button" type="button"><Download size={14} /> Download my data</button></article>
        <article className="profile-card danger-card"><h2>Account actions</h2><button type="button" onClick={onLogout}><LogOut size={14} /> Log out all devices</button><button type="button" onClick={() => window.confirm('Delete your account permanently?') && setError('Account deletion requires support verification.')}><Trash2 size={14} /> Delete account</button></article>
      </aside>
    </div>
    {error && <p className="profile-error">{error}</p>}{saved && <p className="profile-success"><Check size={15} /> Profile changes saved.</p>}{kycSaved && <p className="profile-success"><Check size={15} /> KYC submitted for review.</p>}<div className="profile-save-bar"><span><MapPin size={14} /> Changes are saved securely to this device.</span><button className="primary-button" type="button" onClick={save}><Save size={15} /> Save changes</button></div>
  </section>
}
