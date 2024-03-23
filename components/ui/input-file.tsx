import * as React from "react";

import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InputFileProps extends Omit<InputProps, "type"> {}

const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input ref={ref} id="picture" type="file" {...props} />
      </div>
    );
  },
);
InputFile.displayName = "InputFile";

export { InputFile };
