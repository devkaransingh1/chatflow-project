import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ChatPage.css'

export default function ChatPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [contacts, setContacts] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState({})
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSidebar, setShowSidebar] = useState(true)

useEffect(() => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    navigate('/login')
    return
  }

  // Temporary user object until we connect
  // the chat page to the Django API.
  setCurrentUser({
    username: 'You',
  })

  const allUsers = JSON.parse(
    localStorage.getItem('chatflow_users') || '[]'
  )

  setContacts(allUsers)

  if (allUsers.length > 0) {
    setActiveChat(allUsers[0].id)
  }

  const storedMsgs = JSON.parse(
    localStorage.getItem('chatflow_messages') || '{}'
  )

  setMessages(storedMsgs)
}, [navigate])

  const activeContact = contacts.find(c => c.id === activeChat)
  const chatMessages = activeChat ? (messages[activeChat] || []) : []

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeChat) return

    const newMsg = {
      id: Date.now().toString(),
      sender: 'me',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedMsgs = {
      ...messages,
      [activeChat]: [...(messages[activeChat] || []), newMsg],
    }

    setMessages(updatedMsgs)
    localStorage.setItem('chatflow_messages', JSON.stringify(updatedMsgs))

    const allUsers = JSON.parse(localStorage.getItem('chatflow_users') || '[]')
    const updatedUsers = allUsers.map(u => {
      if (u.id === activeChat) {
        return { ...u, lastMsg: messageInput.trim(), time: 'Just now' }
      }
      return u
    })
    localStorage.setItem('chatflow_users', JSON.stringify(updatedUsers))
    
    const user = JSON.parse(localStorage.getItem('chatflow_current_user'))
    const otherUsers = updatedUsers.filter(u => u.email !== user.email)
    setContacts(otherUsers)

    setMessageInput('')
  }

  const handleSelectChat = (id) => {
    setActiveChat(id)
    setShowSidebar(false)
  }

  const handleLogout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  navigate('/login')
}

  return (
    <div className="chat-page">
      <div className={`chat-sidebar ${showSidebar ? 'chat-sidebar-active' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <h2 className="sidebar-title gradient-text">ChatFlow</h2>
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
          <div className="sidebar-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="sidebar-contacts">
          {filteredContacts.length === 0 ? (
            <div className="sidebar-no-contacts">
              <p>No contacts found.</p>
              <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '8px', padding: '0 16px', lineHeight: '1.4' }}>
                Open an Incognito/Private window and sign up another user to start a real-time simulated chat!
              </small>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`contact-item ${activeChat === contact.id ? 'contact-active' : ''}`}
                onClick={() => handleSelectChat(contact.id)}
              >
                <div className="contact-avatar" style={{ background: contact.color }}>
                  {contact.avatar}
                  {contact.online && <span className="contact-online-dot" />}
                </div>
                <div className="contact-info">
                  <div className="contact-top">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-time">{contact.time}</span>
                  </div>
                  <div className="contact-bottom">
                    <span className="contact-last-msg">{contact.lastMsg}</span>
                    {contact.unread > 0 && (
                      <span className="contact-unread">{contact.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-main">
        {activeContact ? (
          <>
            <div className="chat-header">
              <button className="chat-back-btn" onClick={() => setShowSidebar(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="chat-header-avatar" style={{ background: activeContact.color }}>
                {activeContact.avatar}
              </div>
              <div className="chat-header-info">
                <span className="chat-header-name">{activeContact.name}</span>
                <span className="chat-header-status">
                  {activeContact.online ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="chat-header-actions">
                <button className="chat-header-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </button>
                <button className="chat-header-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No messages yet. Send a message to start the conversation!
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`msg ${msg.sender === 'me' ? 'msg-sent' : 'msg-received'}`}>
                    <p className="msg-text">{msg.text}</p>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                ))
              )}
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
              <button type="button" className="chat-input-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>
              <button type="button" className="chat-input-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button type="submit" className="chat-send-btn" disabled={!messageInput.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </div>
            <h3>Select a conversation</h3>
            <p>Choose someone from your contacts to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
