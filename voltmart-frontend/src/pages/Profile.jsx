import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import { usersApi } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, role, login, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
  });

  const [targetUserId, setTargetUserId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError("");
    setMessage("");

    if (form.password && form.password !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...user,
        username: form.username,
        phone: form.phone,
        // If no new password provided, keep existing one.
        password: form.password ? form.password : user.password,
      };

      const response = await usersApi.updateProfile(user.id, payload);

      login(response.data || response); // refresh auth context with updated user
      setMessage("Profile updated successfully.");
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSelf = async () => {
    const confirmed = window.confirm(
      "This will delete your account permanently. Continue?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await usersApi.delete(user.id);
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      setError("Failed to delete your account.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAdminDeleteUser = async () => {
    if (!targetUserId) {
      setError("Enter a user ID to delete.");
      return;
    }

    const confirmed = window.confirm(
      `Delete user with ID ${targetUserId}?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setMessage("");
      await usersApi.delete(targetUserId);
      setMessage(`User ${targetUserId} deleted.`);
      setTargetUserId("");
    } catch (err) {
      setError("Failed to delete specified user.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="vm-page">
      <div className="vm-page__header">
        <h1>Profile</h1>
        <p>Update your account details.</p>
      </div>

      {error && <div className="vm-alert vm-alert--error">{error}</div>}
      {message && (
        <div className="vm-alert" style={{ background: "#ecfdf5", color: "#166534" }}>
          {message}
        </div>
      )}

      <div className="vm-page__grid">
        <Card title="Your details">
          <div className="vm-form-grid">
            <label className="vm-form-grid__field">
              <span>Username</span>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </label>

            <label className="vm-form-grid__field">
              <span>Phone</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </label>

            <label className="vm-form-grid__field">
              <span>New password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </label>

            <label className="vm-form-grid__field">
              <span>Confirm new password</span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </label>
          </div>

          <div style={{ marginTop: "0.9rem" }}>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </Card>

        <Card title="Danger zone">
          <p style={{ fontSize: "0.9rem", marginBottom: "0.7rem" }}>
            Deleting your own account will log you out immediately.
          </p>
          <Button
            variant="danger"
            onClick={handleDeleteSelf}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete my account"}
          </Button>

          {role === "ADMIN" && (
            <div style={{ marginTop: "1.2rem" }}>
              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.4rem" }}>
                Delete another user (cashier)
              </h3>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                Enter the user ID you want to remove.
              </p>
              <div className="vm-toolbar__group">
                <input
                  className="vm-input"
                  placeholder="User ID"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                />
                <Button
                  variant="danger"
                  onClick={handleAdminDeleteUser}
                  disabled={deleting}
                >
                  Delete user
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Profile;

