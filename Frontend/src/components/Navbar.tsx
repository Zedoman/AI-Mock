import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Search,
  Bell,
  Menu,
  Code,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

interface NavbarProps {
  username?: string;
  avatarUrl?: string;
  notifications?: number;
}

const Navbar = ({
  username = "John Doe",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=interview",
  notifications = 2,
}: NavbarProps) => {
  return (
    <nav className="w-full h-[70px] border-b border-gray-200 bg-white flex items-center justify-between px-6 py-3 shadow-sm">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">MockInterview</h1>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/practice"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Practice
          </Link>
          <Link
            to="/resources"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Resources
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 w-[200px] lg:w-[300px]"
          />
        </div>

       

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-1 rounded-full"
            >
              <Avatar>
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback>
                  {username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {username}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>My Interviews</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
