import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../api'
import './ChatPage.css'

/* ─── No mock data — only real registered users ─── */

const SENDER_COLORS = {}


/* ─── SVG icon components ─── */
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function IconVideo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}

function IconSearchSmall() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.89A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.89A2 2 0 0 0 5 15.24z" />
    </svg>
  )
}

function IconMore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
  )
}

function IconMic() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

function IconAttach() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconImage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function IconFile() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function IconLink() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function IconFolder() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconUserPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconPhoneMissed() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef5350" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="23" y1="1" x2="17" y2="7" /><line x1="17" y1="1" x2="23" y2="7" /><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function IconUserSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="4" />
      <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
      <circle cx="17" cy="17" r="3" />
      <path d="m21 21-1.9-1.9" />
    </svg>
  )
}

function IconMessageSquare() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

/* ─── Users and requests are empty — populated from backend ─── */


/* ─── Main component ─── */
export default function ChatPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [allMessages, setAllMessages] = useState({})
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [typingUsers, setTypingUsers] = useState({})
  const [showFindUsers, setShowFindUsers] = useState(false)
  const [findUserQuery, setFindUserQuery] = useState('')
  const [sentRequests, setSentRequests] = useState([])
  const [findTab, setFindTab] = useState('requests') // 'requests' or 'find'
  const [incomingRequests, setIncomingRequests] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const messagesEndRef = useRef(null)
  const findUserInputRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    async function loadUser() {
      const user = await getCurrentUser()
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser({ id: 0, username: 'You' })
      }
    }
    loadUser()
  }, [navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages, activeConvId])

  const activeConv = conversations.find((c) => c.id === activeConvId)
  const chatMessages = activeConvId ? allMessages[activeConvId] || [] : []

  const pinnedConversations = conversations.filter((c) => c.pinned)
  const allConversations = conversations.filter((c) => !c.pinned)

  const filteredPinned = pinnedConversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredAll = allConversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeConvId) return

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      senderName: 'You',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      reactions: [],
    }

    const updatedMsgs = {
      ...allMessages,
      [activeConvId]: [...(allMessages[activeConvId] || []), newMsg],
    }
    setAllMessages(updatedMsgs)

    // Update last message in conversation list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, lastMsg: messageInput.trim(), time: 'Just now' }
          : c
      )
    )

    setMessageInput('')
  }

  const handleSelectChat = (id) => {
    setActiveConvId(id)
    setShowSidebar(false)
  }

  const handleLogout = () => {
    logout()
  }

  /* ─── find users logic ─── */
  const filteredUsers = findUserQuery.trim()
    ? allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(findUserQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(findUserQuery.toLowerCase())
      )
    : allUsers

  const handleSendRequest = (user) => {
    if (sentRequests.includes(user.id)) return
    setSentRequests((prev) => [...prev, user.id])
  }

  const handleStartChat = (user) => {
    // Check if conversation already exists
    const existingConv = conversations.find(
      (c) => c.name === user.name && c.type === 'direct'
    )
    if (existingConv) {
      setActiveConvId(existingConv.id)
      setShowFindUsers(false)
      setFindUserQuery('')
      return
    }

    // Create new conversation
    const newConv = {
      id: `dm-${user.id}`,
      name: user.name,
      avatar: user.avatar,
      color: user.color,
      lastMsg: 'New conversation',
      time: 'Just now',
      pinned: false,
      online: user.online,
      unread: 0,
      type: 'direct',
    }
    setConversations((prev) => [newConv, ...prev])
    setActiveConvId(newConv.id)
    setShowFindUsers(false)
    setFindUserQuery('')
    setShowSidebar(false)
  }

  useEffect(() => {
    if (showFindUsers && findTab === 'find' && findUserInputRef.current) {
      findUserInputRef.current.focus()
    }
  }, [showFindUsers, findTab])

  const handleAcceptRequest = (req) => {
    // Create a new conversation with this person
    const newConv = {
      id: `dm-${req.id}`,
      name: req.name,
      avatar: req.avatar,
      color: req.color,
      lastMsg: req.message,
      time: 'Just now',
      pinned: false,
      online: req.online,
      unread: 1,
      type: 'direct',
    }
    setConversations((prev) => [newConv, ...prev])
    setIncomingRequests((prev) => prev.filter((r) => r.id !== req.id))
  }

  const handleDeclineRequest = (reqId) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== reqId))
  }

  const handleAcceptAll = () => {
    incomingRequests.forEach((req) => {
      const newConv = {
        id: `dm-${req.id}`,
        name: req.name,
        avatar: req.avatar,
        color: req.color,
        lastMsg: req.message,
        time: 'Just now',
        pinned: false,
        online: req.online,
        unread: 1,
        type: 'direct',
      }
      setConversations((prev) => [newConv, ...prev])
    })
    setIncomingRequests([])
  }

  const totalAttachments = activeConv?.attachments
    ? Object.values(activeConv.attachments).reduce(
        (sum, a) => sum + a.count,
        0
      )
    : 0

  /* ─── render conversation item ─── */
  const renderConvItem = (conv) => (
    <div
      key={conv.id}
      className={`tg-conv-item ${activeConvId === conv.id ? 'tg-conv-active' : ''}`}
      onClick={() => handleSelectChat(conv.id)}
    >
      <div className="tg-conv-avatar" style={{ background: conv.color }}>
        <span>{conv.avatar}</span>
        {conv.online && <span className="tg-online-dot" />}
      </div>
      <div className="tg-conv-body">
        <div className="tg-conv-row-top">
          <span className="tg-conv-name">{conv.name}</span>
          <span className="tg-conv-time">{conv.time}</span>
        </div>
        <div className="tg-conv-row-bottom">
          {conv.lastMsgType === 'missed-call' ? (
            <span className="tg-conv-last tg-missed-call">
              <IconPhoneMissed />
              {conv.lastMsg}
            </span>
          ) : conv.lastMsg?.includes('typing') ? (
            <span className="tg-conv-last tg-typing-preview">
              {conv.lastMsg}
            </span>
          ) : (
            <span className="tg-conv-last">{conv.lastMsg}</span>
          )}
          {conv.unread > 0 && (
            <span className="tg-conv-unread">{conv.unread}</span>
          )}
        </div>
      </div>
    </div>
  )

  if (!currentUser) {
    return (
      <div className="tg-loading">
        <div className="tg-loading-spinner" />
        <p>Loading ChatFlow...</p>
      </div>
    )
  }

  return (
    <div className="tg-app">
      {/* ═══════════ LEFT SIDEBAR ═══════════ */}
      <aside className={`tg-sidebar ${showSidebar ? 'tg-sidebar-open' : ''}`}>
        {/* sidebar header */}
        <div className="tg-sidebar-header">
          <div className="tg-sidebar-header-top">
            <div className="tg-sidebar-title-row">
              <button className="tg-icon-btn tg-menu-btn" onClick={handleLogout} title="Logout">
                <IconLogout />
              </button>
              <h2 className="tg-sidebar-title">
                Messages <span className="tg-msg-count">({conversations.length})</span>
              </h2>
            </div>
            <div className="tg-sidebar-actions">
              <button
                className={`tg-icon-btn tg-find-users-btn ${showFindUsers ? 'tg-btn-active' : ''}`}
                title="Find users & requests"
                onClick={() => setShowFindUsers(!showFindUsers)}
              >
                <IconUserSearch />
                {incomingRequests.length > 0 && (
                  <span className="tg-request-badge">{incomingRequests.length}</span>
                )}
              </button>
              <button className="tg-icon-btn" title="New message">
                <IconEdit />
              </button>
            </div>
          </div>
          <div className="tg-search-bar">
            <IconSearch />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ─── Find Users / Requests Modal ─── */}
        {showFindUsers && (
          <div className="tg-find-overlay">
            <div className="tg-find-modal">
              {/* Modal header with close */}
              <div className="tg-find-header">
                <h3 className="tg-find-title">
                  {findTab === 'requests' ? 'Requests' : 'Find People'}
                </h3>
                <button
                  className="tg-icon-btn"
                  onClick={() => { setShowFindUsers(false); setFindUserQuery(''); }}
                >
                  <IconClose />
                </button>
              </div>

              {/* Tab bar */}
              <div className="tg-find-tabs">
                <button
                  className={`tg-find-tab ${findTab === 'requests' ? 'tg-find-tab-active' : ''}`}
                  onClick={() => setFindTab('requests')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
                    <line x1="18" y1="8" x2="18" y2="14" /><line x1="15" y1="11" x2="21" y2="11" />
                  </svg>
                  Requests
                  {incomingRequests.length > 0 && (
                    <span className="tg-tab-badge">{incomingRequests.length}</span>
                  )}
                </button>
                <button
                  className={`tg-find-tab ${findTab === 'find' ? 'tg-find-tab-active' : ''}`}
                  onClick={() => setFindTab('find')}
                >
                  <IconUserSearch />
                  Find People
                </button>
              </div>

              {/* REQUESTS TAB */}
              {findTab === 'requests' && (
                <div className="tg-find-results">
                  {incomingRequests.length === 0 ? (
                    <div className="tg-find-empty">
                      <span className="tg-find-empty-icon">✅</span>
                      <p>No pending requests</p>
                      <span className="tg-find-empty-sub">You're all caught up!</span>
                    </div>
                  ) : (
                    <>
                      {/* Accept all bar */}
                      {incomingRequests.length > 1 && (
                        <div className="tg-requests-actions-bar">
                          <span className="tg-requests-count">{incomingRequests.length} pending</span>
                          <button className="tg-accept-all-btn" onClick={handleAcceptAll}>
                            Accept all
                          </button>
                        </div>
                      )}
                      {incomingRequests.map((req) => (
                        <div key={req.id} className="tg-request-card">
                          <div className="tg-request-card-top">
                            <div className="tg-find-user-avatar" style={{ background: req.color }}>
                              <span>{req.avatar}</span>
                              {req.online && <span className="tg-online-dot" />}
                            </div>
                            <div className="tg-find-user-info">
                              <span className="tg-find-user-name">{req.name}</span>
                              <span className="tg-find-user-handle">{req.username}</span>
                            </div>
                          </div>
                          <p className="tg-request-message">"{req.message}"</p>
                          <div className="tg-request-card-actions">
                            <button
                              className="tg-request-accept-btn"
                              onClick={() => handleAcceptRequest(req)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Accept
                            </button>
                            <button
                              className="tg-request-decline-btn"
                              onClick={() => handleDeclineRequest(req.id)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* FIND PEOPLE TAB */}
              {findTab === 'find' && (
                <>
                  <div className="tg-find-search">
                    <IconSearch />
                    <input
                      ref={findUserInputRef}
                      type="text"
                      placeholder="Search by name or username..."
                      value={findUserQuery}
                      onChange={(e) => setFindUserQuery(e.target.value)}
                    />
                  </div>

                  <div className="tg-find-results">
                    {filteredUsers.length === 0 ? (
                      <div className="tg-find-empty">
                        <span className="tg-find-empty-icon">🔍</span>
                        <p>No users found for "{findUserQuery}"</p>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div key={user.id} className="tg-find-user">
                          <div className="tg-find-user-avatar" style={{ background: user.color }}>
                            <span>{user.avatar}</span>
                            {user.online && <span className="tg-online-dot" />}
                          </div>
                          <div className="tg-find-user-info">
                            <span className="tg-find-user-name">{user.name}</span>
                            <span className="tg-find-user-handle">{user.username}</span>
                          </div>
                          <div className="tg-find-user-actions">
                            <button
                              className="tg-find-chat-btn"
                              onClick={() => handleStartChat(user)}
                              title="Start chat"
                            >
                              <IconMessageSquare />
                              <span>Chat</span>
                            </button>
                            <button
                              className={`tg-find-request-btn ${sentRequests.includes(user.id) ? 'tg-request-sent' : ''}`}
                              onClick={() => handleSendRequest(user)}
                              disabled={sentRequests.includes(user.id)}
                              title={sentRequests.includes(user.id) ? 'Request sent' : 'Send request'}
                            >
                              {sentRequests.includes(user.id) ? (
                                <>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  <span>Sent</span>
                                </>
                              ) : (
                                <>
                                  <IconUserPlus />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* conversation list */}
        <div className="tg-conv-list">
          {/* pinned section */}
          {filteredPinned.length > 0 && (
            <>
              <div className="tg-conv-section-header">
                <span>📌</span>
                <span>PINNED MESSAGE</span>
                <button className="tg-icon-btn-sm">
                  <IconMore />
                </button>
              </div>
              {filteredPinned.map(renderConvItem)}
            </>
          )}

          {/* all messages */}
          {filteredAll.length > 0 && (
            <>
              <div className="tg-conv-section-header">
                <span>💬</span>
                <span>ALL MESSAGE</span>
              </div>
              {filteredAll.map(renderConvItem)}
            </>
          )}

          {filteredPinned.length === 0 && filteredAll.length === 0 && (
            <div className="tg-conv-empty">
              <p>No conversations found</p>
            </div>
          )}
        </div>

        {/* sidebar bottom nav */}
        <div className="tg-sidebar-bottom">
          <button className="tg-nav-btn tg-nav-active" title="Chats">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button className="tg-nav-btn" title="Contacts">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </button>
          <button className="tg-nav-btn" title="Calls">
            <IconPhone />
          </button>
          <button className="tg-nav-btn" title="Settings">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </aside>

      {/*CENTER CHAT  */}
      <main className="tg-chat">
        {activeConv ? (
          <>
            {/* chat header */}
            <div className="tg-chat-header">
              <button
                className="tg-icon-btn tg-back-btn"
                onClick={() => setShowSidebar(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div
                className="tg-chat-header-avatar"
                style={{ background: activeConv.color }}
              >
                <span>{activeConv.avatar}</span>
              </div>

              <div
                className="tg-chat-header-info"
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                style={{ cursor: 'pointer' }}
              >
                <span className="tg-chat-header-name">{activeConv.name}</span>
                <span className="tg-chat-header-status">
                  {activeConv.type === 'group'
                    ? `${activeConv.memberCount} members, ${activeConv.onlineCount} online`
                    : activeConv.online
                    ? 'online'
                    : 'last seen recently'}
                </span>
              </div>

              <div className="tg-chat-header-actions">
                <button className="tg-icon-btn"><IconPhone /></button>
                <button className="tg-icon-btn"><IconVideo /></button>
                <button className="tg-icon-btn"><IconSearchSmall /></button>
                <button className="tg-icon-btn"><IconPin /></button>
                <button
                  className="tg-icon-btn"
                  onClick={() => setShowInfoPanel(!showInfoPanel)}
                >
                  <IconMore />
                </button>
              </div>
            </div>

            {/* messages area */}
            <div className="tg-messages">
              {chatMessages.length === 0 ? (
                <div className="tg-messages-empty">
                  <div className="tg-empty-icon">💬</div>
                  <h3>No messages yet</h3>
                  <p>Send a message to start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`tg-msg ${msg.sender === 'me' ? 'tg-msg-sent' : 'tg-msg-received'}`}
                  >
                    {msg.sender !== 'me' && (
                      <span
                        className="tg-msg-sender"
                        style={{
                          color: SENDER_COLORS[msg.senderName] || '#7c4dff',
                        }}
                      >
                        {msg.senderName}
                      </span>
                    )}
                    {msg.sender === 'me' && (
                      <span className="tg-msg-sender-right">
                        <span className="tg-msg-sender-name" style={{ color: SENDER_COLORS[msg.senderName] || '#7c4dff' }}>
                          {msg.senderName}
                        </span>
                        <span className="tg-msg-time">{msg.time}</span>
                      </span>
                    )}
                    {msg.sender !== 'me' && (
                      <span className="tg-msg-time tg-msg-time-left">
                        {msg.time}
                      </span>
                    )}
                    <p className="tg-msg-text">{msg.text}</p>
                    {msg.image && (
                      <div className="tg-msg-image">
                        <img src={msg.image} alt="shared" loading="lazy" />
                      </div>
                    )}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="tg-msg-reactions">
                        {msg.reactions.map((r, i) => (
                          <button key={i} className="tg-reaction-pill">
                            <span>{r.emoji}</span>
                            <span className="tg-reaction-count">{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* typing indicator */}
              {typingUsers[activeConvId] && (
                <div className="tg-typing-indicator">
                  <span className="tg-typing-name">
                    {typingUsers[activeConvId]}
                  </span>{' '}
                  is typing
                  <span className="tg-typing-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* message input */}
            <form className="tg-input-area" onSubmit={handleSend}>
              <button type="button" className="tg-input-icon-btn">
                <span className="tg-emoji-btn">😊</span>
              </button>
              <input
                type="text"
                className="tg-message-input"
                placeholder="Your message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button type="button" className="tg-input-icon-btn">
                <IconMic />
              </button>
              <button type="button" className="tg-input-icon-btn">
                <IconAttach />
              </button>
              <button
                type="submit"
                className="tg-send-btn"
                disabled={!messageInput.trim()}
              >
                <IconSend />
              </button>
            </form>
          </>
        ) : (
          <div className="tg-messages-empty">
            <div className="tg-empty-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Choose someone from your contacts to start chatting</p>
          </div>
        )}
      </main>

      {/* ═══════════ RIGHT INFO PANEL ═══════════ */}
      {showInfoPanel && activeConv && (
        <aside className="tg-info-panel">
          <div className="tg-info-header">
            <button
              className="tg-icon-btn"
              onClick={() => setShowInfoPanel(false)}
            >
              <IconClose />
            </button>
          </div>

          {/* profile section */}
          <div className="tg-info-profile">
            <div
              className="tg-info-avatar"
              style={{ background: activeConv.color }}
            >
              <span>{activeConv.avatar}</span>
            </div>
            <h3 className="tg-info-name">{activeConv.name}</h3>
          </div>

          {/* members */}
          {activeConv.type === 'group' && activeConv.members && (
            <div className="tg-info-section">
              <div className="tg-info-section-header">
                <span className="tg-info-section-title">
                  MEMBERS{' '}
                  <span className="tg-info-section-count">
                    {activeConv.memberCount}
                  </span>
                </span>
                <button className="tg-icon-btn-sm">
                  <IconChevron />
                </button>
              </div>

              <div className="tg-info-members">
                {activeConv.members.map((m) => (
                  <div key={m.id} className="tg-info-member">
                    <div
                      className="tg-info-member-avatar"
                      style={{ background: m.color }}
                    >
                      <span>{m.avatar}</span>
                    </div>
                    <span className="tg-info-member-name">{m.name}</span>
                  </div>
                ))}
              </div>

              <button className="tg-add-member-btn">
                <IconUserPlus />
                <span>Add member</span>
              </button>
            </div>
          )}

          {/* attachments */}
          {activeConv.attachments && (
            <div className="tg-info-section">
              <div className="tg-info-section-header">
                <span className="tg-info-section-title">
                  ATTACHMENTS{' '}
                  <span className="tg-info-section-count">
                    {totalAttachments}
                  </span>
                </span>
                <button className="tg-icon-btn-sm">
                  <IconChevron />
                </button>
              </div>

              <div className="tg-info-attachments">
                <div className="tg-info-attachment-item">
                  <div className="tg-info-attachment-icon tg-att-media">
                    <IconImage />
                  </div>
                  <div className="tg-info-attachment-info">
                    <span className="tg-info-attachment-label">Media</span>
                    <span className="tg-info-attachment-meta">
                      {activeConv.attachments.media.count} Files •{' '}
                      {activeConv.attachments.media.size}
                    </span>
                  </div>
                </div>

                <div className="tg-info-attachment-item">
                  <div className="tg-info-attachment-icon tg-att-files">
                    <IconFile />
                  </div>
                  <div className="tg-info-attachment-info">
                    <span className="tg-info-attachment-label">Files</span>
                    <span className="tg-info-attachment-meta">
                      {activeConv.attachments.files.count} Files •{' '}
                      {activeConv.attachments.files.size}
                    </span>
                  </div>
                </div>

                <div className="tg-info-attachment-item">
                  <div className="tg-info-attachment-icon tg-att-links">
                    <IconLink />
                  </div>
                  <div className="tg-info-attachment-info">
                    <span className="tg-info-attachment-label">Links</span>
                    <span className="tg-info-attachment-meta">
                      {activeConv.attachments.links.count} Files •{' '}
                      {activeConv.attachments.links.size}
                    </span>
                  </div>
                </div>

                <div className="tg-info-attachment-item">
                  <div className="tg-info-attachment-icon tg-att-other">
                    <IconFolder />
                  </div>
                  <div className="tg-info-attachment-info">
                    <span className="tg-info-attachment-label">Other</span>
                    <span className="tg-info-attachment-meta">
                      {activeConv.attachments.other.count} Files •{' '}
                      {activeConv.attachments.other.size}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* notifications */}
          <div className="tg-info-section tg-info-notifications">
            <span className="tg-info-notif-label">Notifications</span>
            <label className="tg-toggle">
              <input type="checkbox" defaultChecked />
              <span className="tg-toggle-slider" />
            </label>
          </div>
        </aside>
      )}
    </div>
  )
}
