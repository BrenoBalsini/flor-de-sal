import { Outlet } from "react-router-dom";
import NavBar from "../components/core-components/nav-bar";
import Logo from "../components/ui/logo";

export default function LayoutMain() {
  return (
    <div className="h-screen bg-gray-100 font-sans grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] pr-4">
      <div></div>

      <header className="p-4">
        <Logo />
      </header>

      <NavBar />

      <main className="bg-white p-8 overflow-y-auto rounded-lg">
        <Outlet />
      </main>
    </div>
  );
}
