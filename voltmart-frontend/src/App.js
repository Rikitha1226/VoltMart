import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider, RequireAuth } from "./context/AuthContext";
import AppLayout from "./components/Layout/AppLayout";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Billing from "./pages/Billing.jsx";
import Orders from "./pages/Orders.jsx";
import ProductManagement from "./pages/ProductManagement.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <RequireAuth allowedRoles={["ADMIN"]}>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route
            path="/cashier"
            element={
              <RequireAuth allowedRoles={["CASHIER", "ADMIN"]}>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="billing" element={<Billing />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;