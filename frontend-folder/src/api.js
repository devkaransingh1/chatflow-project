const API_BASE_URL = 'http://127.0.0.1:8000'

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('access_token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  // If 401, try refreshing the token
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        localStorage.setItem('access_token', data.access)
        headers['Authorization'] = `Bearer ${data.access}`

        response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
        })
      } else {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return null
      }
    }
  }

  return response
}

export async function getCurrentUser() {
  // Decode the JWT token to get user info
  const token = localStorage.getItem('access_token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.user_id,
      username: payload.username || `User_${payload.user_id}`,
    }
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.href = '/login'
}


export async function searchUsers(username) {
  const response = await fetchWithAuth(
    `/api/chats/users/search/?username=${encodeURIComponent(username)}`
  )

  if (!response || !response.ok) {
    return []
  }

  return response.json()
}


export async function sendChatRequest(receiverUsername) {
  const response = await fetchWithAuth(
    '/api/chats/requests/',
    {
      method: 'POST',
      body: JSON.stringify({
        receiver_username: receiverUsername,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.receiver_username?.[0] ||
      'Failed to send chat request'
    )
  }

  return data
}


export async function getContacts() {
  const response = await fetchWithAuth(
    '/api/chats/contacts/'
  )

  if (!response || !response.ok) {
    return []
  }

  return response.json()
}
