import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
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
import { TopHeader } from "./components/TopHeader"
import { SidebarProvider } from "@/components/ui/sidebar"

const App = () => {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background font-sans text-foreground overflow-hidden">
          <AppSidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-hidden relative">
            <TopHeader />
            <div className="flex-1 overflow-y-auto">
              <Routes>
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
              </Routes>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  )
}

export default App
