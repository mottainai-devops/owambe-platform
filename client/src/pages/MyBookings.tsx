import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Package } from "lucide-react";
import { Link } from "wouter";

export default function MyBookings() {
  const { user, isAuthenticated } = useAuth();
  const { data: bookings, isLoading } = trpc.bookings.myBookings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full">Sign In</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Calendar className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">Owambe</h1>
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
                Events
              </Link>
              <Link href="/venues" className="text-sm font-medium hover:text-primary transition-colors">
                Venues
              </Link>
              <Link href="/hotels" className="text-sm font-medium hover:text-primary transition-colors">
                Hotels
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground text-lg">
              View and manage all your bookings
            </p>
          </div>

          {/* Bookings List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/4 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {booking.bookingType === "event" && <Calendar className="h-5 w-5" />}
                          {booking.bookingType === "venue" && <MapPin className="h-5 w-5" />}
                          {booking.bookingType === "hotel" && <Package className="h-5 w-5" />}
                          {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)} Booking
                        </CardTitle>
                        <CardDescription>
                          Booking ID: {booking.id.slice(0, 8)}...
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                          booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground mb-1">Start Date</div>
                        <div className="font-medium">
                          {new Date(booking.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      {booking.endDate && (
                        <div>
                          <div className="text-muted-foreground mb-1">End Date</div>
                          <div className="font-medium">
                            {new Date(booking.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-muted-foreground mb-1">Total Amount</div>
                        <div className="font-bold text-primary">
                          ₦{(booking.totalAmount / 100).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Payment Status</div>
                        <div className={`font-medium ${
                          booking.paymentStatus === "paid" ? "text-green-600" :
                          booking.paymentStatus === "pending" ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {booking.paymentStatus}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm">View Details</Button>
                      {booking.status === "confirmed" && (
                        <Button variant="outline" size="sm">Download Ticket</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring events, venues, and hotels to make your first booking!
              </p>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

