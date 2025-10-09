import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export const ImageUpload = ({ onImageSelect, selectedImage, onClear }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      onImageSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {!selectedImage ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center
            transition-all duration-300
            ${isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
            }
          `}
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-6">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                Drop your grayscale image here
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                or click to browse • PNG or JPG
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl bg-card p-4" style={{ boxShadow: "var(--shadow-soft)" }}>
          <button
            onClick={onClear}
            className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground shadow-lg transition-transform hover:scale-110"
          >
            <X className="h-4 w-4" />
          </button>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-full rounded-lg"
          />
          <p className="mt-3 text-center text-sm text-muted-foreground">
            {selectedImage.name}
          </p>
        </div>
      )}
    </div>
  );
};
