import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  X, Heart, MapPin, Briefcase, DollarSign, Calendar,
  ChevronDown, ChevronUp, Users, Sparkles,
} from "lucide-react";
import type { ProfileWithUser } from "@shared/schema";

export default function Discover() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedBio, setExpandedBio] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const { data: candidates, isLoading } = useQuery<ProfileWithUser[]>({
    queryKey: ["/api/discover"],
    enabled: !!user,
  });

  const swipeMutation = useMutation({
    mutationFn: async ({ profileId, direction }: { profileId: string; direction: "left" | "right" }) => {
      const res = await apiRequest("POST", "/api/swipes", {
        swipedProfileId: profileId,
        direction,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/discover"] });
      if (data.match) {
        toast({
          title: "It's a Match!",
          description: "You and this business share aligned values. Start a conversation!",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      }
    },
  });

  const currentProfile = candidates?.[0];

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentProfile) return;
    setExitDirection(direction);
    setTimeout(() => {
      swipeMutation.mutate({ profileId: currentProfile.id, direction });
      setExitDirection(null);
      setExpandedBio(false);
    }, 300);
  };

  const formatPrice = (val: number | null) => {
    if (!val) return "N/A";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-[500px] rounded-md" />
          <div className="flex justify-center gap-6">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-3xl tracking-wide mb-3" data-testid="text-no-more">NO MORE PROFILES</h2>
          <p className="text-muted-foreground text-sm">
            You've seen all available matches. Check back later for new listings!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              x: exitDirection === "left" ? -300 : exitDirection === "right" ? 300 : 0,
              opacity: 0,
              rotate: exitDirection === "left" ? -15 : exitDirection === "right" ? 15 : 0,
              transition: { duration: 0.3 },
            }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-visible">
              <div className="relative">
                <img
                  src={currentProfile.avatarUrl || "/images/profile-seller-1.png"}
                  alt="Profile"
                  className="w-full h-64 object-cover grayscale rounded-t-md"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-md" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="default" className="text-xs">
                      {currentProfile.role === "seller" ? "Seller" : "Buyer"}
                    </Badge>
                    {currentProfile.industry && (
                      <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                        {currentProfile.industry}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-heading text-2xl text-white tracking-wide" data-testid="text-profile-name">
                    {currentProfile.user?.name || "Anonymous"}
                  </h3>
                  {currentProfile.headline && (
                    <p className="text-white/80 text-sm mt-1">{currentProfile.headline}</p>
                  )}
                </div>
              </div>

              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-wrap gap-3">
                  {currentProfile.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {currentProfile.location}
                    </div>
                  )}
                  {currentProfile.yearsExperience && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {currentProfile.yearsExperience} years
                    </div>
                  )}
                  {currentProfile.role === "seller" && currentProfile.askingPrice && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="w-3.5 h-3.5" />
                      {formatPrice(currentProfile.askingPrice)}
                    </div>
                  )}
                  {currentProfile.role === "buyer" && currentProfile.maxBudget && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="w-3.5 h-3.5" />
                      Budget: {formatPrice(currentProfile.minBudget)} - {formatPrice(currentProfile.maxBudget)}
                    </div>
                  )}
                  {currentProfile.role === "seller" && currentProfile.employeeCount && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {currentProfile.employeeCount} employees
                    </div>
                  )}
                </div>

                {currentProfile.bio && (
                  <div>
                    <p className={`text-sm text-muted-foreground leading-relaxed ${!expandedBio ? "line-clamp-3" : ""}`}>
                      {currentProfile.bio}
                    </p>
                    {currentProfile.bio.length > 120 && (
                      <button
                        onClick={() => setExpandedBio(!expandedBio)}
                        className="text-primary text-xs mt-1 flex items-center gap-1"
                        data-testid="button-toggle-bio"
                      >
                        {expandedBio ? <>Show less <ChevronUp className="w-3 h-3" /></> : <>Read more <ChevronDown className="w-3 h-3" /></>}
                      </button>
                    )}
                  </div>
                )}

                {currentProfile.coreValues && currentProfile.coreValues.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Shared Values</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProfile.coreValues.map((val) => (
                        <Badge key={val} variant="outline" className="text-xs">
                          {val}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentProfile.goalStatement && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Goal</p>
                    <p className="text-sm text-muted-foreground italic">"{currentProfile.goalStatement}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-8 mt-6">
          <button
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 rounded-full border-2 border-destructive/30 flex items-center justify-center hover-elevate active-elevate-2 transition-colors"
            disabled={swipeMutation.isPending}
            data-testid="button-swipe-left"
          >
            <X className="w-7 h-7 text-destructive" />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center hover-elevate active-elevate-2 transition-colors bg-primary/5"
            disabled={swipeMutation.isPending}
            data-testid="button-swipe-right"
          >
            <Heart className="w-7 h-7 text-primary" />
          </button>
        </div>

        {candidates.length > 1 && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            {candidates.length - 1} more {candidates.length - 1 === 1 ? "profile" : "profiles"} to discover
          </p>
        )}
      </div>
    </div>
  );
}
