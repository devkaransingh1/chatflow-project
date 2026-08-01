import { Link } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import AnimatedBackground from '../components/AnimatedBackground'
import './AuthPage.css'

export default function SignupPage() {
  return (
    <div className="auth-page">
      <AnimatedBackground />
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-container">
        <div className="auth-branding">
          <div className="auth-branding-content">
            <Link to="/" className="auth-branding-logo animate-fade-in-up delay-1">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                  stroke="url(#brand-grad2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="brand-grad2" x1="3" y1="3" x2="21" y2="21">
                    <stop stopColor="#fff" />
                    <stop offset="1" stopColor="rgba(255,255,255,0.6)" />
                  </linearGradient>
                </defs>
              </svg>
              <span>ChatFlow</span>
            </Link>

            <h2 className="auth-branding-title animate-fade-in-up delay-2">
              Join ChatFlow
            </h2>
            <p className="auth-branding-desc animate-fade-in-up delay-3">
              Create your account and start connecting with people around the world instantly.
            </p>

            <div className="auth-branding-features animate-fade-in-up delay-4">
              <div className="auth-branding-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Free forever — no credit card</span>
              </div>
              <div className="auth-branding-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Unlimited messages & groups</span>
              </div>
              <div className="auth-branding-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Set up in under 30 seconds</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-form-header animate-fade-in-up">
              <h1 className="auth-form-title">Create Account</h1>
              <p className="auth-form-subtitle">
                Pick a username, enter your email, and set a password
              </p>
            </div>
            <AuthForm mode="signup" />
          </div>
        </div>
      </div>
    </div>
  )
}
