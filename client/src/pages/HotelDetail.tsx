import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { trpc } from "@/lib/trpc";
import { MapPin, Star, Wifi, Car, UtensilsCrossed, Dumbbell, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { nanoid } from "nanoid";

export default function HotelDetail() {
  const [, params] = useRoute("/hotels/:id");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, getLoginUrl } = useAuth();
  const [rooms, setRooms] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const hotelId = params?.id;

  // Validate hotel ID
  if (!hotelId || hotelId === ":id") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Invalid hotel ID</p>
            <Button className="w-full mt-4" onClick={() => setLocation("/hotels")}>Go to Hotels</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: hotel, isLoading, error } = trpc.hotels.getById.useQuery(
    { id: hotelId },
    { enabled: !!hotelId && hotelId !== ":id" }
  );

  const createBookingMutation = trpc.bookings.create.useMutation({
    onSuccess: (data) => {
      setLocation(`/checkout/${data.id}`);
    },
  });

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!hotel) return 0;
    const nights = calculateNights();
    return hotel.pricePerNight * rooms * nights;
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!hotel || !checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    if (calculateNights() < 1) {
      alert("Check-out date must be after check-in date");
      return;
    }

    createBookingMutation.mutate({
      id: nanoid(),
      userId: user!.id,
      bookingType: "hotel",
      itemId: hotel.id,
      numberOfRooms: rooms,
      checkInDate: new Date(checkIn),
      checkOutDate: new Date(checkOut),
      totalAmount: calculateTotal() * 100, // Convert to kobo
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

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hotel Not Found</h1>
          <Button onClick={() => setLocation("/hotels")}>Back to Hotels</Button>
        </div>
      </div>
    );
  }

  const amenities = hotel.amenities ? JSON.parse(hotel.amenities as string) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img src={hotel.imageUrl || ""} alt={hotel.name} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(hotel.starRating || 0)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{hotel.name}</h1>
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{hotel.location}</span>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Hotel</h2>
                <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Rating</p>
                      <p className="text-sm text-gray-600">{hotel.starRating} Star Hotel</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-gray-600">{hotel.location}</p>
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
                    <span className="text-3xl font-bold text-purple-600">₦{hotel.pricePerNight.toLocaleString()}</span>
                    <span className="text-gray-600">/night</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms</label>
                    <input
                      type="number"
                      value={rooms}
                      onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                      min={1}
                      max={10}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {calculateNights() > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">₦{hotel.pricePerNight.toLocaleString()} × {calculateNights()} nights</span>
                        <span>₦{(hotel.pricePerNight * calculateNights()).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{rooms} room(s)</span>
                        <span>× {rooms}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-purple-600">₦{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleBooking}
                    disabled={!checkIn || !checkOut || calculateNights() < 1 || createBookingMutation.isPending}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          <div className="lg:col-span-2">
            <ReviewList itemType="hotel" itemId={hotel.id} />
          </div>
          <div>
            <ReviewForm itemType="hotel" itemId={hotel.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

