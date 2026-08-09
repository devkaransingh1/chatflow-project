import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './AuthForm.css'

const API_BASE_URL = 'http://127.0.0.1:8000'

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validate = () => {
    const errs = {}

    if (!formData.username.trim()) {
      errs.username = 'Username is required'
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        errs.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = 'Enter a valid email'
      }
    }

    if (!formData.password) {
      errs.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errs.password = 'At least 6 characters'
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        errs.confirmPassword = 'Confirm password is required'
      } else if (formData.password !== formData.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match'
      }
    }

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate()

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      if (isLogin) {
        // LOGIN
        const response = await fetch(`${API_BASE_URL}/api/token/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setErrors({
            general:
              data.detail || 'Invalid username or password',
          })
          return
        }

        // Save JWT tokens
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)

        navigate('/chat')
      } else {
        // SIGNUP
        const response = await fetch(
          `${API_BASE_URL}/api/users/signup/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.username.trim(),
              email: formData.email.trim(),
              password: formData.password,
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          const backendErrors = {}

          Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
              backendErrors[key] = data[key][0]
            } else {
              backendErrors[key] = data[key]
            }
          })

          setErrors(backendErrors)
          return
        }

        // Signup successful
        navigate('/login')
      }
    } catch (error) {
      console.error(error)

      setErrors({
        general: 'Unable to connect to the server',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>

      {/* GENERAL ERROR */}
      {errors.general && (
        <div className="auth-error">
          {errors.general}
        </div>
      )}

      {/* USERNAME */}
      <div
        className={`auth-field animate-fade-in-up ${
          isLogin ? 'delay-1' : 'delay-1'
        }`}
      >
        <label className="auth-label" htmlFor="username">
          Username
        </label>

        <div
          className={`auth-input-wrapper ${
            errors.username ? 'auth-input-error' : ''
          }`}
        >
          <span className="auth-input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>

          <input
            id="username"
            name="username"
            type="text"
            className="auth-input"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>

        {errors.username && (
          <span className="auth-error">{errors.username}</span>
        )}
      </div>

      {/* EMAIL - SIGNUP ONLY */}
      {!isLogin && (
        <div className="auth-field animate-fade-in-up delay-2">
          <label className="auth-label" htmlFor="email">
            Email
          </label>

          <div
            className={`auth-input-wrapper ${
              errors.email ? 'auth-input-error' : ''
            }`}
          >
            <span className="auth-input-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="2"
                  y="4"
                  width="20"
                  height="16"
                  rx="2"
                />
                <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
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

          {errors.email && (
            <span className="auth-error">{errors.email}</span>
          )}
        </div>
      )}

      {/* PASSWORD */}
      <div
        className={`auth-field animate-fade-in-up ${
          isLogin ? 'delay-2' : 'delay-3'
        }`}
      >
        <label className="auth-label" htmlFor="password">
          Password
        </label>

        <div
          className={`auth-input-wrapper ${
            errors.password ? 'auth-input-error' : ''
          }`}
        >
          <span className="auth-input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
              />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </span>

          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className="auth-input"
            placeholder={
              isLogin
                ? 'Enter your password'
                : 'Min 6 characters'
            }
            value={formData.password}
            onChange={handleChange}
            autoComplete={
              isLogin ? 'current-password' : 'new-password'
            }
          />

          <button
            type="button"
            className="auth-input-toggle"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {errors.password && (
          <span className="auth-error">{errors.password}</span>
        )}
      </div>

      {/* CONFIRM PASSWORD - SIGNUP ONLY */}
      {!isLogin && (
        <div className="auth-field animate-fade-in-up delay-4">
          <label
            className="auth-label"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>

          <div
            className={`auth-input-wrapper ${
              errors.confirmPassword
                ? 'auth-input-error'
                : ''
            }`}
          >
            <span className="auth-input-icon">
              🔒
            </span>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          {errors.confirmPassword && (
            <span className="auth-error">
              {errors.confirmPassword}
            </span>
          )}
        </div>
      )}

      {/* FORGOT PASSWORD */}
      {isLogin && (
        <div className="auth-forgot animate-fade-in-up delay-3">
          <a href="#" className="auth-forgot-link">
            Forgot password?
          </a>
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        className={`auth-btn auth-btn-primary animate-fade-in-up ${
          isLogin ? 'delay-4' : 'delay-5'
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'Please wait...'
          : isLogin
          ? 'Sign In'
          : 'Create Account'}
      </button>

      {/* DIVIDER */}
      <div
        className={`auth-divider animate-fade-in-up ${
          isLogin ? 'delay-5' : 'delay-6'
        }`}
      >
        <span className="auth-divider-line" />
        <span className="auth-divider-text">
          {isLogin
            ? 'New here?'
            : 'Already have an account?'}
        </span>
        <span className="auth-divider-line" />
      </div>

      {/* SWITCH */}
      <Link
        to={isLogin ? '/signup' : '/login'}
        className={`auth-btn auth-btn-outline animate-fade-in-up ${
          isLogin ? 'delay-6' : 'delay-7'
        }`}
      >
        {isLogin
          ? 'Create an Account'
          : 'Sign In Instead'}
      </Link>
    </form>
  )
}