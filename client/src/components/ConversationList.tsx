import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { MessageCircle, User } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface ConversationListProps {
  onSelectConversation?: (conversationId: string) => void;
}

export default function ConversationList({
  onSelectConversation,
}: ConversationListProps) {
  const { data: conversations, isLoading } = trpc.messages.listConversations.useQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    onSelectConversation?.(id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading conversations...</p>
        </CardContent>
      </Card>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No conversations yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Start a conversation with other users
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>Your conversations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant={selectedId === conversation.id ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => handleSelectConversation(conversation.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {conversation.otherUserName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {conversation.lastMessageAt
                      ? format(new Date(conversation.lastMessageAt), "MMM d, h:mm a")
                      : "No messages yet"}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge variant="destructive" className="flex-shrink-0">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

