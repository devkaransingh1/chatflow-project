const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // If 401, try refreshing the token
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      const refreshResponse = await fetch(
        `${API_BASE_URL}/api/token/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        },
      );

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem("access_token", data.access);
        headers["Authorization"] = `Bearer ${data.access}`;

        response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
        });
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return null;
      }
    }
  }

  return response;
}

export async function getCurrentUser() {
  // Decode the JWT token to get user info
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const savedUsername = localStorage.getItem("chatflow_username");

    return {
      id: payload.user_id || payload.id,
      username:
        savedUsername ||
        payload.username ||
        payload.user_name ||
        payload.name ||
        `User_${payload.user_id || payload.id || "unknown"}`,
    };
  } catch {
    return {
      id: 0,
      username: localStorage.getItem("chatflow_username") || "User",
    };
  }
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("chatflow_username");
  window.location.href = "/login";
}

export async function searchUsers(username) {
  const response = await fetchWithAuth(
    `/api/chats/users/search/?username=${encodeURIComponent(username)}`,
  );

  if (!response || !response.ok) {
    return [];
  }

  return response.json();
}

export async function sendChatRequest(receiverUsername) {
  const response = await fetchWithAuth("/api/chats/requests/", {
    method: "POST",
    body: JSON.stringify({
      receiver_username: receiverUsername,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.receiver_username?.[0] ||
        "Failed to send chat request",
    );
  }

  return data;
}

export async function getContacts() {
  const response = await fetchWithAuth("/api/chats/contacts/");

  if (!response || !response.ok) {
    return [];
  }

  return response.json();
}

export async function getMessages(username) {
  const response = await fetchWithAuth(
    `/api/chats/messages/${encodeURIComponent(username)}/`,
  );

  if (!response || !response.ok) {
    const error = new Error(
      response?.status === 404
        ? "User or conversation not found."
        : "Failed to load conversation.",
    );
    error.status = response?.status;
    throw error;
  }

  return response.json();
}

export async function sendMessage(receiver, content) {
  const response = await fetchWithAuth("/api/chats/messages/", {
    method: "POST",
    body: JSON.stringify({ receiver, content }),
  });
  const data = response ? await response.json() : {};

  if (!response || !response.ok) {
    const error = new Error(
      data.detail ||
        data.content?.[0] ||
        data.receiver?.[0] ||
        "Failed to send message.",
    );
    error.status = response?.status;
    throw error;
  }

  return data;
}

export async function getIncomingRequests() {
  const response = await fetchWithAuth("/api/chats/requests/incoming/");

  if (!response || !response.ok) {
    return [];
  }

  return response.json();
}

export async function acceptChatRequest(requestId) {
  const response = await fetchWithAuth(
    `/api/chats/requests/${requestId}/accept/`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response || !response.ok) {
    throw new Error(data.detail || "Failed to accept chat request");
  }

  return data;
}

export async function rejectChatRequest(requestId) {
  const response = await fetchWithAuth(
    `/api/chats/requests/${requestId}/reject/`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response || !response.ok) {
    throw new Error(data.detail || "Failed to reject chat request");
  }

  return data;
}
