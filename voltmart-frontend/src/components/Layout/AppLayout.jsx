import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout() {
  return (
    <div className="vm-layout">
      <Sidebar />
      <div className="vm-layout__main">
        <Navbar />
        <main className="vm-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
