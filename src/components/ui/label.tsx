import { type ComponentProps } from "react";

export default function Label(props: ComponentProps<'label'>) {
  return (
    <label 
      className="block text-sm font-medium text-gray-400"
      {...props} 
    />
  )
}