import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/api";

function Register() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CASHIER"
  });

  const [otp, setOtp] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const extractError = (err) => {
    if (err.response?.data?.message) return err.response.data.message;
    if (typeof err.response?.data === "string") return err.response.data;
    return "Something went wrong";
  };

  // REGISTER USER
  const handleRegisterSubmit = async (event) => {

    event.preventDefault();
    setError("");
    setSuccessMsg("");

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
        role: form.role
      });

      setSuccessMsg("Verify your email with the OTP sent.");
      setStep(2);

    } catch (err) {

      setError(extractError(err));

    } finally {
      setSubmitting(false);
    }

  };

  // VERIFY OTP
  const handleOtpSubmit = async (event) => {

    event.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {

      setSubmitting(true);

      await authApi.verifyOtp({
        email: form.email,
        otp: otp
      });

      setSuccessMsg("Registration Successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {

      setError(extractError(err));

    } finally {
      setSubmitting(false);
    }

  };

  return (
    <div className="vm-auth">
      <div className="vm-auth__card">

        <h1 className="vm-auth__title">Create VoltMart Account</h1>

        <p className="vm-auth__subtitle">
          {step === 1
            ? "Onboard new admins or cashiers in seconds."
            : "Enter the OTP sent to your email"}
        </p>

        {error && <div className="vm-auth__error">{error}</div>}

        {successMsg && (
          <div
            className="vm-auth__success"
            style={{ color: "green", marginBottom: "15px" }}
          >
            {successMsg}
          </div>
        )}

        {step === 1 ? (

          <form className="vm-auth__form" onSubmit={handleRegisterSubmit}>

            <label className="vm-auth__field">
              <span>Username</span>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="jane.doe"
                required
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
                required
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
                required
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
                required
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

        ) : (

          <form className="vm-auth__form" onSubmit={handleOtpSubmit}>

            <label className="vm-auth__field">
              <span>Verification OTP</span>
              <input
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
              />
            </label>

            <button
              className="vm-btn vm-btn--primary vm-auth__submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Verifying..." : "Verify Email"}
            </button>

          </form>

        )}

        <button
          type="button"
          className="vm-auth__link"
          onClick={() => navigate("/")}
        >
          {step === 1
            ? "Already have an account? Login"
            : "Back to Login"}
        </button>

      </div>
    </div>
  );
}

export default Register;