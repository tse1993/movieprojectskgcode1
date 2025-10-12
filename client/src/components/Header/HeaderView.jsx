import { Search, LogOut, User, MessageCircle, ChevronDown, Settings } from "lucide-react";
import { Input } from "../../assets/ui/input";
import { Button } from "../../assets/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../assets/ui/dropdown-menu";

/** @typedef {import("../../assets/types/pagesProps/HeaderProps").HeaderProps} HeaderProps */

/** @param {HeaderProps} props */
export default function HeaderView({
  onSearch,
  searchQuery,
  user = null,
  onLogout,
  onNavigateToSettings,
  onNavigateToProfile,
  onNavigateToFeed,
  onNavigateToPopular,
  onNavigateToTopRated,
  onNavigateToNewReleases,
  onNavigateToMain,
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <button
          onClick={onNavigateToMain}
          className="mr-6 flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="h-8 w-8 rounded bg-primary"></div>
          <span className="hidden font-bold sm:inline-block">MovieDB</span>
        </button>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          <button
            onClick={onNavigateToPopular}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Popular Movies
          </button>
          <button
            onClick={onNavigateToTopRated}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Top Rated
          </button>
          <button
            onClick={onNavigateToNewReleases}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            New Releases
          </button>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-64 pl-8"
            />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.name || user.email}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48" sideOffset={5}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={onNavigateToProfile}>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={onNavigateToSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={onNavigateToFeed}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Feed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-destructive cursor-pointer hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
