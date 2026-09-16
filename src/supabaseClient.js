// ============================================================
// SUPABASECLIENT.JS — Supabase Authentication Client
//
// Works with any Supabase project using standard Supabase Auth API.
// Reads credentials from .env:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
//
// Also supports localStorage configuration or live setup.
// Provides identical API methods as @supabase/supabase-js:
//   - supabase.auth.signInWithPassword({ email, password })
//   - supabase.auth.signUp({ email, password, options })
//   - supabase.auth.signOut()
//   - supabase.auth.getSession()
//   - supabase.auth.onAuthStateChange(callback)
//   - supabase.auth.resetPasswordForEmail(email)
// ============================================================

// Read from Vite environment or localStorage override
const envUrl = import.meta.env.VITE_SUPABASE_URL || ""
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

const storedUrl = typeof window !== "undefined" ? localStorage.getItem("jumia_supabase_url") : null
const storedKey = typeof window !== "undefined" ? localStorage.getItem("jumia_supabase_key") : null

export let supabaseUrl = (storedUrl || envUrl || "").trim()
export let supabaseAnonKey = (storedKey || envKey || "").trim()

export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-project-id")
  )
}

export function configureSupabase(url, key) {
  supabaseUrl = url.trim()
  supabaseAnonKey = key.trim()
  if (typeof window !== "undefined") {
    localStorage.setItem("jumia_supabase_url", supabaseUrl)
    localStorage.setItem("jumia_supabase_key", supabaseAnonKey)
  }
}

// Session management
const SESSION_KEY = "jumia_supabase_session"

function getStoredSession() {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

function setStoredSession(session) {
  if (typeof window === "undefined") return
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

// Auth state listeners
const listeners = new Set()

function notifyListeners(event, session) {
  listeners.forEach((callback) => {
    try {
      callback(event, session)
    } catch (e) {
      console.error("Auth listener error:", e)
    }
  })
}

// ── Main Supabase Client ─────────────────────────────────────
export const supabase = {
  auth: {
    // 1. Sign in with Email and Password
    async signInWithPassword({ email, password }) {
      if (!isSupabaseConfigured()) {
        throw new Error(
          "Supabase is not configured yet. Please provide your Supabase Project URL and Anon Key in .env or the setup box below."
        )
      }

      const endpoint = `${supabaseUrl}/auth/v1/token?grant_type=password`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error_description || data.msg || data.message || "Invalid login credentials")
      }

      const session = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      }

      setStoredSession(session)
      notifyListeners("SIGNED_IN", session)

      return { data: { user: data.user, session }, error: null }
    },

    // 2. Sign up with Email, Password & Name
    async signUp({ email, password, options = {} }) {
      if (!isSupabaseConfigured()) {
        throw new Error(
          "Supabase is not configured yet. Please provide your Supabase Project URL and Anon Key in .env or the setup box below."
        )
      }

      const endpoint = `${supabaseUrl}/auth/v1/signup`
      const metadata = (options && options.data) || {}

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          data: metadata,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error_description || data.msg || data.message || "Registration failed")
      }

      if (data.access_token) {
        const session = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: data.user,
        }
        setStoredSession(session)
        notifyListeners("SIGNED_IN", session)
      }

      return { data: { user: data.user, session: data.access_token ? data : null }, error: null }
    },

    // 3. Sign out
    async signOut() {
      const session = getStoredSession()
      if (isSupabaseConfigured() && session && session.access_token) {
        try {
          await fetch(`${supabaseUrl}/auth/v1/logout`, {
            method: "POST",
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${session.access_token}`,
            },
          })
        } catch (e) {
          // Ignore network errors on signout
        }
      }
      setStoredSession(null)
      notifyListeners("SIGNED_OUT", null)
      return { error: null }
    },

    // 4. Get active session
    async getSession() {
      const session = getStoredSession()
      return { data: { session }, error: null }
    },

    // 5. Get current authenticated user
    async getUser() {
      const session = getStoredSession()
      if (!session || !session.access_token || !isSupabaseConfigured()) {
        return { data: { user: null }, error: null }
      }

      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (!response.ok) {
          setStoredSession(null)
          return { data: { user: null }, error: new Error("Session expired") }
        }

        const user = await response.json()
        return { data: { user }, error: null }
      } catch (e) {
        return { data: { user: session.user }, error: null }
      }
    },

    // 6. Auth state change listener
    onAuthStateChange(callback) {
      listeners.add(callback)
      return {
        data: {
          subscription: {
            unsubscribe: () => listeners.delete(callback),
          },
        },
      }
    },

    // 7. Password recovery
    async resetPasswordForEmail(email) {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured yet.")
      }

      const response = await fetch(`${supabaseUrl}/auth/v1/recover`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error_description || data.msg || "Password reset request failed")
      }
      return { data, error: null }
    },
  },
}

