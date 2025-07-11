import { Link } from "react-router-dom";
import Logo from "../components/ui/logo.png";

export default function PageHero() {
  return (
    <section className="w-full py-16 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
              Precifique com precisão
            </h1>
            <p className="max-w-[600px] text-gray-600 md:text-xl mx-auto lg:mx-0">
              Essa ferramenta descomplica o cálculo de preços. Cadastre seus materiais, defina suas margens e deixe que a gente faça a matemática para você.
            </p>
            <div className="mt-6">
              <Link
                to="/materiais"
                className="inline-flex h-12 items-center justify-center rounded-md bg-brand px-8 text-sm font-medium text-white shadow transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Começar a Cadastrar
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={Logo}
              alt="Logo da Empresa"
              className="w-50 h-50 md:w-70 md:h-70 lg:w-90 lg:h-90 object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}