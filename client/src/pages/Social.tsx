import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Calendar, Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Social() {
  const { user, isAuthenticated } = useAuth();
  const [newPost, setNewPost] = useState("");
  const { data: posts, isLoading } = trpc.social.posts.useQuery();
  const utils = trpc.useUtils();

  const createPostMutation = trpc.social.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully!");
      setNewPost("");
      utils.social.posts.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to create post: " + error.message);
    },
  });

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast.error("Please write something before posting");
      return;
    }
    createPostMutation.mutate({
      content: newPost,
      likesCount: 0,
      commentsCount: 0,
    });
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
              <Link href="/hotels" className="text-sm font-medium hover:text-primary transition-colors">
                Hotels
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Community Feed</h1>
            <p className="text-muted-foreground text-lg">
              Share your experiences and connect with other event-goers
            </p>
          </div>

          {/* Create Post */}
          {isAuthenticated ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>Tell the community about your latest event</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] mb-4"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleCreatePost}
                    disabled={createPostMutation.isPending || !newPost.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {createPostMutation.isPending ? "Posting..." : "Post"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Sign in to share your experiences and connect with the community
                  </p>
                  <a href={getLoginUrl()}>
                    <Button>Sign In to Post</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts Feed */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/6"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded mb-4"></div>
                    <div className="h-48 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                        U
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">User</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(post.createdAt!).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
                    {post.imageUrl && (
                      <div className="rounded-lg overflow-hidden mb-4">
                        <img
                          src={post.imageUrl}
                          alt="Post image"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-6 pt-4 border-t">
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.likesCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.commentsCount || 0}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your experience with the community!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

