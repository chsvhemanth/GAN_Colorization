interface ImageComparisonProps {
  originalImage: string;
  colorizedImage: string;
}

export const ImageComparison = ({ originalImage, colorizedImage }: ImageComparisonProps) => {
  return (
    <div className="w-full">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl bg-card" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <img
              src={originalImage}
              alt="Original grayscale"
              className="h-auto w-full object-cover"
            />
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground">
            Original
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl bg-card" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <img
              src={colorizedImage}
              alt="Colorized"
              className="h-auto w-full object-cover"
            />
          </div>
          <p className="text-center text-sm font-medium text-primary">
            Colorized
          </p>
        </div>
      </div>
    </div>
  );
};
