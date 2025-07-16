import { NavLink, Link } from "react-router-dom";
import Logo from "../ui/logo.png";
import {
  Cog,
  Calculator,
  History,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import Label from "../ui/label";
import Input from "../ui/input";
import useLocalStorageState from "use-local-storage-state";
import { initialSettings } from "../../pages/page-settings";
import type { ChangeEvent } from "react";
import type { SettingsData } from "../../types";

type NavLinkData = {
  path: string;
  name: string;
  icon: LucideIcon;
};

const navLinks: NavLinkData[] = [
  { path: "/calculadora", name: "Calculadora", icon: Calculator },
  { path: "/materiais", name: "Materiais", icon: ClipboardList },
  { path: "/historico", name: "Histórico", icon: History },
];

export default function NavBar() {
  const [settings, setSettings] = useLocalStorageState<SettingsData>(
    "app-settings",
    {
      defaultValue: initialSettings,
    }
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    if (name === "hourlyRate") {
      value = value.replace(/[^0-9,]/g, "");
      const parts = value.split(",");
      if (parts[1]) {
        parts[1] = parts[1].substring(0, 2);
      }
      value = parts.slice(0, 2).join(",");
    }

    if (name === "dailyHours" || name === "profitMargin") {
      value = value.replace(/[^0-9]/g, "");
    }

    setSettings((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (
    <>
      <aside className="hidden h-screen w-50 flex-col p-3 bg-gray-100 md:flex">
        <div className="flex flex-col">
          <Link to="/" title="Ir para a página inicial">
            <img
              src={Logo}
              alt="logo"
              className="h-26 justify-self-center my-5"
            />
          </Link>

          <nav className="w-full">
            <ul className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex flex-1 items-center gap-3 rounded-md px-2 py-1 text-sm font-medium transition-colors 
                  ${isActive ? "bg-brand-light" : "hover:bg-brand-light"}`
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-auto">
          <div className="flex gap-2 py-1 items-center">
            <Cog className="h-4 w-4"></Cog>
            <Label>Ajustes</Label>
          </div>

          <form className="space-y-2">
            <div>
              <Label htmlFor="hourlyRate" className="text-xs">
                Preço da hora trabalhada (R$)
              </Label>
              <Input
                id="hourlyRate"
                type="text"
                inputMode="decimal"
                name="hourlyRate"
                value={settings.hourlyRate}
                onChange={handleChange}
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="profitMargin" className="text-xs">
                Margem de lucro (%)
              </Label>
              <Input
                id="profitMargin"
                type="text"
                inputMode="numeric"
                name="profitMargin"
                value={settings.profitMargin}
                onChange={handleChange}
                className="text-sm"
              />
            </div>
          </form>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-gray-100 p-2 md:hidden">
        <ul className="flex items-center justify-around">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors
                  ${isActive ? "text-brand-dark" : "text-gray-500 hover:bg-brand-light"}`
                }
              >
                <link.icon className="h-5 w-5" />
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/ajustes"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors
                  ${isActive ? "text-brand-dark" : "text-gray-500 hover:bg-brand-light"}`
              }
            >
              <Cog className="h-5 w-5" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
