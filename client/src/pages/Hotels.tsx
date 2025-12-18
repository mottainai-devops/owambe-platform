import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Calendar, Hotel, MapPin, Search, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Hotels() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: hotels, isLoading } = trpc.hotels.list.useQuery();

  const filteredHotels = hotels?.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Perfect Stay</h1>
          <p className="text-muted-foreground text-lg">
            Discover comfortable hotels for your next trip
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hotels by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Hotels Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-56 bg-muted"></div>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredHotels && filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <Card key={hotel.id} className="hover:shadow-lg transition-all cursor-pointer h-full group">
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {hotel.starRating && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{hotel.starRating}</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {hotel.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {hotel.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {hotel.city}, {hotel.country}
                    </div>
                  </div>
                  {hotel.amenities && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {JSON.parse(hotel.amenities).slice(0, 4).map((amenity: string, idx: number) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded-full bg-muted">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">From</div>
                      <div className="font-bold text-lg text-primary">
                        ₦{hotel.pricePerNight ? (hotel.pricePerNight / 100).toLocaleString() : "N/A"}/night
                      </div>
                    </div>
                    <Button size="sm">Book Room</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Hotel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search to find what you're looking for.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

