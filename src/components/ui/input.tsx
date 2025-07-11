import { type ComponentProps } from "react";
import { cn } from "../../utils";

export default function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input 
      className={cn(
        "border-1 border-gray-300 max-w-full rounded-lg p-1  focus:border-1",
        className                         
      )}
      {...props} 
    />
  )
}