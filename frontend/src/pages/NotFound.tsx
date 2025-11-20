import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-6">
                <FileQuestion className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Page not found</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
            <Button asChild>
                <Link to="/">Return Home</Link>
            </Button>
        </div>
    )
}
