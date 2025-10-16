import { Leaf, Recycle, Sparkles, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-ewaste.jpg";
import { ThemeToggle } from "./ThemeToggle";

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute top-6 right-6 z-20 animate-fade-in">
        <ThemeToggle />
      </div>
      <div 
        className="absolute inset-0 z-0 opacity-20 transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background z-0" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        {/* Icons */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-bounce-in">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-glow glow-effect-hover transform transition-transform hover:scale-110">
            <Recycle className="w-10 h-10 text-primary-foreground animate-pulse" />
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary to-primary shadow-glow glow-effect-hover transform transition-transform hover:scale-110">
            <Leaf className="w-10 h-10 text-primary-foreground animate-pulse" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-slide-up">
          Smart E-Waste Classification
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in">
          AI-powered identification and sorting of electronic waste. Get instant guidance on proper recycling and make a real environmental impact.
        </p>
        
        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm md:text-base animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all hover:scale-105">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium">Instant AI Classification</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-all hover:scale-105">
            <Leaf className="w-4 h-4 text-secondary" />
            <span className="font-medium">Eco-Friendly Guidance</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all hover:scale-105">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="font-medium">Track Your Impact</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16 animate-fade-in">
          <div className="p-4 rounded-xl bg-gradient-card border hover:shadow-lg transition-all">
            <p className="text-3xl md:text-4xl font-bold text-primary mb-1">53.6M</p>
            <p className="text-xs md:text-sm text-muted-foreground">Tons E-Waste/Year</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-card border hover:shadow-lg transition-all">
            <p className="text-3xl md:text-4xl font-bold text-secondary mb-1">98%</p>
            <p className="text-xs md:text-sm text-muted-foreground">Recyclable Materials</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-card border hover:shadow-lg transition-all">
            <p className="text-3xl md:text-4xl font-bold text-accent mb-1">$57B</p>
            <p className="text-xs md:text-sm text-muted-foreground">Lost Value/Year</p>
          </div>
        </div>
      </div>
    </section>
  );
};
