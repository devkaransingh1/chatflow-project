import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../api'
import './ProfilePage.css'

/* ── SVG Icons ── */
function IconArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}
function IconCamera() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}
function IconUpload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}
function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

/* ── Storage helpers ── */
const KEYS = {
  photo: 'chatflow_profile_photo',
  displayName: 'chatflow_display_name',
  description: 'chatflow_description',
}

function loadProfile(fallbackUsername) {
  return {
    photo: localStorage.getItem(KEYS.photo) || '',
    displayName: localStorage.getItem(KEYS.displayName) || fallbackUsername || 'User',
    description: localStorage.getItem(KEYS.description) || '',
  }
}

function saveField(key, value) {
  if (value) {
    localStorage.setItem(key, value)
  } else {
    localStorage.removeItem(key)
  }
}

/* ── Component ── */
export default function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [currentUser, setCurrentUser] = useState(null)
  const [photo, setPhoto] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')

  // Editing states
  const [editingName, setEditingName] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftDesc, setDraftDesc] = useState('')

  // Toast
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  // Photo action menu
  const [showPhotoMenu, setShowPhotoMenu] = useState(false)
  const photoMenuRef = useRef(null)

  // Animated entrance
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser()
      setCurrentUser(user)
      const profile = loadProfile(user?.username)
      setPhoto(profile.photo)
      setDisplayName(profile.displayName)
      setDescription(profile.description)
      setTimeout(() => setLoaded(true), 50)
    }
    init()
  }, [])

  
  useEffect(() => {
    function handleClick(e) {
      if (photoMenuRef.current && !photoMenuRef.current.contains(e.target)) {
        setShowPhotoMenu(false)
      }
    }
    if (showPhotoMenu) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showPhotoMenu])

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2400)
  }

  /* ── Photo handlers ── */
  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setPhoto(dataUrl)
      saveField(KEYS.photo, dataUrl)
      showToast('Photo updated')
      setShowPhotoMenu(false)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleRemovePhoto() {
    setPhoto('')
    saveField(KEYS.photo, '')
    showToast('Photo removed')
    setShowPhotoMenu(false)
  }

  /* ── Name handlers ── */
  function startEditName() {
    setDraftName(displayName)
    setEditingName(true)
  }
  function saveName() {
    const trimmed = draftName.trim()
    if (!trimmed) {
      showToast('Name cannot be empty')
      return
    }
    setDisplayName(trimmed)
    saveField(KEYS.displayName, trimmed)
    setEditingName(false)
    showToast('Name updated')
  }
  function cancelEditName() {
    setEditingName(false)
  }

  /* ── Description handlers ── */
  function startEditDesc() {
    setDraftDesc(description)
    setEditingDesc(true)
  }
  function saveDesc() {
    const trimmed = draftDesc.trim()
    setDescription(trimmed)
    saveField(KEYS.description, trimmed)
    setEditingDesc(false)
    showToast(trimmed ? 'Description updated' : 'Description removed')
  }
  function cancelEditDesc() {
    setEditingDesc(false)
  }

  const initial = displayName?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className={`pp-page ${loaded ? 'pp-loaded' : ''}`}>

      {/* ── Ambient glow blobs ── */}
      <div className="pp-glow pp-glow-1" />
      <div className="pp-glow pp-glow-2" />

      {/* ── Top bar ── */}
      <header className="pp-header">
        <button className="pp-back-btn" onClick={() => navigate('/chat')} title="Back to chat">
          <IconArrowLeft />
        </button>
        <h1 className="pp-header-title">Profile</h1>
        <div className="pp-header-spacer" />
      </header>

      {/* ── Card ── */}
      <main className="pp-card">

        {/* ── Photo section ── */}
        <section className="pp-photo-section">
          <div className="pp-avatar-wrapper" ref={photoMenuRef}>
            <div
              className="pp-avatar"
              onClick={() => setShowPhotoMenu((v) => !v)}
              role="button"
              tabIndex={0}
              title="Change profile photo"
            >
              {photo ? (
                <img src={photo} alt="Profile" className="pp-avatar-img" />
              ) : (
                <span className="pp-avatar-initial">{initial}</span>
              )}
              <div className="pp-avatar-overlay">
                <IconCamera />
              </div>
            </div>

            {/* Photo action menu */}
            {showPhotoMenu && (
              <div className="pp-photo-menu">
                <button
                  className="pp-photo-menu-item"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconUpload />
                  <span>{photo ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
                {photo && (
                  <button
                    className="pp-photo-menu-item pp-photo-menu-danger"
                    onClick={handleRemovePhoto}
                  >
                    <IconTrash />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="pp-file-input"
          />
        </section>

        {/* ── Name section ── */}
        <section className="pp-field">
          <label className="pp-field-label">Display Name</label>
          {editingName ? (
            <div className="pp-field-edit-row">
              <input
                className="pp-field-input"
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName()
                  if (e.key === 'Escape') cancelEditName()
                }}
                autoFocus
                maxLength={40}
                placeholder="Enter your name"
              />
              <button className="pp-btn-icon pp-btn-save" onClick={saveName} title="Save">
                <IconCheck />
              </button>
              <button className="pp-btn-icon pp-btn-cancel" onClick={cancelEditName} title="Cancel">
                <IconX />
              </button>
            </div>
          ) : (
            <div className="pp-field-display-row" onClick={startEditName} role="button" tabIndex={0}>
              <span className="pp-field-value">{displayName}</span>
              <span className="pp-field-edit-hint"><IconEdit /></span>
            </div>
          )}
        </section>

        {/* ── Description section ── */}
        <section className="pp-field">
          <label className="pp-field-label">About</label>
          {editingDesc ? (
            <div className="pp-field-edit-row pp-field-edit-col">
              <textarea
                className="pp-field-textarea"
                value={draftDesc}
                onChange={(e) => setDraftDesc(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') cancelEditDesc()
                }}
                autoFocus
                maxLength={200}
                rows={3}
                placeholder="Write something about yourself..."
              />
              <div className="pp-textarea-actions">
                <span className="pp-char-count">{draftDesc.length}/200</span>
                <div className="pp-textarea-btns">
                  <button className="pp-btn-icon pp-btn-save" onClick={saveDesc} title="Save">
                    <IconCheck />
                  </button>
                  <button className="pp-btn-icon pp-btn-cancel" onClick={cancelEditDesc} title="Cancel">
                    <IconX />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pp-field-display-row" onClick={startEditDesc} role="button" tabIndex={0}>
              <span className={`pp-field-value ${!description ? 'pp-placeholder' : ''}`}>
                {description || 'Add a description...'}
              </span>
              <span className="pp-field-edit-hint"><IconEdit /></span>
            </div>
          )}
        </section>

        {/* ── Divider ── */}
        <div className="pp-divider" />

        {/* ── Account info ── */}
        <section className="pp-field pp-field-readonly">
          <label className="pp-field-label">Username</label>
          <span className="pp-field-value pp-field-muted">@{currentUser?.username || '...'}</span>
        </section>

        {/* ── Logout ── */}
        <button
          className="pp-logout-btn"
          onClick={() => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('chatflow_username')
            navigate('/login')
          }}
        >
          <IconLogout />
          <span>Log Out</span>
        </button>
      </main>

      {/* ── Toast ── */}
      {toast && (
        <div className="pp-toast" key={toast}>
          {toast}
        </div>
      )}
    </div>
  )
}
