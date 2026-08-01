import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('chatflow_current_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('chatflow_current_user')
    setUser(null)
    navigate('/')
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              stroke="url(#navbar-brand-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="navbar-brand-grad" x1="3" y1="3" x2="21" y2="21">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <span className="gradient-text font-bold">ChatFlow</span>
        </Link>

        <ul className={`navbar-links ${mobileMenuOpen ? 'navbar-links-mobile-active' : ''}`}>
          <li><a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
          <li><a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a></li>
          {user ? (
            <>
              <li className="mobile-only"><Link to="/chat" onClick={() => setMobileMenuOpen(false)}>Go to Chat</Link></li>
              <li className="mobile-only"><button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="navbar-logout-btn-mobile">Logout</button></li>
            </>
          ) : (
            <>
              <li className="mobile-only"><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link></li>
              <li className="mobile-only"><Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="navbar-btn">Get Started</Link></li>
            </>
          )}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user-info">
              <span className="navbar-username">Hi, {user.name}</span>
              <Link to="/chat" className="navbar-btn navbar-btn-primary">
                Go to Chat
              </Link>
              <button onClick={handleLogout} className="navbar-logout-btn" title="Logout">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-btn-link">Sign In</Link>
              <Link to="/signup" className="navbar-btn navbar-btn-primary">Get Started</Link>
            </>
          )}
        </div>

        <button className="navbar-hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </nav>
  )
}
