import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Calendar, Heart, ShoppingCart, TrendingUp, MessageSquare, Star, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: bookings = [] } = trpc.bookings.myBookings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: vendorBookings = [] } = trpc.vendors.myBookings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: wishlistItems = [], refetch: refetchWishlist } = trpc.dashboard.getWishlist.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: cartItems = [], refetch: refetchCart } = trpc.dashboard.getCart.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: myPosts = [] } = trpc.dashboard.getMyPosts.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: myLikes = [] } = trpc.dashboard.getMyLikes.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeFromWishlist = trpc.dashboard.removeFromWishlist.useMutation({
    onSuccess: () => {
      toast.success("Removed from wishlist");
      refetchWishlist();
    },
  });

  const removeFromCart = trpc.dashboard.removeFromCart.useMutation({
    onSuccess: () => {
      toast.success("Removed from cart");
      refetchCart();
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => (window.location.href = getLoginUrl())}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allBookings = [...bookings, ...vendorBookings];

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
              <Link href="/social" className="text-sm font-medium hover:text-primary transition-colors">
                Community
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">Manage your bookings, wishlist, and activities all in one place.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{allBookings.length}</div>
                  <div className="text-sm text-muted-foreground">Bookings</div>
                </div>
                <Calendar className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{wishlistItems.length}</div>
                  <div className="text-sm text-muted-foreground">Wishlist</div>
                </div>
                <Heart className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{cartItems.length}</div>
                  <div className="text-sm text-muted-foreground">Cart Items</div>
                </div>
                <ShoppingCart className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{myPosts.length}</div>
                  <div className="text-sm text-muted-foreground">My Posts</div>
                </div>
                <MessageSquare className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="cart">Cart</TabsTrigger>
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="likes">Liked</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View and manage all your bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {allBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No bookings yet</p>
                    <Link href="/events">
                      <Button>Browse Events</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allBookings.map((booking: any) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium mb-1">
                              {booking.bookingType || "Vendor"} Booking
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {booking.startDate && format(new Date(booking.startDate), "MMM dd, yyyy")}
                              {booking.eventDate && format(new Date(booking.eventDate), "MMM dd, yyyy")}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Amount: ₦{((booking.totalAmount || 0) / 100).toLocaleString()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                                booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>Items you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlistItems.map((item: any) => (
                      <div key={item.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.itemType} Item</div>
                          <div className="text-sm text-muted-foreground">Added {format(new Date(item.createdAt), "MMM dd, yyyy")}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist.mutate({ id: item.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
                <CardDescription>Items ready for checkout</CardDescription>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.itemType} Item</div>
                          <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart.mutate({ id: item.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <Button className="w-full">Proceed to Checkout</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Posts</CardTitle>
                <CardDescription>Your activity in the community</CardDescription>
              </CardHeader>
              <CardContent>
                {myPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't posted anything yet</p>
                    <Link href="/social">
                      <Button>Go to Community</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myPosts.map((post: any) => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="font-medium mb-2">{post.content}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{post.likeCount || 0} likes</span>
                          <span>{post.commentCount || 0} comments</span>
                          <span>{format(new Date(post.createdAt), "MMM dd, yyyy")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Likes Tab */}
          <TabsContent value="likes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Liked Posts</CardTitle>
                <CardDescription>Posts you've liked in the community</CardDescription>
              </CardHeader>
              <CardContent>
                {myLikes.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't liked any posts yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myLikes.map((like: any) => (
                      <div key={like.id} className="border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">
                          Liked on {format(new Date(like.createdAt), "MMM dd, yyyy")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

