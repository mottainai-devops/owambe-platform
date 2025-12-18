import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Calendar, Clock, DollarSign, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";

export default function EventDetail() {
  const params = useParams();
  const eventId = params.id;
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Validate event ID
  if (!eventId || eventId === ":id") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Invalid event ID</p>
            <Button className="w-full mt-4" onClick={() => setLocation("/events")}>Go to Events</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: event, isLoading, error } = trpc.events.getById.useQuery(
    { id: eventId },
    { enabled: !!eventId && eventId !== ":id" }
  );

  const createBooking = trpc.bookings.create.useMutation({
    onSuccess: () => {
      toast.success("Booking successful!", {
        description: "Your event ticket has been booked. Check My Bookings for details.",
      });
      setIsBookingOpen(false);
      setLocation("/my-bookings");
    },
    onError: (error) => {
      toast.error("Booking failed", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleBooking = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!event) return;

    createBooking.mutate({
      bookingType: "event",
      referenceId: event.id,
      startDate: event.startDate,
      endDate: event.endDate,
      quantity,
      totalAmount: event.price * quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
            <CardDescription>The event you're looking for doesn't exist or has been removed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/events">
              <Button className="w-full">Browse All Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = event.price * quantity;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Calendar className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-primary">Owambe</span>
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

      {/* Event Hero Image */}
      <div className="h-[400px] relative overflow-hidden">
        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
              {event.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-white/90 text-lg">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Date & Time</span>
                    </div>
                    <div className="font-semibold">
                      {format(new Date(event.startDate), "MMM dd, yyyy")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(event.startDate), "h:mm a")}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Location</span>
                    </div>
                    <div className="font-semibold">{event.location || "TBA"}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Capacity</span>
                    </div>
                    <div className="font-semibold">{event.capacity || "Unlimited"}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Price</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.price === 0 ? "Free" : `₦${(event.price / 100).toLocaleString()}`}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">About This Event</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description || "Join us for an unforgettable experience! More details coming soon."}
                  </p>
                </div>

                {event.status === "published" && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">This event is live and accepting bookings</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <div>
                      <div className="font-medium">Professional Organization</div>
                      <div className="text-sm text-muted-foreground">
                        Well-organized event with experienced staff and smooth operations
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <div>
                      <div className="font-medium">Networking Opportunities</div>
                      <div className="text-sm text-muted-foreground">
                        Connect with like-minded individuals and industry professionals
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <div>
                      <div className="font-medium">Memorable Experience</div>
                      <div className="text-sm text-muted-foreground">
                        Create lasting memories with quality entertainment and activities
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book Your Spot</CardTitle>
                <CardDescription>Secure your tickets now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {event.price === 0 ? "Free" : `₦${(event.price / 100).toLocaleString()}`}
                  </div>
                  <div className="text-sm text-muted-foreground">per ticket</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Number of Tickets</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={event.capacity ? quantity >= event.capacity : false}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalPrice === 0 ? "Free" : `₦${(totalPrice / 100).toLocaleString()}`}
                    </span>
                  </div>

                  <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg" disabled={event.status !== "published"}>
                        {event.status !== "published" ? "Event Not Available" : "Book Now"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Your Booking</DialogTitle>
                        <DialogDescription>
                          Review your booking details before confirming
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Event</span>
                          <span className="font-medium">{event.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-medium">
                            {format(new Date(event.startDate), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tickets</span>
                          <span className="font-medium">{quantity}</span>
                        </div>
                        <div className="flex justify-between border-t pt-4">
                          <span className="font-semibold">Total Amount</span>
                          <span className="font-bold text-primary">
                            {totalPrice === 0 ? "Free" : `₦${(totalPrice / 100).toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleBooking} disabled={createBooking.isPending}>
                          {createBooking.isPending ? "Processing..." : "Confirm Booking"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Instant confirmation
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ReviewList itemType="event" itemId={event.id} />
            </div>
            <div>
              <ReviewForm itemType="event" itemId={event.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

