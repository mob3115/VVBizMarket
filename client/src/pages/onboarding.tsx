import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowRight, ArrowLeft, Loader2, X } from "lucide-react";

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Manufacturing", "Retail",
  "Food & Beverage", "Real Estate", "Education", "Professional Services",
  "Construction", "Energy", "Agriculture", "Media & Entertainment", "Transportation",
];

const CORE_VALUES = [
  "Community Impact", "Sustainability", "Employee Welfare", "Innovation",
  "Integrity", "Customer First", "Diversity & Inclusion", "Work-Life Balance",
  "Family Values", "Environmental Stewardship", "Quality Craftsmanship",
  "Social Responsibility", "Transparency", "Growth Mindset", "Mentorship",
];

const REVENUE_RANGES = [
  "Under $500K", "$500K - $1M", "$1M - $5M", "$5M - $10M",
  "$10M - $25M", "$25M - $50M", "$50M - $100M", "$100M+",
];

const EMPLOYEE_COUNTS = [
  "1-5", "6-15", "16-50", "51-100", "101-250", "251-500", "500+",
];

export default function Onboarding() {
  const { user, refetchUser } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const isSeller = user?.role === "seller" || user?.role === "dual";
  const isBuyer = user?.role === "buyer" || user?.role === "dual";
  const totalSteps = user?.role === "dual" ? 4 : 3;

  const [sellerProfile, setSellerProfile] = useState({
    headline: "",
    bio: "",
    industry: "",
    location: "",
    yearsExperience: 0,
    coreValues: [] as string[],
    goalStatement: "",
    askingPrice: 0,
    revenueRange: "",
    employeeCount: "",
    businessName: "",
    transitionPeriod: "",
    whySelling: "",
  });

  const [buyerProfile, setBuyerProfile] = useState({
    headline: "",
    bio: "",
    industry: "",
    location: "",
    yearsExperience: 0,
    coreValues: [] as string[],
    goalStatement: "",
    minBudget: 0,
    maxBudget: 0,
    fundingSource: "",
    preferredIndustries: [] as string[],
    whyBuying: "",
  });

  const toggleValue = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isSeller) {
        await apiRequest("POST", "/api/profiles", {
          userId: user!.id,
          role: "seller",
          ...sellerProfile,
          avatarUrl: `/images/profile-seller-${Math.ceil(Math.random() * 2)}.png`,
        });
      }
      if (isBuyer) {
        await apiRequest("POST", "/api/profiles", {
          userId: user!.id,
          role: "buyer",
          ...buyerProfile,
          avatarUrl: `/images/profile-buyer-${Math.ceil(Math.random() * 2)}.png`,
        });
      }
      await apiRequest("PATCH", `/api/users/${user!.id}/onboarding`);
      await refetchUser();
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      navigate("/discover");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderSellerStep = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Business Name (kept private until you choose to reveal)</Label>
        <Input
          value={sellerProfile.businessName}
          onChange={(e) => setSellerProfile({ ...sellerProfile, businessName: e.target.value })}
          placeholder="Your business name"
          data-testid="input-business-name"
        />
      </div>
      <div className="space-y-2">
        <Label>Headline</Label>
        <Input
          value={sellerProfile.headline}
          onChange={(e) => setSellerProfile({ ...sellerProfile, headline: e.target.value })}
          placeholder="e.g., Family-owned bakery seeking values-aligned buyer"
          data-testid="input-seller-headline"
        />
      </div>
      <div className="space-y-2">
        <Label>About Your Business</Label>
        <Textarea
          value={sellerProfile.bio}
          onChange={(e) => setSellerProfile({ ...sellerProfile, bio: e.target.value })}
          placeholder="Tell us about your business and what makes it special..."
          className="min-h-[100px]"
          data-testid="textarea-seller-bio"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select value={sellerProfile.industry} onValueChange={(v) => setSellerProfile({ ...sellerProfile, industry: v })}>
            <SelectTrigger data-testid="select-seller-industry"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={sellerProfile.location}
            onChange={(e) => setSellerProfile({ ...sellerProfile, location: e.target.value })}
            placeholder="City, State"
            data-testid="input-seller-location"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Revenue Range</Label>
          <Select value={sellerProfile.revenueRange} onValueChange={(v) => setSellerProfile({ ...sellerProfile, revenueRange: v })}>
            <SelectTrigger data-testid="select-revenue"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {REVENUE_RANGES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Employee Count</Label>
          <Select value={sellerProfile.employeeCount} onValueChange={(v) => setSellerProfile({ ...sellerProfile, employeeCount: v })}>
            <SelectTrigger data-testid="select-employees"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {EMPLOYEE_COUNTS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Asking Price ($)</Label>
          <Input
            type="number"
            value={sellerProfile.askingPrice || ""}
            onChange={(e) => setSellerProfile({ ...sellerProfile, askingPrice: parseInt(e.target.value) || 0 })}
            placeholder="500000"
            data-testid="input-asking-price"
          />
        </div>
        <div className="space-y-2">
          <Label>Years in Business</Label>
          <Input
            type="number"
            value={sellerProfile.yearsExperience || ""}
            onChange={(e) => setSellerProfile({ ...sellerProfile, yearsExperience: parseInt(e.target.value) || 0 })}
            placeholder="10"
            data-testid="input-seller-years"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Why are you selling?</Label>
        <Textarea
          value={sellerProfile.whySelling}
          onChange={(e) => setSellerProfile({ ...sellerProfile, whySelling: e.target.value })}
          placeholder="Share your reason for selling..."
          data-testid="textarea-why-selling"
        />
      </div>
      <div className="space-y-2">
        <Label>Transition Period</Label>
        <Select value={sellerProfile.transitionPeriod} onValueChange={(v) => setSellerProfile({ ...sellerProfile, transitionPeriod: v })}>
          <SelectTrigger data-testid="select-transition"><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1-3 months">1-3 months</SelectItem>
            <SelectItem value="3-6 months">3-6 months</SelectItem>
            <SelectItem value="6-12 months">6-12 months</SelectItem>
            <SelectItem value="1-2 years">1-2 years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderBuyerStep = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Headline</Label>
        <Input
          value={buyerProfile.headline}
          onChange={(e) => setBuyerProfile({ ...buyerProfile, headline: e.target.value })}
          placeholder="e.g., Experienced operator seeking community-focused business"
          data-testid="input-buyer-headline"
        />
      </div>
      <div className="space-y-2">
        <Label>About You</Label>
        <Textarea
          value={buyerProfile.bio}
          onChange={(e) => setBuyerProfile({ ...buyerProfile, bio: e.target.value })}
          placeholder="Share your background and what you're looking for..."
          className="min-h-[100px]"
          data-testid="textarea-buyer-bio"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={buyerProfile.location}
            onChange={(e) => setBuyerProfile({ ...buyerProfile, location: e.target.value })}
            placeholder="City, State"
            data-testid="input-buyer-location"
          />
        </div>
        <div className="space-y-2">
          <Label>Years Experience</Label>
          <Input
            type="number"
            value={buyerProfile.yearsExperience || ""}
            onChange={(e) => setBuyerProfile({ ...buyerProfile, yearsExperience: parseInt(e.target.value) || 0 })}
            placeholder="10"
            data-testid="input-buyer-years"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Budget ($)</Label>
          <Input
            type="number"
            value={buyerProfile.minBudget || ""}
            onChange={(e) => setBuyerProfile({ ...buyerProfile, minBudget: parseInt(e.target.value) || 0 })}
            placeholder="100000"
            data-testid="input-min-budget"
          />
        </div>
        <div className="space-y-2">
          <Label>Max Budget ($)</Label>
          <Input
            type="number"
            value={buyerProfile.maxBudget || ""}
            onChange={(e) => setBuyerProfile({ ...buyerProfile, maxBudget: parseInt(e.target.value) || 0 })}
            placeholder="1000000"
            data-testid="input-max-budget"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Funding Source</Label>
        <Select value={buyerProfile.fundingSource} onValueChange={(v) => setBuyerProfile({ ...buyerProfile, fundingSource: v })}>
          <SelectTrigger data-testid="select-funding"><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Self-funded">Self-funded</SelectItem>
            <SelectItem value="SBA Loan">SBA Loan</SelectItem>
            <SelectItem value="Private Equity">Private Equity</SelectItem>
            <SelectItem value="Angel/VC">Angel/VC</SelectItem>
            <SelectItem value="Family Office">Family Office</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Why are you buying?</Label>
        <Textarea
          value={buyerProfile.whyBuying}
          onChange={(e) => setBuyerProfile({ ...buyerProfile, whyBuying: e.target.value })}
          placeholder="Share what drives you to acquire a business..."
          data-testid="textarea-why-buying"
        />
      </div>
      <div className="space-y-2">
        <Label>Preferred Industries</Label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <Badge
              key={ind}
              variant={buyerProfile.preferredIndustries.includes(ind) ? "default" : "outline"}
              className={`cursor-pointer ${buyerProfile.preferredIndustries.includes(ind) ? "" : ""}`}
              onClick={() => setBuyerProfile({ ...buyerProfile, preferredIndustries: toggleValue(buyerProfile.preferredIndustries, ind) })}
              data-testid={`badge-industry-${ind.toLowerCase().replace(/\s/g, "-")}`}
            >
              {ind}
              {buyerProfile.preferredIndustries.includes(ind) && <X className="w-3 h-3 ml-1" />}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderValuesStep = (
    values: string[],
    goal: string,
    onValuesChange: (v: string[]) => void,
    onGoalChange: (g: string) => void,
    prefix: string
  ) => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>What are your core values? (Select at least 3)</Label>
        <div className="flex flex-wrap gap-2">
          {CORE_VALUES.map((val) => (
            <Badge
              key={val}
              variant={values.includes(val) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onValuesChange(toggleValue(values, val))}
              data-testid={`badge-value-${prefix}-${val.toLowerCase().replace(/\s/g, "-")}`}
            >
              {val}
              {values.includes(val) && <X className="w-3 h-3 ml-1" />}
            </Badge>
          ))}
        </div>
        {values.length > 0 && (
          <p className="text-sm text-muted-foreground">{values.length} selected</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Goal Statement</Label>
        <Textarea
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
          placeholder="What do you hope to achieve through this business transition?"
          className="min-h-[120px]"
          data-testid={`textarea-goal-${prefix}`}
        />
      </div>
    </div>
  );

  const getStepContent = () => {
    if (user?.role === "seller") {
      if (step === 1) return renderSellerStep();
      if (step === 2) return renderValuesStep(sellerProfile.coreValues, sellerProfile.goalStatement, (v) => setSellerProfile({ ...sellerProfile, coreValues: v }), (g) => setSellerProfile({ ...sellerProfile, goalStatement: g }), "seller");
      return null;
    }
    if (user?.role === "buyer") {
      if (step === 1) return renderBuyerStep();
      if (step === 2) return renderValuesStep(buyerProfile.coreValues, buyerProfile.goalStatement, (v) => setBuyerProfile({ ...buyerProfile, coreValues: v }), (g) => setBuyerProfile({ ...buyerProfile, goalStatement: g }), "buyer");
      return null;
    }
    if (step === 1) return renderSellerStep();
    if (step === 2) return renderValuesStep(sellerProfile.coreValues, sellerProfile.goalStatement, (v) => setSellerProfile({ ...sellerProfile, coreValues: v }), (g) => setSellerProfile({ ...sellerProfile, goalStatement: g }), "seller");
    if (step === 3) return renderBuyerStep();
    if (step === 4) return renderValuesStep(buyerProfile.coreValues, buyerProfile.goalStatement, (v) => setBuyerProfile({ ...buyerProfile, coreValues: v }), (g) => setBuyerProfile({ ...buyerProfile, goalStatement: g }), "buyer");
    return null;
  };

  const getStepTitle = () => {
    if (user?.role === "seller") {
      return step === 1 ? "Your Business Details" : "Your Values & Goals";
    }
    if (user?.role === "buyer") {
      return step === 1 ? "Your Acquisition Preferences" : "Your Values & Goals";
    }
    if (step === 1) return "Your Business Details (Seller)";
    if (step === 2) return "Seller Values & Goals";
    if (step === 3) return "Your Acquisition Preferences (Buyer)";
    return "Buyer Values & Goals";
  };

  const isLastStep = step === totalSteps;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="font-heading text-4xl tracking-wide text-primary mb-1" data-testid="text-onboarding-title">V+V</h1>
          <p className="text-sm text-muted-foreground">Complete Your Profile</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{getStepTitle()}</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-1" />
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="font-heading text-2xl tracking-wide mb-6" data-testid="text-step-title">{getStepTitle().toUpperCase()}</h2>
            {getStepContent()}
            <div className="flex items-center justify-between mt-8 gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              {isLastStep ? (
                <Button onClick={handleSubmit} disabled={loading} data-testid="button-complete">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Profile"}
                  {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              ) : (
                <Button onClick={() => setStep(step + 1)} data-testid="button-next">
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
