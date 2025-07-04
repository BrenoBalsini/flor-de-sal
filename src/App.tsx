import { HashRouter, Route, Routes } from "react-router-dom";
import LayoutMain from "./pages/layout-main";
import PageHome from "./pages/page-home";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<LayoutMain/>}>
          <Route index element={<PageHome/>}/>
        </Route>
      </Routes>

    </HashRouter>
  );
}
