import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/Sidebar"
import { Dashboard } from "@/pages/Dashboard"
import { Lifecycle } from "@/pages/Lifecycle"
import { Analytics } from "@/pages/Analytics"
import { Projects } from "@/pages/Projects"
import { Team } from "@/pages/Team"
import { DataLibrary } from "@/pages/DataLibrary"
import { Reports } from "@/pages/Reports"
import { WordAssistant } from "@/pages/WordAssistant"
import { Settings } from "@/pages/Settings"
import { Help } from "@/pages/Help"
import { Login } from "@/pages/Login"
import { Signup } from "@/pages/Signup"
import { ErrorPage } from "@/pages/Error"
import { NotFound } from "@/pages/NotFound"
import { TopHeader } from "./components/TopHeader"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background font-sans text-foreground overflow-hidden">
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <TopHeader />
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/error" element={<ErrorPage />} />

          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lifecycle" element={<Lifecycle />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/team" element={<Team />} />
            <Route path="/data-library" element={<DataLibrary />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/word-assistant" element={<WordAssistant />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
