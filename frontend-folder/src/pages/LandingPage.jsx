import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'
import './LandingPage.css'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Lightning Fast',
    description: 'Real-time messaging with sub-second delivery. No delays, no lag — just instant communication.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: 'End-to-End Encrypted',
    description: 'Your conversations stay private. Military-grade encryption ensures only you and your contacts can read messages.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Group Chats',
    description: 'Create groups of any size. Share media, pin messages, and manage members with ease.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    title: 'Cross-Platform',
    description: 'Available on web, desktop, and mobile. Your chats sync seamlessly across all your devices.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: 'Customizable',
    description: 'Themes, chat backgrounds, notification preferences — make ChatFlow truly yours.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: 'Smart Replies',
    description: 'AI-powered suggestions help you respond faster with context-aware smart reply options.',
  },
]

const steps = [
  { number: '01', title: 'Create your account', description: 'Sign up in seconds with just a username, email and password.' },
  { number: '02', title: 'Find your people', description: 'Search for friends or share your unique link to connect instantly.' },
  { number: '03', title: 'Start chatting', description: 'Send messages, share media, and enjoy real-time conversations.' },
]

export default function LandingPage() {
  return (
    <div className="landing">
      <AnimatedBackground />
      <Navbar />

      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-content">
          <div className="hero-badge animate-fade-in-up delay-1">
            <span className="hero-badge-dot" />
            Now in Open Beta
          </div>

          <h1 className="hero-title animate-fade-in-up delay-2">
            Connect. Chat.<br />
            <span className="gradient-text">Experience Flow.</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up delay-3">
            The next generation chat platform built for speed, privacy, and beautiful conversations.
            Join thousands already experiencing a better way to connect.
          </p>

          <div className="hero-actions animate-fade-in-up delay-4">
            <Link to="/signup" className="hero-btn hero-btn-primary">
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="#features" className="hero-btn hero-btn-secondary">
              See Features
            </a>
          </div>

          <div className="hero-stats animate-fade-in-up delay-5">
            <div className="hero-stat">
              <span className="hero-stat-value">50K+</span>
              <span className="hero-stat-label">Active Users</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">2M+</span>
              <span className="hero-stat-label">Messages Sent</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">99.9%</span>
              <span className="hero-stat-label">Uptime</span>
            </div>
          </div>
        </div>

        <div className="hero-preview animate-fade-in-up delay-6">
          <div className="chat-preview">
            <div className="chat-preview-header">
              <div className="chat-preview-avatar" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>A</div>
              <div>
                <div className="chat-preview-name">Alice Chen</div>
                <div className="chat-preview-status">
                  <span className="chat-preview-status-dot" />
                  Online
                </div>
              </div>
            </div>
            <div className="chat-preview-messages">
              <div className="chat-msg chat-msg-received">
                <p>Hey! Have you tried ChatFlow yet? 🚀</p>
                <span className="chat-msg-time">10:42 AM</span>
              </div>
              <div className="chat-msg chat-msg-sent">
                <p>Just signed up — the UI is incredible! ✨</p>
                <span className="chat-msg-time">10:43 AM</span>
              </div>
              <div className="chat-msg chat-msg-received">
                <p>Right? And the speed is unreal. Messages arrive instantly.</p>
                <span className="chat-msg-time">10:43 AM</span>
              </div>
              <div className="chat-msg chat-msg-sent">
                <p>Love it already. Inviting the whole team! 🎉</p>
                <span className="chat-msg-time">10:44 AM</span>
              </div>
            </div>
            <div className="chat-preview-input">
              <span className="chat-preview-input-placeholder">Type a message...</span>
              <div className="chat-preview-send">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-header animate-fade-in-up">
          <span className="section-tag">Features</span>
          <h2 className="section-title">
            Everything you need to<br />
            <span className="gradient-text">stay connected</span>
          </h2>
          <p className="section-subtitle">
            Powerful features designed to make your conversations seamless and enjoyable.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card animate-fade-in-up"
              style={{ animationDelay: `${0.1 + i * 0.1}s`, opacity: 0 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="section-header animate-fade-in-up">
          <span className="section-tag">How it works</span>
          <h2 className="section-title">
            Get started in <span className="gradient-text">3 simple steps</span>
          </h2>
        </div>

        <div className="steps-container">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="step-card animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.15}s`, opacity: 0 }}
            >
              <span className="step-number">{step.number}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta animate-fade-in-up">
        <div className="cta-inner">
          <div className="cta-glow" />
          <h2 className="cta-title">
            Ready to experience <span className="gradient-text">ChatFlow</span>?
          </h2>
          <p className="cta-subtitle">
            Join thousands of people who are already enjoying faster, more private conversations.
          </p>
          <Link to="/signup" className="cta-btn">
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>ChatFlow</span>
            <p className="footer-tagline">Connect. Chat. Experience Flow.</p>
          </div>
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} ChatFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
