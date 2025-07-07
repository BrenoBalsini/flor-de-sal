import { HashRouter, Route, Routes } from "react-router-dom";
import LayoutMain from "./pages/layout-main";
import PageHome from "./pages/page-home";
import PageMaterials from "./pages/page-materials";
import PageSettings from "./pages/page-settings"
import PageHistory from "./pages/page-history";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<LayoutMain/>}>
          <Route index element={<PageHome />}/>
          <Route path="/materiais" element={<PageMaterials />}/>
          <Route path="/configuracoes" element={<PageSettings />}/>
          <Route path= "/historico" element={<PageHistory />} />
        </Route>
      </Routes>

    </HashRouter>
  );
}
