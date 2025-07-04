import { Outlet } from "react-router-dom";
import NavBar from "../components/core-components/nav-bar";
import Logo from "../components/ui/logo";

export default function LayoutMain() {
  return (
    <div className="h-screen bg-gray-100 font-sans grid grid-rows-[auto_1fr] grid-cols-[auto_1fr]">
      
      {/* Linha 1, Coluna 1: O espaço em branco que você queria. Não colocamos nada aqui! */}
      <div></div>

      {/* Linha 1, Coluna 2: O Header. Ele não precisa mais do col-span-2. */}
      <header className="p-4">
        <Logo />
      </header>

      {/* Linha 2, Coluna 1: A Navbar. */}
      <NavBar />

      {/* Linha 2, Coluna 2: O Conteúdo Principal. */}
      <main className="p-8 overflow-y-auto">
        <Outlet />
      </main>
      
    </div>
  );
}
