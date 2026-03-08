import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await authApi.login({
        username,
        password,
      });

      const user = response.data;
      if (user && !user.password) user.password = password;
      login(user);

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/cashier/billing", { replace: true });
      }
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vm-auth">
      <div className="vm-auth__card">
        <h1 className="vm-auth__title">VoltMart</h1>
        <p className="vm-auth__subtitle">
          Sign in to manage your store and billing.
        </p>

        {error && <div className="vm-auth__error">{error}</div>}

        <form className="vm-auth__form" onSubmit={handleSubmit}>
          <label className="vm-auth__field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
            />
          </label>

          <label className="vm-auth__field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </label>

          <button
            className="vm-btn vm-btn--primary vm-auth__submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <button
          type="button"
          className="vm-auth__link"
          onClick={() => navigate("/register")}
        >
          Don&apos;t have an account? Register
        </button>
      </div>
    </div>
  );
}

export default Login;

