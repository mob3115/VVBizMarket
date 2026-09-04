import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowRight, Handshake, Shield, Target, Users } from "lucide-react";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="font-heading text-3xl tracking-wide text-primary">V+V</span>
            <span className="text-sm text-muted-foreground hidden sm:block">Vision + Values</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")} data-testid="button-login">
              Log In
            </Button>
            <Button onClick={() => navigate("/register")} data-testid="button-register">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-handshake.png"
            alt="Business handshake"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-6xl sm:text-8xl lg:text-9xl text-white tracking-wider leading-none mb-6" data-testid="text-hero-title">
            VISION + VALUES
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-4 font-light" data-testid="text-tagline">
            The place where you buy and sell businesses based on shared values.
          </p>
          <div className="w-16 h-1 bg-primary mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/register")} className="text-base px-8" data-testid="button-hero-get-started">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} className="text-base px-8 bg-white/10 backdrop-blur-sm text-white border-white/30" data-testid="button-hero-learn-more">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl tracking-wide mb-4" data-testid="text-how-it-works">HOW IT WORKS</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We match business buyers and sellers who share similar values, ensuring a legacy-driven transition.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Create Your Profile",
                desc: "Share your values, goals, and what matters most in a business transition. Our platform keeps your information private until you're ready.",
              },
              {
                icon: Users,
                title: "Get Matched",
                desc: "Our matching engine pairs you with compatible buyers or sellers based on values alignment, industry fit, and financial compatibility.",
              },
              {
                icon: Handshake,
                title: "Connect & Close",
                desc: "When both parties express interest, unlock secure messaging to explore the opportunity and build a relationship.",
              },
            ].map((step, i) => (
              <Card key={i} className="text-center p-6">
                <CardContent className="pt-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl tracking-wide mb-3">{step.title.toUpperCase()}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-4xl sm:text-5xl tracking-wide mb-6" data-testid="text-for-sellers">FOR SELLERS</h2>
              <p className="text-lg mb-4 text-muted-foreground">
                The place where you find vetted buyers who will continue your legacy.
              </p>
              <p className="text-muted-foreground mb-6">
                Make a difference with your exit, not just after it. Our platform ensures your business transitions to someone who shares your vision and values.
              </p>
              <Button onClick={() => navigate("/register")} data-testid="button-seller-cta">
                List Your Business <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <img
                src="/images/about-office.png"
                alt="Modern office"
                className="rounded-md grayscale w-full"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <img
                src="/images/city-skyline.png"
                alt="City skyline"
                className="rounded-md grayscale w-full"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-tl from-primary/20 to-transparent" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-heading text-4xl sm:text-5xl tracking-wide mb-6" data-testid="text-for-buyers">FOR BUYERS</h2>
              <p className="text-lg mb-4 text-muted-foreground">
                The place where you find business sellers that care about how their business transitions to the next generation.
              </p>
              <p className="text-muted-foreground mb-6">
                Find purpose in your work every day. Acquire a business from someone who values the same things you do.
              </p>
              <Button onClick={() => navigate("/register")} data-testid="button-buyer-cta">
                Find a Business <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl tracking-wide mb-4">PRIVACY FIRST</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Your business details remain anonymous until you choose to reveal them. Match first, then decide when and what to share.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Anonymous Profiles", desc: "No business name shown until you're ready" },
              { label: "Mutual Matching", desc: "Both parties must express interest" },
              { label: "Secure Messaging", desc: "Communicate safely within the platform" },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <div className="w-2 h-2 rounded-full bg-primary mx-auto mb-3" />
                <h4 className="font-heading text-xl tracking-wide mb-2">{item.label.toUpperCase()}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#1E1E1E]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl sm:text-6xl text-white tracking-wider mb-6">
            READY TO FIND YOUR MATCH?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Join a community of values-driven business leaders making meaningful transitions.
          </p>
          <Button size="lg" onClick={() => navigate("/register")} className="text-base px-10" data-testid="button-footer-cta">
            Get Started Today <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      <footer className="bg-[#1E1E1E] border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl text-primary">V+V</span>
            <span className="text-sm text-white/50">Vision + Values Marketplace</span>
          </div>
          <p className="text-xs text-white/40">2026 Vision + Values. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
