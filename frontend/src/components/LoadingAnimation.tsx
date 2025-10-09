import { Loader2, Sparkles } from "lucide-react";

export const LoadingAnimation = () => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 animate-in fade-in-0 zoom-in-95 duration-500">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-xl animate-pulse" />
        
        {/* Middle ring */}
        <div className="relative rounded-full bg-gradient-to-br from-primary/30 to-accent/30 p-8">
          <div className="rounded-full bg-card p-6">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>
        
        {/* Spinning loader */}
        <Loader2 className="absolute -right-2 -top-2 h-16 w-16 animate-spin text-primary/40" />
      </div>
      
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold text-foreground">
          Colorizing Your Image
        </h3>
        <p className="text-sm text-muted-foreground">
          AI is analyzing and adding colors...
        </p>
      </div>
      
      {/* Progress dots */}
      <div className="flex gap-2">
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
};
