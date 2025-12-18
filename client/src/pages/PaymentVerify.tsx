import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export default function PaymentVerify() {
  const [, setLocation] = useLocation();
  const [reference, setReference] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyMutation = trpc.payment.verify.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setVerifying(false);
      // Redirect to bookings after 3 seconds
      setTimeout(() => {
        setLocation("/bookings");
      }, 3000);
    },
    onError: (err) => {
      setError(err.message);
      setVerifying(false);
    },
  });

  useEffect(() => {
    // Get reference from URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference");

    if (ref) {
      setReference(ref);
      // Verify payment
      verifyMutation.mutate({ reference: ref });
    } else {
      setError("No payment reference found");
      setVerifying(false);
    }
  }, []);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
              {reference && <p className="text-xs text-gray-400 mt-4 font-mono">{reference}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">Payment Successful!</CardTitle>
            <CardDescription className="text-center">
              Your booking has been confirmed. You'll be redirected to your bookings shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reference && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
                <p className="font-mono text-sm">{reference}</p>
              </div>
            )}
            <Link href="/bookings">
              <Button className="w-full">View My Bookings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-center text-2xl">Payment Failed</CardTitle>
          <CardDescription className="text-center">
            {error || "We couldn't verify your payment. Please try again or contact support."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reference && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
              <p className="font-mono text-sm">{reference}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Link href="/bookings" className="flex-1">
              <Button variant="outline" className="w-full">
                View Bookings
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">Go Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

