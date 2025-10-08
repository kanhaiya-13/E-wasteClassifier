import { Upload, Image as ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onImageSelect: (imageData: string) => void;
  isProcessing: boolean;
}

export const UploadZone = ({ onImageSelect, isProcessing }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
        ${isDragging 
          ? 'border-primary bg-primary/5 scale-105' 
          : 'border-border hover:border-primary/50 hover:bg-primary/5'
        }
        ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className={`
          p-6 rounded-full bg-gradient-to-br from-primary to-secondary transition-transform duration-300
          ${isDragging ? 'scale-110' : ''}
        `}>
          {isDragging ? (
            <ImageIcon className="w-12 h-12 text-primary-foreground" />
          ) : (
            <Upload className="w-12 h-12 text-primary-foreground" />
          )}
        </div>
        
        <div>
          <h3 className="text-2xl font-semibold mb-2">
            {isDragging ? "Drop your image here" : "Upload E-Waste Image"}
          </h3>
          <p className="text-muted-foreground">
            Drag and drop or click to select an image
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Supports JPG, PNG • Max 10MB
          </p>
        </div>
      </div>
    </div>
  );
};
