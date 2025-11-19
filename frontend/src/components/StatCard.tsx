import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string
    trend: string
    trendUp: boolean
    subtitle: string
    desc: string
    className?: string
}

export function StatCard({ title, value, trend, trendUp, subtitle, desc, className }: StatCardProps) {
    return (
        <div className={cn("bg-card p-6 rounded-xl shadow-sm border border-border flex flex-col justify-between transition-all duration-200 hover:shadow-md", className)}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-muted-foreground font-medium">{title}</span>
                <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1",
                    trendUp ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                )}>
                    {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend}
                </span>
            </div>
            <div className="mb-4">
                <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            </div>
            <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    {subtitle}
                </div>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
        </div>
    )
}
