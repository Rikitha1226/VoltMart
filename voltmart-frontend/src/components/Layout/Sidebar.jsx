import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Inventory" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/profile", label: "Profile" },
];

const cashierLinks = [
  { to: "/cashier/billing", label: "Billing" },
  { to: "/cashier/orders", label: "Orders" },
  { to: "/cashier/profile", label: "Profile" },
];

function Sidebar() {
  const { role, logout } = useAuth();

  const links = role === "ADMIN" ? adminLinks : cashierLinks;

  return (
    <aside className="vm-sidebar">
      <div className="vm-sidebar__brand">
        <span className="vm-sidebar__logo">⚡</span>
        <span className="vm-sidebar__title">VoltMart</span>
      </div>

      <nav className="vm-sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              "vm-sidebar__link" + (isActive ? " vm-sidebar__link--active" : "")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button className="vm-sidebar__logout" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;

