import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Bell } from "lucide-react";
import { useState } from "react";
import NotificationCenter from "./NotificationCenter";

export default function NotificationBell() {
  const { data: notifications } = trpc.notifications.list.useQuery();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            variant="destructive"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4">
            <NotificationCenter />
          </div>
        </div>
      )}
    </div>
  );
}

