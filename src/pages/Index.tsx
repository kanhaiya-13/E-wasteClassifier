import { useState } from "react";
import { Hero } from "@/components/Hero";
import { UploadZone } from "@/components/UploadZone";
import { ClassificationResult } from "@/components/ClassificationResult";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [classification, setClassification] = useState<any>(null);
  const { toast } = useToast();

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
      <Hero />
      
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {!selectedImage && !classification && (
            <UploadZone onImageSelect={handleImageSelect} isProcessing={isProcessing} />
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
      </section>

      <section className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Why Proper E-Waste Disposal Matters</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl bg-gradient-card border">
              <h3 className="font-semibold text-lg mb-2">Environmental Protection</h3>
              <p className="text-muted-foreground text-sm">
                Prevents toxic materials from polluting soil and water sources
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-card border">
              <h3 className="font-semibold text-lg mb-2">Resource Recovery</h3>
              <p className="text-muted-foreground text-sm">
                Recovers valuable materials like gold, silver, and rare earth metals
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-card border">
              <h3 className="font-semibold text-lg mb-2">Reduce Waste</h3>
              <p className="text-muted-foreground text-sm">
                Minimizes landfill waste and promotes circular economy practices
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
