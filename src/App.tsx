import { HashRouter, Route, Routes } from "react-router-dom";
import LayoutMain from "./pages/layout-main";
import PageHome from "./pages/page-home";
import PageMaterials from "./pages/page-materials";
import PageSettings from "./pages/page-settings"

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<LayoutMain/>}>
          <Route index element={<PageHome />}/>
          <Route path="/materiais" element={<PageMaterials />}/>
          <Route path="/configuracoes" element={<PageSettings />}/>
        </Route>
      </Routes>

    </HashRouter>
  );
}
