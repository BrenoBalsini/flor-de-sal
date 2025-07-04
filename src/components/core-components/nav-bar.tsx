import { NavLink } from "react-router-dom";
import {
  Calculator,
  Cog,
  History,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

type NavLinkData = {
  path: string;
  name: string;
  icon: LucideIcon;
};

const navLinks: NavLinkData[] = [
  { path: "/", name: "Calcular", icon: Calculator },
  { path: "/materiais", name: "Materiais", icon: ClipboardList },
  { path: "/historico", name: "Histórico", icon: History },
  { path: "/configuracoes", name: "Ajustes", icon: Cog },
];

export default function NavBar() {
  return (
    <nav className="flex flex-col items-center justify-center gap-4 p-4">
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          title={link.name}
          className={({ isActive }) =>
            `w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200
            ${ isActive
                ? "bg-rose-base text-white shadow-md" 
                : "text-gray-400 hover:bg-rose-light"
            }`
          }
        >
          <link.icon size={28} />
          <span className="text-xs font-medium mt-1">{link.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}