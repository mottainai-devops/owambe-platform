import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Calendar, Check, Mail, MapPin, Phone, Star, TrendingUp, Verified, Globe } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

export default function VendorDetail() {
  const params = useParams();
  const vendorId = params.id;
  const { user, isAuthenticated } = useAuth();
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [customRequirements, setCustomRequirements] = useState("");

  const { data: vendor, isLoading } = trpc.vendors.getById.useQuery(
    { id: vendorId || "" },
    { enabled: !!vendorId }
  );

  const createBooking = trpc.vendors.createBooking.useMutation({
    onSuccess: () => {
      toast.success("Booking request sent!", {
        description: "The vendor will contact you shortly to confirm details.",
      });
      setIsBookingOpen(false);
      // Reset form
      setSelectedPackage(null);
      setEventDate("");
      setEventType("");
      setGuestCount("");
      setCustomRequirements("");
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

    if (!vendor || !selectedPackage || !eventDate) {
      toast.error("Missing information", {
        description: "Please select a package and event date.",
      });
      return;
    }

    const packageData = JSON.parse(selectedPackage);
    const depositAmount = Math.floor(packageData.price * 0.3); // 30% deposit

    createBooking.mutate({
      vendorId: vendor.id,
      eventDate: new Date(eventDate),
      eventType,
      guestCount: guestCount ? parseInt(guestCount) : undefined,
      selectedPackage,
      customRequirements,
      totalAmount: packageData.price,
      depositAmount,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Vendor Not Found</CardTitle>
            <CardDescription>The vendor you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/vendors">
              <Button className="w-full">Browse All Vendors</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const portfolio = vendor.portfolio ? JSON.parse(vendor.portfolio) : [];
  const offerings = vendor.offerings ? JSON.parse(vendor.offerings) : [];
  const perks = vendor.perks ? JSON.parse(vendor.perks) : [];
  const rating = vendor.rating / 100;
  const selectedPackageData = selectedPackage ? JSON.parse(selectedPackage) : null;

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
              <Link href="/vendors" className="text-sm font-medium hover:text-primary transition-colors">
                Vendors
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Vendor Hero */}
      <div className="h-[400px] relative overflow-hidden">
        <img
          src={portfolio[0] || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200"}
          alt={vendor.businessName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              {vendor.verified === 1 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                  <Verified className="h-4 w-4" />
                  Verified
                </span>
              )}
              {vendor.featured === 1 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">
                  <Star className="h-4 w-4 fill-current" />
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{vendor.businessName}</h1>
            <p className="text-white/90 text-lg">{vendor.description}</p>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{rating.toFixed(1)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{vendor.reviewCount} reviews</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{vendor.totalBookings}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Bookings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{vendor.serviceArea}</div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio */}
            {portfolio.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolio.map((img: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                        <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Packages */}
            <Card>
              <CardHeader>
                <CardTitle>Service Packages</CardTitle>
                <CardDescription>Choose the package that best fits your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {offerings.map((offering: any) => (
                  <div key={offering.id} className="border rounded-lg p-6 hover:border-primary transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{offering.name}</h3>
                        <p className="text-muted-foreground">{offering.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ₦{(offering.price / 100).toLocaleString()}
                        </div>
                        {offering.duration && (
                          <div className="text-sm text-muted-foreground">{offering.duration}</div>
                        )}
                        {offering.venueSize && (
                          <div className="text-sm text-muted-foreground">{offering.venueSize}</div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {offering.includes.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedPackage(JSON.stringify(offering));
                        setIsBookingOpen(true);
                      }}
                    >
                      Select Package
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Special Perks */}
            {perks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>✨ Special Perks & Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {perks.map((perk: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary text-sm">✓</span>
                        </div>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendor.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <a href={`mailto:${vendor.contactEmail}`} className="text-sm hover:text-primary">
                      {vendor.contactEmail}
                    </a>
                  </div>
                )}
                {vendor.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <a href={`tel:${vendor.contactPhone}`} className="text-sm hover:text-primary">
                      {vendor.contactPhone}
                    </a>
                  </div>
                )}
                {vendor.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary">
                      Visit Website
                    </a>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Starting from</div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    ₦{((vendor.basePrice || 0) / 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{vendor.priceUnit}</div>
                </div>

                <Button className="w-full" size="lg" onClick={() => setIsBookingOpen(true)}>
                  Request Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Booking</DialogTitle>
            <DialogDescription>
              Fill in your event details and we'll send your request to {vendor.businessName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Package Selection */}
            <div className="space-y-2">
              <Label>Select Package *</Label>
              <RadioGroup value={selectedPackage || ""} onValueChange={setSelectedPackage}>
                {offerings.map((offering: any) => (
                  <div key={offering.id} className="flex items-start space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value={JSON.stringify(offering)} id={offering.id} className="mt-1" />
                    <Label htmlFor={offering.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{offering.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{offering.description}</div>
                      <div className="text-lg font-bold text-primary">
                        ₦{(offering.price / 100).toLocaleString()}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Input
                id="eventType"
                placeholder="e.g., Wedding, Birthday, Corporate Event"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              />
            </div>

            {/* Guest Count */}
            <div className="space-y-2">
              <Label htmlFor="guestCount">Expected Number of Guests</Label>
              <Input
                id="guestCount"
                type="number"
                placeholder="e.g., 150"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                min="1"
              />
            </div>

            {/* Custom Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Special Requirements or Notes</Label>
              <Textarea
                id="requirements"
                placeholder="Tell us about any special requirements, preferences, or questions..."
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                rows={4}
              />
            </div>

            {/* Booking Summary */}
            {selectedPackageData && (
              <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
                <div className="font-medium mb-2">Booking Summary</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{selectedPackageData.name}</span>
                </div>
                {eventDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Event Date</span>
                    <span className="font-medium">{format(new Date(eventDate), "MMM dd, yyyy")}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-primary">
                    ₦{(selectedPackageData.price / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deposit Required (30%)</span>
                  <span className="font-medium">
                    ₦{(Math.floor(selectedPackageData.price * 0.3) / 100).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBooking} disabled={createBooking.isPending || !selectedPackage || !eventDate}>
              {createBooking.isPending ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

