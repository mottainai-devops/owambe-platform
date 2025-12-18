import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Calendar, Heart, MessageSquare, Send, ShoppingCart, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function SocialEnhanced() {
  const { user, isAuthenticated } = useAuth();
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const { data: allPosts = [], refetch: refetchPosts } = trpc.social.getAllPosts.useQuery();
  const { data: partnerPosts = [] } = trpc.social.getPartnerPosts.useQuery();
  const { data: feedPosts = [] } = trpc.social.getPersonalizedFeed.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createPost = trpc.social.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post created!");
      setIsPostDialogOpen(false);
      setPostContent("");
      refetchPosts();
    },
  });

  const likePost = trpc.social.likePost.useMutation({
    onSuccess: () => {
      refetchPosts();
    },
  });

  const addComment = trpc.social.addComment.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Comment added!");
      setCommentText({ ...commentText, [variables.postId]: "" });
      refetchPosts();
    },
  });

  const addToCart = trpc.dashboard.addToCart.useMutation({
    onSuccess: () => {
      toast.success("Added to cart!");
    },
  });

  const addToWishlist = trpc.dashboard.addToWishlist.useMutation({
    onSuccess: () => {
      toast.success("Added to wishlist!");
    },
  });

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!postContent.trim()) {
      toast.error("Please write something");
      return;
    }
    createPost.mutate({ content: postContent });
  };

  const handleLike = (postId: string, postType: "user" | "partner") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    likePost.mutate({ postId, postType });
  };

  const handleComment = (postId: string, postType: "user" | "partner") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    const content = commentText[postId];
    if (!content?.trim()) {
      toast.error("Please write a comment");
      return;
    }
    addComment.mutate({ postId, content, postType });
  };

  const PostCard = ({ post, type }: { post: any; type: "user" | "partner" }) => {
    const isPartnerPost = type === "partner";
    const images = isPartnerPost && post.images ? JSON.parse(post.images) : [];

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {isPartnerPost ? "P" : post.userName?.[0] || "U"}
                </span>
              </div>
              <div>
                <div className="font-medium">
                  {isPartnerPost ? post.title : (post.userName || "User")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(post.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                  {isPartnerPost && (
                    <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      {post.partnerType} Partner
                    </span>
                  )}
                </div>
              </div>
            </div>
            {isPartnerPost && post.itemType && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {post.itemType}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{post.content}</p>

          {/* Partner Post Images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {images.slice(0, 4).map((img: string, idx: number) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                  <img src={img} alt={`Post image ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Partner Post Price & Actions */}
          {isPartnerPost && post.price && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="text-2xl font-bold text-primary">
                  ₦{(post.price / 100).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addToWishlist.mutate({
                    itemType: post.partnerType,
                    itemId: post.linkedItemId || post.id,
                  })}
                  disabled={!isAuthenticated}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={() => addToCart.mutate({
                    itemType: post.partnerType,
                    itemId: post.linkedItemId || post.id,
                    quantity: 1,
                  })}
                  disabled={!isAuthenticated}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-3">
            <button
              className="flex items-center gap-1 hover:text-primary transition-colors"
              onClick={() => handleLike(post.id, type)}
            >
              <Heart className="h-4 w-4" />
              <span>{post.likeCount || 0}</span>
            </button>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentCount || 0}</span>
            </div>
            {isPartnerPost && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{post.viewCount || 0} views</span>
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Write a comment..."
              value={commentText[post.id] || ""}
              onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleComment(post.id, type);
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => handleComment(post.id, type)}
              disabled={!commentText[post.id]?.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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
              {isAuthenticated && (
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Community</h1>
            <p className="text-muted-foreground">Connect, share, and discover amazing events and services</p>
          </div>

          {/* Create Post Button */}
          {isAuthenticated && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <Button className="w-full" onClick={() => setIsPostDialogOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Share your thoughts...
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feed Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="partners">Partner Offers</TabsTrigger>
              {isAuthenticated && <TabsTrigger value="feed">Your Feed</TabsTrigger>}
            </TabsList>

            {/* All Posts */}
            <TabsContent value="all" className="space-y-4">
              {allPosts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
                  </CardContent>
                </Card>
              ) : (
                allPosts.map((post: any) => <PostCard key={post.id} post={post} type="user" />)
              )}
            </TabsContent>

            {/* Partner Posts */}
            <TabsContent value="partners" className="space-y-4">
              {partnerPosts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No partner offers available</p>
                  </CardContent>
                </Card>
              ) : (
                partnerPosts.map((post: any) => <PostCard key={post.id} post={post} type="partner" />)
              )}
            </TabsContent>

            {/* Personalized Feed */}
            {isAuthenticated && (
              <TabsContent value="feed" className="space-y-4">
                {feedPosts.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Your personalized feed will appear here based on your interests
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Interact with posts and bookings to help us curate content for you
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  feedPosts.map((post: any) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      type={post.partnerType ? "partner" : "user"}
                    />
                  ))
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>Share your thoughts with the community</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">What's on your mind?</Label>
              <Textarea
                id="content"
                placeholder="Share your experience, ask questions, or start a conversation..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost} disabled={createPost.isPending || !postContent.trim()}>
              {createPost.isPending ? "Posting..." : "Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

