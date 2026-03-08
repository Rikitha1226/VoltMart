import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CASHIER",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await authApi.register({
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });

      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vm-auth">
      <div className="vm-auth__card">
        <h1 className="vm-auth__title">Create VoltMart Account</h1>
        <p className="vm-auth__subtitle">
          Onboard new admins or cashiers in seconds.
        </p>

        {error && <div className="vm-auth__error">{error}</div>}

        <form className="vm-auth__form" onSubmit={handleSubmit}>
          <label className="vm-auth__field">
            <span>Username</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="jane.doe"
            />
          </label>

          <label className="vm-auth__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label className="vm-auth__field">
            <span>Phone</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Customer phone"
            />
          </label>

          <label className="vm-auth__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </label>

          <label className="vm-auth__field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
            />
          </label>

          <label className="vm-auth__field">
            <span>Role</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="CASHIER">Cashier</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>

          <button
            className="vm-btn vm-btn--primary vm-auth__submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <button
          type="button"
          className="vm-auth__link"
          onClick={() => navigate("/")}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Register;

