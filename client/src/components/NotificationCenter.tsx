import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Bell, Trash2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

const notificationTypeColors = {
  booking: "bg-blue-100 text-blue-800",
  payment: "bg-green-100 text-green-800",
  review: "bg-purple-100 text-purple-800",
  message: "bg-orange-100 text-orange-800",
  system: "bg-gray-100 text-gray-800",
  promotion: "bg-pink-100 text-pink-800",
};

const notificationTypeIcons = {
  booking: "📅",
  payment: "💳",
  review: "⭐",
  message: "💬",
  system: "⚙️",
  promotion: "🎁",
};

export default function NotificationCenter() {
  const { data: notifications, isLoading, refetch } = trpc.notifications.list.useQuery();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleMarkAsRead = (id: string) => {
    markReadMutation.mutate({ id });
  };

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading notifications...</p>
        </CardContent>
      </Card>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No notifications yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have {unreadCount} unread notifications</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="rounded-full">
              {unreadCount}
            </Badge>
          )}
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const isExpanded = expandedId === notification.id;
          const typeColor = notificationTypeColors[notification.type as keyof typeof notificationTypeColors];
          const typeIcon = notificationTypeIcons[notification.type as keyof typeof notificationTypeIcons];

          return (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all ${
                !notification.isRead ? "border-blue-200 bg-blue-50" : ""
              }`}
              onClick={() => setExpandedId(isExpanded ? null : notification.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{typeIcon}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm md:text-base break-words">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(notification.createdAt), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                      <Badge className={typeColor} variant="secondary">
                        {notification.type}
                      </Badge>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-700 mb-3">{notification.message}</p>
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = notification.actionUrl!;
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        disabled={markReadMutation.isPending}
                        title="Mark as read"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

