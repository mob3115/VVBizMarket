import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import type { Message, MatchWithProfiles } from "@shared/schema";

export default function Messages() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/messages/:matchId");
  const matchId = params?.matchId;
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: match, isLoading: matchLoading } = useQuery<MatchWithProfiles>({
    queryKey: ["/api/matches", matchId],
    enabled: !!matchId,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages", matchId],
    enabled: !!matchId,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/messages", { matchId, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", matchId] });
      setNewMessage("");
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMutation.mutate(newMessage.trim());
  };

  const otherProfile = match
    ? match.buyerProfile.userId === user?.id
      ? match.sellerProfile
      : match.buyerProfile
    : null;

  if (matchLoading || messagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className={`h-12 rounded-md ${i % 2 ? "w-2/3" : "w-2/3 ml-auto"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!match || !otherProfile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Match not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate("/matches")} data-testid="button-back-matches">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Avatar className="w-9 h-9">
          <AvatarImage src={otherProfile.avatarUrl || ""} className="grayscale object-cover" />
          <AvatarFallback className="text-sm font-heading">
            {otherProfile.user?.name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate" data-testid="text-chat-name">
              {otherProfile.user?.name || "Anonymous"}
            </h3>
            <Badge variant="outline" className="text-xs shrink-0">
              {otherProfile.role === "seller" ? "Seller" : "Buyer"}
            </Badge>
          </div>
          {otherProfile.industry && (
            <p className="text-xs text-muted-foreground truncate">{otherProfile.industry}</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {!messages || messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              Start a conversation about your shared values and vision.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                data-testid={`message-${msg.id}`}
              >
                <div
                  className={`max-w-[75%] rounded-md px-3 py-2 ${
                    isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t flex items-center gap-2 shrink-0">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          data-testid="input-message"
        />
        <Button
          type="submit"
          size="icon"
          disabled={sendMutation.isPending || !newMessage.trim()}
          data-testid="button-send-message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
