import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Users, Building2, TrendingUp, Star } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { useState } from "react";
import { Location } from "@/lib/locations";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { data: events = [] } = trpc.events.list.useQuery();
  const { data: venues = [] } = trpc.venues.list.useQuery();
  const { data: hotels = [] } = trpc.hotels.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Location Search */}
      <Header 
        onLocationSelect={setSelectedLocation}
        selectedLocation={selectedLocation}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Your Perfect Event Starts Here
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discover amazing events, book stunning venues, and connect with top-tier vendors all in one place
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/events">
                <Button size="lg">Browse Events</Button>
              </Link>
              <Link href="/partner">
                <Button size="lg" variant="outline">Partner With Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Calendar className="h-12 w-12 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">{events.length}</div>
              <div className="text-muted-foreground">Active Events</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">{venues.length}</div>
              <div className="text-muted-foreground">Venues</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">{hotels.length}</div>
              <div className="text-muted-foreground">Hotels</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">Featured Events</h3>
              <p className="text-muted-foreground">Discover the hottest events happening now</p>
            </div>
            <Link href="/events">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event: any) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="font-bold text-primary">
                        ₦{((event.price || 0) / 100).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose Owambe?</h3>
            <p className="text-muted-foreground">
              We make event planning effortless with our comprehensive platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Verified Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All our vendors, venues, and service providers are thoroughly vetted for quality and reliability
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Best Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get competitive pricing and exclusive deals on events, venues, and services
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join a vibrant community of event enthusiasts, share experiences, and discover new opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">{APP_TITLE}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your one-stop platform for events, venues, and unforgettable experiences
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/events" className="text-muted-foreground hover:text-primary">Events</Link></li>
                <li><Link href="/venues" className="text-muted-foreground hover:text-primary">Venues</Link></li>
                <li><Link href="/hotels" className="text-muted-foreground hover:text-primary">Hotels</Link></li>
                <li><Link href="/vendors" className="text-muted-foreground hover:text-primary">Vendors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/social" className="text-muted-foreground hover:text-primary">Feed</Link></li>
                <li><Link href="/partner" className="text-muted-foreground hover:text-primary">Partner Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 {APP_TITLE}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

