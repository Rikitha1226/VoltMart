import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="vm-navbar">
      <div className="vm-navbar__left">
        <h1 className="vm-navbar__title">VoltMart Control Center</h1>
      </div>

      <div className="vm-navbar__right">
        {user && (
          <div className="vm-navbar__user">
            <span className="vm-navbar__avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </span>
            <div className="vm-navbar__meta">
              <span className="vm-navbar__name">{user.username || "User"}</span>
              <span className="vm-navbar__role">
                {user.role === "ADMIN" ? "Admin" : "Cashier"}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
