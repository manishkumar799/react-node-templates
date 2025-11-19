import { useState } from "react"
import { cn } from "@/lib/utils"

interface ChartSectionProps {
    className?: string
}

export function ChartSection({ className }: ChartSectionProps) {
    const [timeRange, setTimeRange] = useState("30d")

    return (
        <div className={cn("bg-card rounded-xl p-6 shadow-sm border border-border", className)}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Total Visitors</h2>
                    <p className="text-sm text-muted-foreground">Total for the last {timeRange === '3m' ? '3 months' : timeRange === '30d' ? '30 days' : '7 days'}</p>
                </div>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                    <TimeButton
                        label="Last 3 months"
                        active={timeRange === '3m'}
                        onClick={() => setTimeRange('3m')}
                    />
                    <TimeButton
                        label="Last 30 days"
                        active={timeRange === '30d'}
                        onClick={() => setTimeRange('30d')}
                    />
                    <TimeButton
                        label="Last 7 days"
                        active={timeRange === '7d'}
                        onClick={() => setTimeRange('7d')}
                    />
                </div>
            </div>

            <div className="h-[300px] w-full relative group">
                {/* Mock Chart - In a real app, use Recharts or similar */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="250" x2="1000" y2="250" stroke="var(--border)" strokeDasharray="4 4" />
                    <line x1="0" y1="150" x2="1000" y2="150" stroke="var(--border)" strokeDasharray="4 4" />
                    <line x1="0" y1="50" x2="1000" y2="50" stroke="var(--border)" strokeDasharray="4 4" />

                    {/* Wavy Path - Animated */}
                    <path
                        d="M0,250 C50,200 100,280 150,180 C200,80 250,220 300,150 C350,80 400,120 450,200 C500,280 550,100 600,180 C650,260 700,150 750,200 C800,250 850,100 900,150 C950,200 1000,100 V300 H0 Z"
                        fill="url(#gradient)"
                        className="transition-all duration-1000 ease-in-out"
                    />
                    <path
                        d="M0,250 C50,200 100,280 150,180 C200,80 250,220 300,150 C350,80 400,120 450,200 C500,280 550,100 600,180 C650,260 700,150 750,200 C800,250 850,100 900,150 C950,200 1000,100"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="3"
                        className="drop-shadow-md transition-all duration-1000 ease-in-out"
                    />

                    {/* Interactive Hover Line (Simulated) */}
                    <line x1="500" y1="0" x2="500" y2="300" stroke="var(--foreground)" strokeWidth="1" strokeDasharray="4 4" className="opacity-0 group-hover:opacity-30 transition-opacity" />
                    <circle cx="500" cy="200" r="6" fill="var(--background)" stroke="var(--primary)" strokeWidth="3" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
                    {['Jun 1', 'Jun 3', 'Jun 5', 'Jun 7', 'Jun 9', 'Jun 11', 'Jun 13', 'Jun 15', 'Jun 17', 'Jun 19', 'Jun 21', 'Jun 23', 'Jun 25', 'Jun 27', 'Jun 30'].map((date, i) => (
                        <span key={i} className="hidden sm:inline-block">{date}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

function TimeButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                active
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
            )}
        >
            {label}
        </button>
    )
}
