import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";

export default function Checkout() {
  const [, params] = useRoute("/checkout/:bookingId");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [processing, setProcessing] = useState(false);

  const bookingId = params?.bookingId;

  // Get booking details
  const { data: booking, isLoading } = trpc.bookings.getById.useQuery(
    { id: bookingId || "" },
    {
      enabled: !!bookingId && isAuthenticated,
    }
  );

  const initializePaymentMutation = trpc.payment.initialize.useMutation({
    onSuccess: (data) => {
      if (data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      }
    },
    onError: (error) => {
      alert(error.message);
      setProcessing(false);
    },
  });

  const handlePayment = () => {
    if (!booking || !user) return;

    setProcessing(true);
    initializePaymentMutation.mutate({
      bookingId: booking.id,
      amount: booking.totalAmount,
      email: user.email || "",
      metadata: {
        bookingType: booking.bookingType,
        itemId: booking.itemId,
        userName: user.name,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to complete your booking</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setLocation("/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Booking Not Found</CardTitle>
            <CardDescription>The booking you're looking for doesn't exist</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setLocation("/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your booking payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Type</span>
                  <span className="font-semibold capitalize">{booking.bookingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date</span>
                  <span className="font-semibold">
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                {booking.numberOfGuests && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Guests</span>
                    <span className="font-semibold">{booking.numberOfGuests}</span>
                  </div>
                )}
                {booking.numberOfRooms && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Rooms</span>
                    <span className="font-semibold">{booking.numberOfRooms}</span>
                  </div>
                )}
                {booking.checkInDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                  </div>
                )}
                {booking.checkOutDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-purple-600">₦{(booking.totalAmount / 100).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-semibold">{user?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-semibold">{user?.email || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₦{(booking.totalAmount / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>₦0</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-purple-600">₦{(booking.totalAmount / 100).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={processing || booking.paymentStatus === "paid"}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : booking.paymentStatus === "paid" ? (
                    "Already Paid"
                  ) : (
                    "Pay Now"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Secured by <span className="font-semibold">Paystack</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">We accept cards, bank transfers, and USSD</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

