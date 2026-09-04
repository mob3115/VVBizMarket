import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  MapPin, DollarSign, Calendar, Briefcase, Users,
  Heart, Target, LogOut,
} from "lucide-react";
import { useLocation } from "wouter";
import type { Profile } from "@shared/schema";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const { data: profiles, isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles", "me"],
    enabled: !!user,
  });

  const formatPrice = (val: number | null) => {
    if (!val) return "N/A";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-4 max-w-2xl mx-auto w-full">
        <Skeleton className="h-32 rounded-md" />
        <Skeleton className="h-64 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 max-w-2xl mx-auto w-full overflow-auto">
      <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <h1 className="font-heading text-4xl tracking-wide" data-testid="text-profile-title">YOUR PROFILE</h1>
        <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-1" /> Sign Out
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="font-heading text-2xl bg-primary text-primary-foreground">
                {user?.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-heading text-2xl tracking-wide" data-testid="text-user-name">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="outline" className="mt-1 text-xs capitalize">{user?.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {profiles && profiles.map((profile) => (
        <Card key={profile.id} className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default">{profile.role === "seller" ? "Seller Profile" : "Buyer Profile"}</Badge>
              {profile.industry && (
                <Badge variant="outline">{profile.industry}</Badge>
              )}
            </div>

            {profile.headline && (
              <h3 className="text-lg font-medium mb-2">{profile.headline}</h3>
            )}
            {profile.bio && (
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{profile.bio}</p>
            )}

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              {profile.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.yearsExperience && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>{profile.yearsExperience} years experience</span>
                </div>
              )}
              {profile.role === "seller" && profile.askingPrice && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span>Asking: {formatPrice(profile.askingPrice)}</span>
                </div>
              )}
              {profile.role === "seller" && profile.revenueRange && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Revenue: {profile.revenueRange}</span>
                </div>
              )}
              {profile.role === "seller" && profile.employeeCount && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>{profile.employeeCount} employees</span>
                </div>
              )}
              {profile.role === "buyer" && profile.maxBudget && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span>Budget: {formatPrice(profile.minBudget)} - {formatPrice(profile.maxBudget)}</span>
                </div>
              )}
              {profile.role === "buyer" && profile.fundingSource && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>{profile.fundingSource}</span>
                </div>
              )}
            </div>

            {profile.coreValues && profile.coreValues.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Core Values
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.coreValues.map((val) => (
                      <Badge key={val} variant="outline" className="text-xs">{val}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {profile.goalStatement && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider flex items-center gap-1">
                    <Target className="w-3 h-3" /> Goal Statement
                  </p>
                  <p className="text-sm italic text-muted-foreground">"{profile.goalStatement}"</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
