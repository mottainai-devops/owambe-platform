import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Users, Wifi, Car, UtensilsCrossed, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { nanoid } from "nanoid";

export default function VenueDetail() {
  const [, params] = useRoute("/venues/:id");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, getLoginUrl } = useAuth();
  const [guests, setGuests] = useState(50);
  const [bookingDate, setBookingDate] = useState("");

  const venueId = params?.id;

  // Validate venue ID
  if (!venueId || venueId === ":id") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Invalid venue ID</p>
            <Button className="w-full mt-4" onClick={() => setLocation("/venues")}>Go to Venues</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: venue, isLoading, error } = trpc.venues.getById.useQuery(
    { id: venueId },
    { enabled: !!venueId && venueId !== ":id" }
  );

  const createBookingMutation = trpc.bookings.create.useMutation({
    onSuccess: (data) => {
      setLocation(`/checkout/${data.id}`);
    },
  });

  const handleBooking = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!venue || !bookingDate) {
      alert("Please select a booking date");
      return;
    }

    createBookingMutation.mutate({
      id: nanoid(),
      userId: user!.id,
      bookingType: "venue",
      itemId: venue.id,
      bookingDate: new Date(bookingDate),
      numberOfGuests: guests,
      totalAmount: venue.pricePerDay * 100, // Convert to kobo
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date(),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Venue Not Found</h1>
          <Button onClick={() => setLocation("/venues")}>Back to Venues</Button>
        </div>
      </div>
    );
  }

  const amenities = venue.amenities ? JSON.parse(venue.amenities as string) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img src={venue.imageUrl || ""} alt={venue.name} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{venue.name}</h1>
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{venue.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Venue</h2>
                <p className="text-gray-600 leading-relaxed">{venue.description}</p>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Capacity</p>
                      <p className="text-sm text-gray-600">{venue.capacity} guests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-gray-600">{venue.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-purple-600">₦{venue.pricePerDay.toLocaleString()}</span>
                    <span className="text-gray-600">/day</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 0)}
                      min={1}
                      max={venue.capacity}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max capacity: {venue.capacity} guests</p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Price per day</span>
                      <span className="font-semibold">₦{venue.pricePerDay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-purple-600">₦{venue.pricePerDay.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleBooking}
                    disabled={!bookingDate || createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending ? "Processing..." : "Book Now"}
                  </Button>
                  <p className="text-xs text-center text-gray-500">You won't be charged yet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ReviewList itemType="venue" itemId={venue.id} />
            </div>
            <div>
              <ReviewForm itemType="venue" itemId={venue.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

