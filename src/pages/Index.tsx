import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { UploadZone } from "@/components/UploadZone";
import { ClassificationResult } from "@/components/ClassificationResult";
import { RecyclingCenterFinder } from "@/components/RecyclingCenterFinder";
import { ImpactTracker } from "@/components/ImpactTracker";
import { EducationSection } from "@/components/EducationSection";
import { Footer } from "@/components/Footer";
import { QuickStartGuide } from "@/components/QuickStartGuide";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RotateCcw, Upload, MapPin, TrendingUp, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [classification, setClassification] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has seen the guide before
    const hasSeenGuide = localStorage.getItem("hasSeenQuickStartGuide");
    if (!hasSeenGuide) {
      // Show guide after a short delay for better UX
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hasSeenQuickStartGuide", "true");
  };

  const handleImageSelect = async (imageData: string) => {
    setSelectedImage(imageData);
    setClassification(null);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('classify-ewaste', {
        body: { image: imageData }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setClassification(data.classification);
      toast({
        title: "Classification Complete",
        description: `Identified as ${data.classification.category} with ${Math.round(data.classification.confidence)}% confidence`,
      });
    } catch (error: any) {
      console.error('Classification error:', error);
      toast({
        title: "Classification Failed",
        description: error.message || "Failed to classify the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setClassification(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <QuickStartGuide open={showGuide} onClose={handleCloseGuide} />
      <Hero />
      
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="classify" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 h-auto p-1">
            <TabsTrigger value="classify" className="flex items-center gap-2 py-3">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Classify</span>
            </TabsTrigger>
            <TabsTrigger value="centers" className="flex items-center gap-2 py-3">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Find Centers</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2 py-3">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">My Impact</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2 py-3">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classify" className="mt-0">
            <div className="max-w-4xl mx-auto">
              {!selectedImage && !classification && (
                <div className="space-y-6">
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold">Classify Your E-Waste</h2>
                    <p className="text-muted-foreground">
                      Upload an image to get instant AI-powered identification and recycling guidance
                    </p>
                  </div>
                  <UploadZone onImageSelect={handleImageSelect} isProcessing={isProcessing} />
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-fade-in">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  <p className="text-xl font-semibold">Analyzing E-Waste...</p>
                  <p className="text-muted-foreground">Our AI is identifying the materials and components</p>
                </div>
              )}

              {classification && selectedImage && (
                <div className="space-y-6">
                  <ClassificationResult 
                    classification={classification}
                    image={selectedImage}
                  />
                  <div className="flex justify-center">
                    <Button
                      onClick={handleReset}
                      size="lg"
                      className="gap-2"
                      variant="outline"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Classify Another Item
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="centers" className="mt-0">
            <div className="max-w-5xl mx-auto">
              <RecyclingCenterFinder />
            </div>
          </TabsContent>

          <TabsContent value="impact" className="mt-0">
            <div className="max-w-5xl mx-auto">
              <ImpactTracker />
            </div>
          </TabsContent>

          <TabsContent value="learn" className="mt-0">
            <div className="max-w-6xl mx-auto">
              <EducationSection />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="container mx-auto px-4 py-16 border-t bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Why Proper E-Waste Disposal Matters</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl bg-gradient-card border hover:shadow-lg transition-all duration-300 hover:scale-105">
              <h3 className="font-semibold text-lg mb-2">Environmental Protection</h3>
              <p className="text-muted-foreground text-sm">
                Prevents toxic materials from polluting soil and water sources
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-card border hover:shadow-lg transition-all duration-300 hover:scale-105">
              <h3 className="font-semibold text-lg mb-2">Resource Recovery</h3>
              <p className="text-muted-foreground text-sm">
                Recovers valuable materials like gold, silver, and rare earth metals
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-card border hover:shadow-lg transition-all duration-300 hover:scale-105">
              <h3 className="font-semibold text-lg mb-2">Reduce Waste</h3>
              <p className="text-muted-foreground text-sm">
                Minimizes landfill waste and promotes circular economy practices
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
