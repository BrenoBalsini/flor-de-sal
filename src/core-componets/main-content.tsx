import React from "react";
// import cx from "class-variance-authority"

export default function MainContent({children}: React.ComponentProps<"main">) {
  return (
    <main className="text-black">
      {children}
    </main>
  )
}