import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Search, Star, TrendingUp, Verified } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const vendorTypeLabels: Record<string, string> = {
  all: "All Vendors",
  catering: "Catering",
  photography: "Photography & Video",
  entertainment: "Entertainment",
  decoration: "Decoration",
  planning: "Event Planning",
  equipment: "Equipment Rental",
  security: "Security Services",
  transportation: "Transportation",
  other: "Other Services"
};

const vendorTypeIcons: Record<string, string> = {
  catering: "🍽️",
  photography: "📸",
  entertainment: "🎵",
  decoration: "🎨",
  planning: "📋",
  equipment: "🎪",
  security: "🛡️",
  transportation: "🚗",
  other: "⭐"
};

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const { data: vendors = [], isLoading } = trpc.vendors.list.useQuery();

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || vendor.vendorType === selectedType;
    return matchesSearch && matchesType;
  });

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

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Vendors</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find trusted professionals to make your event perfect. From catering to entertainment, we've got you covered.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(vendorTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="container py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No vendors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => {
              const portfolio = vendor.portfolio ? JSON.parse(vendor.portfolio) : [];
              const perks = vendor.perks ? JSON.parse(vendor.perks) : [];
              const rating = vendor.rating / 100;

              return (
                <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={portfolio[0] || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"}
                        alt={vendor.businessName}
                        className="w-full h-full object-cover"
                      />
                      {vendor.featured === 1 && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </div>
                      )}
                      {vendor.verified === 1 && (
                        <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Verified className="h-3 w-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{vendor.businessName}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span className="text-lg">{vendorTypeIcons[vendor.vendorType]}</span>
                            <span>{vendorTypeLabels[vendor.vendorType]}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({vendor.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span>{vendor.totalBookings} bookings</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="line-clamp-2">
                        {vendor.description}
                      </CardDescription>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{vendor.serviceArea}</span>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="text-sm text-muted-foreground mb-2">Starting from</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">
                            ₦{((vendor.basePrice || 0) / 100).toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">{vendor.priceUnit}</span>
                        </div>
                      </div>

                      {perks.length > 0 && (
                        <div className="pt-3 border-t">
                          <div className="text-xs font-medium text-primary mb-1">✨ Special Perk</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{perks[0]}</div>
                        </div>
                      )}

                      <Button className="w-full mt-4">View Details & Book</Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

