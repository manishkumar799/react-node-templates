import { PanelLeft, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/StatCard"
import { ChartSection } from "@/components/ChartSection"

export function Dashboard() {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="flex items-center gap-4 mb-8 text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="text-sm font-medium">Dashboard</span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards">
                <StatCard
                    title="Total Revenue"
                    value="$1,250.00"
                    trend="+12.5%"
                    trendUp
                    subtitle="Trending up this month"
                    desc="Visitors for the last 6 months"
                />
                <StatCard
                    title="New Customers"
                    value="1,234"
                    trend="-20%"
                    trendUp={false}
                    subtitle="Down 20% this period"
                    desc="Acquisition needs attention"
                />
                <StatCard
                    title="Active Accounts"
                    value="45,678"
                    trend="+12.5%"
                    trendUp
                    subtitle="Strong user retention"
                    desc="Engagement exceed targets"
                />
                <StatCard
                    title="Growth Rate"
                    value="4.5%"
                    trend="+4.5%"
                    trendUp
                    subtitle="Steady performance"
                    desc="Meets growth projections"
                />
            </div>

            {/* Chart Section */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-backwards">
                <ChartSection />
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 fill-mode-backwards">
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" className="h-8 text-xs bg-card hover:bg-accent hover:text-accent-foreground transition-colors">Outline</Button>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
                        Past Performance <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-foreground text-[10px]">3</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
                        Key Personnel <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted text-foreground text-[10px]">2</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
                        Focus Documents
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 text-xs gap-2 bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
                        <PanelLeft size={14} /> Customize Columns <ChevronDown size={14} />
                    </Button>
                    <Button variant="outline" className="h-8 text-xs gap-2 bg-card hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Plus size={14} /> Add Section
                    </Button>
                </div>
            </div>
        </div>
    )
}
