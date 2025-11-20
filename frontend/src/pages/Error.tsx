import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export const ErrorPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="p-4 rounded-full bg-destructive/10 mb-6">
                <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                We encountered an unexpected error. Please try again later or contact support if the problem persists.
            </p>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
                <Button asChild>
                    <Link to="/">Return Home</Link>
                </Button>
            </div>
        </div>
    )
}
