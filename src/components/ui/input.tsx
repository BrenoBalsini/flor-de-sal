import { type ComponentProps } from "react";

export default function Input(props: ComponentProps<'input'>) {
  return (
    <input 
      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm transition-colors focus:border-rose-light focus:ring focus:ring-rose-light focus:ring-opacity-50"
      {...props}
    />
  )
}