import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Calendar, Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import LocationSearchEnhanced from "./LocationSearchEnhanced";
import { Location } from "@/lib/locations";

interface HeaderProps {
  onLocationSelect?: (location: Location) => void;
  selectedLocation?: Location | null;
}

export default function Header({
  onLocationSelect,
  selectedLocation,
}: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container">
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Calendar className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-600">{APP_TITLE}</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/events"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/venues"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Venues
            </Link>
            <Link
              href="/hotels"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Hotels
            </Link>
            <Link
              href="/vendors"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Vendors
            </Link>
            <Link
              href="/social"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Community
            </Link>
          </nav>

          {/* Right side - Auth & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setLocation("/dashboard")}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    {user?.name || "Dashboard"}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm">Sign In</Button>
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Location Search Bar with Geolocation */}
        <div className="pb-4">
          <div className="max-w-md">
            <LocationSearchEnhanced
              onLocationSelect={onLocationSelect}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t">
            <Link href="/events" className="block px-4 py-2 hover:bg-gray-100 rounded">
              Events
            </Link>
            <Link href="/venues" className="block px-4 py-2 hover:bg-gray-100 rounded">
              Venues
            </Link>
            <Link href="/hotels" className="block px-4 py-2 hover:bg-gray-100 rounded">
              Hotels
            </Link>
            <Link href="/vendors" className="block px-4 py-2 hover:bg-gray-100 rounded">
              Vendors
            </Link>
            <Link href="/social" className="block px-4 py-2 hover:bg-gray-100 rounded">
              Community
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-red-600"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <a href={getLoginUrl()} className="block px-4 py-2">
                <Button size="sm" className="w-full">
                  Sign In
                </Button>
              </a>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

