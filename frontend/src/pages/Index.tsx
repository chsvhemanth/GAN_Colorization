import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageComparison } from "@/components/ImageComparison";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [colorizedImageUrl, setColorizedImageUrl] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setOriginalImageUrl(null);
    setColorizedImageUrl(null);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setOriginalImageUrl(null);
    setColorizedImageUrl(null);
  };

  const handleColorize = async () => {
  if (!selectedImage) {
    toast.error("Please upload an image first");
    return;
  }

  setIsProcessing(true);
  const originalUrl = URL.createObjectURL(selectedImage);
  setOriginalImageUrl(originalUrl);

  try {
    const form = new FormData();
    form.append("file", selectedImage);

    // ✅ Use your Flask backend URL explicitly
    const resp = await fetch("http://127.0.0.1:5000/api/colorize", {
      method: "POST",
      body: form,
      headers: {
        Accept: "application/json",
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Failed to colorize image");
    }

    const data = await resp.json();
    if (data.error) throw new Error(data.error);

    setColorizedImageUrl(data.result_image);
    toast.success("Image colorized successfully!");
  } catch (err: any) {
    console.error("Colorize error", err);
    toast.error(err.message || "Colorization failed");
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              AI Image Colorizer
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Upload Section */}
          {!originalImageUrl && !isProcessing && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">
                  Transform Your Grayscale Images
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Upload a grayscale image and let AI bring it to life with vibrant colors
                </p>
              </div>

              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClear={handleClear}
              />

              {selectedImage && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleColorize}
                    disabled={isProcessing}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Colorize Image
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Loading Animation */}
          {isProcessing && (
            <div className="mx-auto max-w-2xl">
              <LoadingAnimation />
            </div>
          )}

          {/* Results Section */}
          {originalImageUrl && colorizedImageUrl && (
            <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">
                  Your Colorized Image
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Compare the original and AI-enhanced version
                </p>
              </div>

              <ImageComparison
                originalImage={originalImageUrl}
                colorizedImage={colorizedImageUrl}
              />

              <div className="flex justify-center">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="lg"
                  className="font-semibold"
                >
                  Colorize Another Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Powered by Conditional GANs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
