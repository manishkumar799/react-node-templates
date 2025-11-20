import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Bell, User, PaintBucket, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export function Settings() {
    const [activeTab, setActiveTab] = useState("profile")

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "account", label: "Account", icon: Shield },
        { id: "appearance", label: "Appearance", icon: PaintBucket },
        { id: "notifications", label: "Notifications", icon: Bell },
    ]

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <nav className="flex flex-col space-y-1">
                            {tabs.map((tab) => (
                                <Button
                                    key={tab.id}
                                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                                    className={cn(
                                        "justify-start gap-2",
                                        activeTab === tab.id && "bg-secondary"
                                    )}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">
                        {activeTab === "profile" && <ProfileSettings />}
                        {activeTab === "account" && <AccountSettings />}
                        {activeTab === "appearance" && <AppearanceSettings />}
                        {activeTab === "notifications" && <NotificationSettings />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProfileSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your public profile information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Change Avatar</Button>
                    </div>
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" placeholder="John" defaultValue="Manish" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" placeholder="Doe" defaultValue="Kumar" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" defaultValue="manish@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" placeholder="I am a software engineer..." />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

function AccountSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Update Password</Button>
                </CardFooter>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Delete Account</CardTitle>
                    <CardDescription>Permanently delete your account and all of your content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button variant="destructive">Delete Account</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

function AppearanceSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>Select the theme for the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="cursor-pointer rounded-md border-2 border-muted p-2 hover:border-primary">
                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                </div>
                            </div>
                            <div className="mt-2 text-center text-sm font-medium">Light</div>
                        </div>
                        <div className="cursor-pointer rounded-md border-2 border-muted p-2 hover:border-primary">
                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                </div>
                            </div>
                            <div className="mt-2 text-center text-sm font-medium">Dark</div>
                        </div>
                        <div className="cursor-pointer rounded-md border-2 border-primary p-2">
                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                </div>
                            </div>
                            <div className="mt-2 text-center text-sm font-medium">System</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function NotificationSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Communication emails</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive emails about your account activity.
                            </p>
                        </div>
                        {/* Simulated Switch */}
                        <div className="h-6 w-11 rounded-full bg-primary p-1 cursor-pointer">
                            <div className="h-4 w-4 rounded-full bg-white translate-x-5 transition-transform" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Marketing emails</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive emails about new products, features, and more.
                            </p>
                        </div>
                        {/* Simulated Switch Off */}
                        <div className="h-6 w-11 rounded-full bg-input p-1 cursor-pointer">
                            <div className="h-4 w-4 rounded-full bg-white transition-transform" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Security emails</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive emails about your account security.
                            </p>
                        </div>
                        {/* Simulated Switch */}
                        <div className="h-6 w-11 rounded-full bg-primary p-1 cursor-pointer">
                            <div className="h-4 w-4 rounded-full bg-white translate-x-5 transition-transform" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

