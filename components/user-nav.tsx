"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Settings, ShieldCheck } from "lucide-react"

// Admin email address - hardcoded for security
const ADMIN_EMAIL = "hakanhakverdi6@gmail.com"

export function UserNav() {
  const { user, logOut } = useAuth()
  const { isAdmin } = useAdmin()

  const handleLogout = async () => {
    try {
      await logOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getUserInitials = () => {
    if (!user) return "?"

    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }

    if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }

    return "?"
  }

  const getUserDisplayName = () => {
    if (!user) return ""

    if (user.displayName) {
      return user.displayName
    }

    if (user.email) {
      return user.email.split("@")[0]
    }

    return ""
  }

  // Check if current user is admin
  const userIsAdmin = user?.email === ADMIN_EMAIL

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <a href="/auth/sign-in">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </a>
        <a href="/auth/sign-up">
          <Button size="sm">Sign Up</Button>
        </a>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => (window.location.href = "/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => (window.location.href = "/profile/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        {userIsAdmin && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => (window.location.href = "/admin")}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Admin Panel</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
