import { Leaf, Recycle } from "lucide-react";
import heroImage from "@/assets/hero-ewaste.jpg";
import { ThemeToggle } from "./ThemeToggle";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute top-6 right-6 z-20 animate-fade-in">
        <ThemeToggle />
      </div>
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background z-0" />
      
      <div className="container mx-auto px-4 z-10 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-glow">
            <Recycle className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="p-3 rounded-2xl bg-gradient-to-br from-secondary to-primary shadow-glow">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          Smart E-Waste Classification
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          AI-powered identification and sorting of electronic waste. Upload an image and get instant guidance on proper recycling and disposal.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>Instant AI Classification</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span>Eco-Friendly Guidance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>Reduce Environmental Impact</span>
          </div>
        </div>
      </div>
    </section>
  );
};
