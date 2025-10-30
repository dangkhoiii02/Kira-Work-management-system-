"use client"

import { useMemo, useState } from "react"
import { Grid3x3, Mail } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { beRegister, beLogin } from "../lib/be"

type AuthMode = "login" | "register"

interface AuthPageProps {
  onAuthSuccess?: (user: any, projectId?: number) => void
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    if (!email || !password) return false
    if (mode === "register" && !name.trim()) return false
    return true
  }, [email, password, mode, name])

  async function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    try {
      if (mode === "register") {
        const reg = await beRegister({
          nick_name: name.trim(),
          email: email.trim(),
          password: password,
        })
        onAuthSuccess?.(reg.user, reg.project?.id)
      } else {
        const login = await beLogin({
          email: email.trim(),
          password: password,
        })
        // Quan trọng: truyền projectId lên App để mở ListView và tạo task
        onAuthSuccess?.(login.user, login.project?.id)
      }
    } catch (e: any) {
      const msg =
        e?.message ||
        (mode === "register" ? "Registration failed. Please check your info." : "Login failed. Please try again.")
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Auth Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 lg:p-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold">Kira</span>
          </div>

          <h1 className="text-4xl font-bold mb-2 text-balance">
            Connect every team, task, and project together with Kira
          </h1>

          {/* Toggle giữa Login / Register */}
          <div className="mt-6 inline-flex rounded border overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${mode === "login" ? "bg-muted" : "bg-transparent"}`}
              onClick={() => setMode("login")}
              type="button"
            >
              Log in
            </button>
            <button
              className={`px-3 py-1 text-sm border-l ${mode === "register" ? "bg-muted" : "bg-transparent"}`}
              onClick={() => setMode("register")}
              type="button"
            >
              Sign up
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Work email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Using a work email helps find teammates and boost collaboration.
              </p>
            </div>

            {mode === "register" && (
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
              />
            )}

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />

            <Button
              onClick={handleSubmit}
              disabled={loading || !canSubmit}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? "Please wait…" : mode === "register" ? "Create account" : "Log in"}
            </Button>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social mock */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 bg-transparent" type="button">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-12 bg-transparent" type="button">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z" />
                  <path fill="#00a4ef" d="M13 1h10v10H13z" />
                  <path fill="#7fba00" d="M1 13h10v10H1z" />
                  <path fill="#ffb900" d="M13 13h10v10H13z" />
                </svg>
                Microsoft
              </Button>
            </div>
          </div>
        </div>

        {/* Right preview (giữ nguyên UI minh họa) */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <div className="flex items-center gap-4">
                <Grid3x3 className="w-5 h-5" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <Grid3x3 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">Kira</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm mb-3">TO DO</h3>
                <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium mb-2">Design new billing API</p>
                  <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded">FEATURES</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm mb-3">IN PROGRESS</h3>
                <div className="bg-white border rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium mb-2">Add analytics events</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm mb-3">DONE</h3>
                <div className="bg-white border rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium mb-2">Define requirements…</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  )
}
