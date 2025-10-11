"use client"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Grid3x3, Mail } from "lucide-react"

interface AuthPageProps {
  onGetStarted: () => void
}

export function AuthPage({ onGetStarted }: AuthPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Sign Up Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 lg:p-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
              <Grid3x3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold">Jira</span>
          </div>

          <h1 className="text-4xl font-bold mb-2 text-balance">
            Connect every team, task, and project together with Jira
          </h1>

          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Work email
              </label>
              <Input id="email" type="email" placeholder="you@company.com" className="h-12" />
              <p className="text-xs text-muted-foreground mt-2">
                Using a work email helps find teammates and boost collaboration.
              </p>
            </div>

            <Button onClick={onGetStarted} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Get Started
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 bg-transparent">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-12 bg-transparent">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z" />
                  <path fill="#00a4ef" d="M13 1h10v10H13z" />
                  <path fill="#7fba00" d="M1 13h10v10H1z" />
                  <path fill="#ffb900" d="M13 13h10v10H13z" />
                </svg>
                Microsoft
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 opacity-60">
              <span className="text-sm font-medium">Square</span>
              <span className="text-sm font-bold">ebay</span>
              <span className="text-xs font-bold tracking-wider">CISCO</span>
              <span className="text-sm italic font-semibold">Ford</span>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Trying to access Jira?{" "}
              <button onClick={onGetStarted} className="text-blue-600 hover:underline font-medium">
                Log in
              </button>
            </p>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <div className="flex items-center gap-4">
                <Grid3x3 className="w-5 h-5" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <Grid3x3 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">Jira</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* TO DO Column */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm mb-3">TO DO</h3>
                <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium mb-2">Design new billing API</p>
                  <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded">FEATURES</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-green-600">📗 STORY</span>
                    <div className="w-6 h-6 bg-orange-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm mb-3">IN PROGRESS</h3>
                <div className="bg-white border rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium mb-2">Add advanced analytics tracking events</p>
                  <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded">ANALYTICS</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-green-600">📗 STORY</span>
                    <div className="w-6 h-6 bg-pink-400 rounded-full" />
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium mb-2">Create AI-generated shopping suggestions</p>
                  <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded">FEATURES</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-green-600">📗 STORY</span>
                    <div className="w-6 h-6 bg-teal-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* DONE Column */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm mb-3">DONE</h3>
                <div className="bg-white border rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium mb-2">Define requirements to use new AI integrations</p>
                  <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded">FEATURES</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-blue-600">☑️ TASK</span>
                    <div className="w-6 h-6 bg-blue-400 rounded-full" />
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-3 shadow-sm">
                  <p className="text-sm font-medium mb-2">Improve payment checkout time on mobile</p>
                  <span className="inline-block px-2 py-1 bg-purple-600 text-white text-xs rounded">PAYMENTS</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-red-600">🐛 BUG</span>
                    <div className="w-6 h-6 bg-yellow-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
