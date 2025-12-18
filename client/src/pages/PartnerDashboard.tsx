import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Building2, Calendar as CalendarIcon, Check, DollarSign, Globe, Hotel, MapPin, Percent, Plus, TrendingUp, Users, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function PartnerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: venues } = trpc.venues.list.useQuery();
  const { data: hotels } = trpc.hotels.list.useQuery();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Partner Portal Access</CardTitle>
            <CardDescription>Sign in to access your partner dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full">Sign In to Partner Portal</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock data for demonstration
  const analytics = {
    totalRevenue: 2450000,
    totalBookings: 156,
    activeListings: (venues?.length || 0) + (hotels?.length || 0),
    avgRating: 4.7,
  };

  const mockBookings = [
    { id: "1", property: "Grand Ballroom Lagos", customer: "John Doe", date: "2025-11-15", amount: 150000, status: "confirmed" },
    { id: "2", property: "Royal Palm Hotel", customer: "Jane Smith", date: "2025-11-20", amount: 85000, status: "pending" },
    { id: "3", property: "Garden Paradise Venue", customer: "Mike Johnson", date: "2025-11-22", amount: 100000, status: "confirmed" },
  ];

  const mockDiscounts = [
    { id: "1", code: "EARLY2025", type: "percentage", value: 20, usage: 45, limit: 100, status: "active" },
    { id: "2", code: "WEEKEND50", type: "fixed", value: 5000, usage: 12, limit: 50, status: "active" },
  ];

  const mockGDSChannels = [
    { id: "1", name: "Booking.com", type: "OTA", status: "active", bookings: 45, commission: 15 },
    { id: "2", name: "Expedia", type: "OTA", status: "active", bookings: 32, commission: 18 },
    { id: "3", name: "Amadeus GDS", type: "GDS", status: "inactive", bookings: 0, commission: 12 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-primary">Owambe Partner</h1>
                  <p className="text-xs text-muted-foreground">Business Dashboard</p>
                </div>
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Main Site
              </Link>
              <span className="text-sm text-muted-foreground">{user?.name}</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">
            Manage your properties, bookings, discounts, and distribution channels
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(analytics.totalRevenue / 100).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeListings}</div>
              <p className="text-xs text-muted-foreground">
                {venues?.length || 0} venues, {hotels?.length || 0} hotels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgRating}</div>
              <p className="text-xs text-muted-foreground">Based on 234 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="discounts">Discounts</TabsTrigger>
            <TabsTrigger value="gds">Distribution</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
          </TabsList>

          {/* Booking Portal Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Booking Management</h3>
                <p className="text-muted-foreground">Real-time booking portal for all your properties</p>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.property}</TableCell>
                      <TableCell>{booking.customer}</TableCell>
                      <TableCell>{format(new Date(booking.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>₦{(booking.amount / 100).toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          {booking.status === "pending" && (
                            <>
                              <Button variant="outline" size="sm" className="text-green-600">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Availability Calendar</h3>
                <p className="text-muted-foreground">Manage availability and pricing for your properties</p>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {venues?.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>{venue.name}</SelectItem>
                  ))}
                  {hotels?.map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id}>{hotel.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>November 2025</CardTitle>
                  <CardDescription>Click on dates to manage availability and pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-sm font-semibold text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                      const isBooked = [5, 12, 15, 20, 22, 25].includes(day);
                      const isBlocked = [8, 9].includes(day);
                      return (
                        <button
                          key={day}
                          className={`aspect-square p-2 rounded-lg border text-sm font-medium transition-colors ${
                            isBooked
                              ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                              : isBlocked
                              ? "bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 mt-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                      <span>Blocked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Occupancy Rate</div>
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-xs text-green-600">+5% from last month</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Daily Rate</div>
                    <div className="text-2xl font-bold">₦12,500</div>
                    <div className="text-xs text-green-600">+3% from last month</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Revenue Per Available</div>
                    <div className="text-2xl font-bold">₦9,750</div>
                    <div className="text-xs text-green-600">+8% from last month</div>
                  </div>
                  <Button className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Block Dates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Discount Management</h3>
                <p className="text-muted-foreground">Create and manage promotional campaigns</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Discount
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Discount</DialogTitle>
                    <DialogDescription>Set up a promotional discount code for your properties</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code">Discount Code</Label>
                      <Input id="code" placeholder="e.g., SUMMER2025" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select defaultValue="percentage">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="value">Value</Label>
                        <Input id="value" type="number" placeholder="20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start">Start Date</Label>
                        <Input id="start" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end">End Date</Label>
                        <Input id="end" type="date" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="limit">Usage Limit</Label>
                      <Input id="limit" type="number" placeholder="100" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Discount</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockDiscounts.map((discount) => (
                <Card key={discount.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Percent className="h-5 w-5" />
                          {discount.code}
                        </CardTitle>
                        <CardDescription>
                          {discount.type === "percentage" ? `${discount.value}% off` : `₦${discount.value / 100} off`}
                        </CardDescription>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {discount.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Usage</span>
                          <span className="font-medium">
                            {discount.usage} / {discount.limit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(discount.usage / discount.limit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Deactivate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* GDS Distribution Tab */}
          <TabsContent value="gds" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Distribution Channels</h3>
                <p className="text-muted-foreground">Manage your global distribution system connections</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Connect Channel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockGDSChannels.map((channel) => (
                <Card key={channel.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Globe className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{channel.name}</CardTitle>
                          <CardDescription>{channel.type}</CardDescription>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          channel.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {channel.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Bookings</div>
                        <div className="text-2xl font-bold">{channel.bookings}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Commission</div>
                        <div className="text-2xl font-bold">{channel.commission}%</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Configure
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={channel.status === "inactive"}
                      >
                        Sync Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Performance</CardTitle>
                <CardDescription>Revenue breakdown by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Net Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Booking.com</TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>₦675,000</TableCell>
                      <TableCell>₦101,250</TableCell>
                      <TableCell className="font-semibold">₦573,750</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Expedia</TableCell>
                      <TableCell>32</TableCell>
                      <TableCell>₦480,000</TableCell>
                      <TableCell>₦86,400</TableCell>
                      <TableCell className="font-semibold">₦393,600</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Direct Bookings</TableCell>
                      <TableCell>79</TableCell>
                      <TableCell>₦1,185,000</TableCell>
                      <TableCell>₦0</TableCell>
                      <TableCell className="font-semibold">₦1,185,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Venues Tab */}
          <TabsContent value="venues" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Your Venues</h3>
              <Button>
                <MapPin className="h-4 w-4 mr-2" />
                Add New Venue
              </Button>
            </div>

            {venues && venues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {venues.map((venue) => (
                  <Card key={venue.id}>
                    <div className="h-48 overflow-hidden">
                      <img
                        src={venue.imageUrl || "https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=800"}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{venue.name}</CardTitle>
                      <CardDescription>
                        {venue.city}, {venue.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          Capacity: {venue.capacity}
                        </div>
                        <div className="font-bold text-primary">
                          ₦{venue.pricePerDay ? (venue.pricePerDay / 100).toLocaleString() : "N/A"}/day
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          View Stats
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No venues yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first venue to the platform</p>
                <Button>Add Your First Venue</Button>
              </Card>
            )}
          </TabsContent>

          {/* Hotels Tab */}
          <TabsContent value="hotels" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Your Hotels</h3>
              <Button>
                <Hotel className="h-4 w-4 mr-2" />
                Add New Hotel
              </Button>
            </div>

            {hotels && hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotels.map((hotel) => (
                  <Card key={hotel.id}>
                    <div className="h-48 overflow-hidden">
                      <img
                        src={hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{hotel.name}</CardTitle>
                      <CardDescription>
                        {hotel.city}, {hotel.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-muted-foreground">{hotel.starRating} Star Hotel</div>
                        <div className="font-bold text-primary">
                          ₦{hotel.pricePerNight ? (hotel.pricePerNight / 100).toLocaleString() : "N/A"}/night
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          View Stats
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Hotel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hotels yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first hotel to the platform</p>
                <Button>Add Your First Hotel</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

