import { useState } from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface TopHeaderProps {
    className?: string
}

export function TopHeader({ className }: TopHeaderProps) {
    const [isDark, setIsDark] = useState(false)
    const toggleTheme = () => {
        const newTheme = !isDark
        setIsDark(newTheme)
        if (newTheme) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <header className={cn("h-16 flex items-center justify-between px-8 border-b border-border/50 bg-background/50 backdrop-blur-sm sticky top-0 z-10", className)}>
            <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground overflow-x-auto scrollbar-hide">
                <SidebarTrigger />
            </nav>
            <div className="flex items-center gap-4 text-muted-foreground pl-4">
                <button onClick={toggleTheme} className="hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted/50">
                    {isDark ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </header>
    )
}
