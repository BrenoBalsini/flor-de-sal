import { Outlet } from "react-router-dom";
import NavBar from "../components/core-components/nav-bar"; 

export default function LayoutMain() {
  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <NavBar />
      <main className="flex-1 overflow-y-auto p-8 bg-white">
        <Outlet />
      </main>
    </div>
  );
}