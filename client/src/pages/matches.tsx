import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Handshake, MapPin, DollarSign } from "lucide-react";
import type { MatchWithProfiles } from "@shared/schema";

export default function Matches() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: matches, isLoading } = useQuery<MatchWithProfiles[]>({
    queryKey: ["/api/matches"],
    enabled: !!user,
  });

  const formatPrice = (val: number | null) => {
    if (!val) return "N/A";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-4 max-w-3xl mx-auto w-full">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 max-w-3xl mx-auto w-full overflow-auto">
      <div className="mb-8">
        <h1 className="font-heading text-4xl tracking-wide" data-testid="text-matches-title">YOUR MATCHES</h1>
        <p className="text-muted-foreground text-sm mt-1">
          These businesses share your values. Start a conversation to explore further.
        </p>
      </div>

      {!matches || matches.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Handshake className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-2xl tracking-wide mb-3" data-testid="text-no-matches">NO MATCHES YET</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Keep discovering profiles to find values-aligned matches. When both sides express interest, it's a match!
          </p>
          <Button onClick={() => navigate("/discover")} data-testid="button-go-discover">
            Discover Profiles
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const otherProfile =
              match.buyerProfile.userId === user?.id ? match.sellerProfile : match.buyerProfile;
            const otherUser = otherProfile.user;

            return (
              <Card key={match.id} className="hover-elevate">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 rounded-md">
                      <AvatarImage
                        src={otherProfile.avatarUrl || ""}
                        className="grayscale object-cover"
                      />
                      <AvatarFallback className="rounded-md font-heading text-lg">
                        {otherUser?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading text-xl tracking-wide" data-testid={`text-match-name-${match.id}`}>
                              {otherUser?.name || "Anonymous"}
                            </h3>
                            <Badge variant="default" className="text-xs">
                              {otherProfile.role === "seller" ? "Seller" : "Buyer"}
                            </Badge>
                          </div>
                          {otherProfile.headline && (
                            <p className="text-sm text-muted-foreground mt-0.5">{otherProfile.headline}</p>
                          )}
                        </div>
                        {match.compatibilityScore && (
                          <div className="text-right">
                            <div className="text-lg font-heading text-primary">
                              {Math.round(match.compatibilityScore)}%
                            </div>
                            <p className="text-xs text-muted-foreground">match</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2">
                        {otherProfile.industry && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {otherProfile.industry}
                          </span>
                        )}
                        {otherProfile.role === "seller" && otherProfile.askingPrice && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatPrice(otherProfile.askingPrice)}
                          </span>
                        )}
                        {otherProfile.location && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {otherProfile.location}
                          </span>
                        )}
                      </div>

                      {otherProfile.coreValues && otherProfile.coreValues.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {otherProfile.coreValues.slice(0, 4).map((val) => (
                            <Badge key={val} variant="outline" className="text-xs">
                              {val}
                            </Badge>
                          ))}
                          {otherProfile.coreValues.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{otherProfile.coreValues.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="mt-3">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/messages/${match.id}`)}
                          data-testid={`button-message-${match.id}`}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
