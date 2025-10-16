import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  MapPin, 
  TrendingUp, 
  BookOpen, 
  CheckCircle2,
  X,
  ArrowRight 
} from "lucide-react";

interface QuickStartGuideProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Upload,
    title: "Classify Your E-Waste",
    description: "Upload a photo of your electronic waste to get instant AI-powered identification and recycling guidance.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: MapPin,
    title: "Find Recycling Centers",
    description: "Locate certified e-waste collection centers near you with ratings, contact info, and directions.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: TrendingUp,
    title: "Track Your Impact",
    description: "Monitor your environmental contribution with CO₂ saved, energy conserved, and unlock achievements.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BookOpen,
    title: "Learn & Educate",
    description: "Explore our education hub to understand e-waste types, hazards, and best recycling practices.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export const QuickStartGuide = ({ open, onClose }: QuickStartGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Welcome to Smart E-Sort! 🌱</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            Let's take a quick tour of what you can do
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicators */}
          <div className="flex gap-2 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Current Step */}
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div
                className={`p-6 rounded-2xl ${steps[currentStep].bgColor} transition-all`}
              >
                {(() => {
                  const Icon = steps[currentStep].icon;
                  return <Icon className={`w-12 h-12 ${steps[currentStep].color}`} />;
                })()}
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="mb-2">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <h3 className="text-2xl font-bold">{steps[currentStep].title}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {steps[currentStep].description}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <Button onClick={onClose} variant="ghost">
              Skip Tour
            </Button>

            <Button onClick={handleNext} className="gap-2">
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

