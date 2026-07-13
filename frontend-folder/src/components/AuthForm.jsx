import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './AuthForm.css'

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!isLogin && !formData.username.trim()) {
      errs.username = 'Username is required'
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email'
    }
    if (!formData.password) {
      errs.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errs.password = 'At least 6 characters'
    }
    return errs
  }

  const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#a29bfe', '#55efc4', '#fab1a0', '#e84393', '#0984e3', '#2d3436']
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSubmitting(false)

    const storedUsers = JSON.parse(localStorage.getItem('chatflow_users') || '[]')

    if (!isLogin) {
      const newUser = {
        id: Date.now().toString(),
        name: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        avatar: formData.username.trim().charAt(0).toUpperCase(),
        color: getRandomColor(),
        lastMsg: 'Joined ChatFlow 🎉',
        time: 'Just now',
        unread: 0,
        online: true
      }
      
      const userExists = storedUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())
      if (!userExists) {
        storedUsers.push(newUser)
        localStorage.setItem('chatflow_users', JSON.stringify(storedUsers))
      }
      localStorage.setItem('chatflow_current_user', JSON.stringify(newUser))
    } else {
      let matchedUser = storedUsers.find(u => u.email.toLowerCase() === formData.email.trim().toLowerCase())
      if (!matchedUser) {
        matchedUser = {
          id: Date.now().toString(),
          name: formData.email.split('@')[0],
          email: formData.email.trim(),
          password: formData.password,
          avatar: formData.email.charAt(0).toUpperCase(),
          color: getRandomColor(),
          lastMsg: 'Joined ChatFlow 🎉',
          time: 'Just now',
          unread: 0,
          online: true
        }
        storedUsers.push(matchedUser)
        localStorage.setItem('chatflow_users', JSON.stringify(storedUsers))
      }
      localStorage.setItem('chatflow_current_user', JSON.stringify(matchedUser))
    }

    navigate('/chat')
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {!isLogin && (
        <div className="auth-field animate-fade-in-up delay-1">
          <label className="auth-label" htmlFor="username">Username</label>
          <div className={`auth-input-wrapper ${errors.username ? 'auth-input-error' : ''}`}>
            <span className="auth-input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="username"
              name="username"
              type="text"
              className="auth-input"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>
          {errors.username && <span className="auth-error">{errors.username}</span>}
        </div>
      )}

      <div className={`auth-field animate-fade-in-up ${isLogin ? 'delay-1' : 'delay-2'}`}>
        <label className="auth-label" htmlFor="email">Email</label>
        <div className={`auth-input-wrapper ${errors.email ? 'auth-input-error' : ''}`}>
          <span className="auth-input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
            </svg>
          </span>
          <input
            id="email"
            name="email"
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
        {errors.email && <span className="auth-error">{errors.email}</span>}
      </div>

      <div className={`auth-field animate-fade-in-up ${isLogin ? 'delay-2' : 'delay-3'}`}>
        <label className="auth-label" htmlFor="password">Password</label>
        <div className={`auth-input-wrapper ${errors.password ? 'auth-input-error' : ''}`}>
          <span className="auth-input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className="auth-input"
            placeholder={isLogin ? 'Enter your password' : 'Min 6 characters'}
            value={formData.password}
            onChange={handleChange}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          <button
            type="button"
            className="auth-input-toggle"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <span className="auth-error">{errors.password}</span>}
      </div>
      <div className={`auth-field animate-fade-in-up ${isLogin ? 'delay-2' : 'delay-3'}`}>
        <label className="auth-label" htmlFor="password">Confirm Password</label>
        <div className={`auth-input-wrapper ${errors.password ? 'auth-input-error' : ''}`}>
          <span className="auth-input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className="auth-input"
            placeholder={isLogin ? 'Enter your password' : 'Min 6 characters'}
            value={formData.password}
            onChange={handleChange}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          <button
            type="button"
            className="auth-input-toggle"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <span className="auth-error">{errors.password}</span>}
      </div>

      {isLogin && (
        <div className="auth-forgot animate-fade-in-up delay-3">
          <a href="#" className="auth-forgot-link">Forgot password?</a>
        </div>
      )}

      <button
        type="submit"
        className="auth-btn auth-btn-primary animate-fade-in-up delay-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="auth-spinner" />
        ) : isLogin ? (
          'Sign In'
        ) : (
          'Create Account'
        )}
      </button>

      <div className="auth-divider animate-fade-in-up delay-5">
        <span className="auth-divider-line" />
        <span className="auth-divider-text">{isLogin ? 'New here?' : 'Already have an account?'}</span>
        <span className="auth-divider-line" />
      </div>

      <Link
        to={isLogin ? '/signup' : '/login'}
        className="auth-btn auth-btn-outline animate-fade-in-up delay-6"
      >
        {isLogin ? 'Create an Account' : 'Sign In Instead'}
      </Link>
    </form>
  )
}
