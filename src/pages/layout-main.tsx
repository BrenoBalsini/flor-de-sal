import { Outlet } from "react-router-dom";
import MainContent from "../core-componets/main-content";

export default function LayoutMain() {
  return (
    <>
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
}
