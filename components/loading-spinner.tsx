import { cn } from "@/lib/utils";

import { IconProps, Icons } from "@/components/icons";

function LoadingSpinner({ className, ...props }: IconProps) {
  return (
    <Icons.loader2
      className={cn("h-4 w-4 animate-spin", className)}
      {...props}
    />
  );
}
LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
