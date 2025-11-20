import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Book, MessageCircle, FileText, ChevronDown, ChevronUp, Mail } from "lucide-react"

export function Help() {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">How can we help?</h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            className="pl-10 h-12 text-lg"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid gap-6 md:grid-cols-3 mb-12">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <Book className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Documentation</CardTitle>
                            <CardDescription>Detailed guides and API references.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <FileText className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Guides</CardTitle>
                            <CardDescription>Step-by-step tutorials for common tasks.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <MessageCircle className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Community</CardTitle>
                            <CardDescription>Join the discussion and ask questions.</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* FAQ Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FaqItem
                            question="How do I reset my password?"
                            answer="You can reset your password by going to the Settings page and clicking on the 'Account' tab. From there, you can update your password."
                        />
                        <FaqItem
                            question="Can I export my data?"
                            answer="Yes, you can export your data from the Reports page. We support CSV and PDF formats."
                        />
                        <FaqItem
                            question="How do I invite team members?"
                            answer="Navigate to the Team page and click on the 'Add Member' button. You can invite them via email."
                        />
                        <FaqItem
                            question="Where can I find my billing invoices?"
                            answer="Billing invoices are sent to your registered email address. You can also view them in the Account Settings under the Billing section."
                        />
                    </div>
                </div>

                {/* Contact Support */}
                <div className="bg-muted/50 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
                    <p className="text-muted-foreground mb-6">Our support team is available 24/7 to assist you with any issues.</p>
                    <Button size="lg" className="gap-2">
                        <Mail className="h-5 w-5" />
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border rounded-lg bg-card">
            <button
                className="flex items-center justify-between w-full p-4 text-left font-medium"
                onClick={() => setIsOpen(!isOpen)}
            >
                {question}
                {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-muted-foreground animate-in slide-in-from-top-2 duration-200">
                    {answer}
                </div>
            )}
        </div>
    )
}
