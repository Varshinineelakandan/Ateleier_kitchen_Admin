import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Tables from "./pages/Tables";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import Staffs from "./pages/Staffs";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar/>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/staff" element={<Staffs/>} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;