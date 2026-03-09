import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";

function VerifyOTP() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVerify = async () => {

        setError("");
        setSuccess("");

        if (!otp) {
            setError("Please enter the OTP");
            return;
        }

        try {

            const response = await API.post("/auth/verify-otp", {
                email: email,
                otp: otp
            });

            setSuccess("Email verified successfully. Redirecting to login...");

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err) {

            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Invalid OTP. Please try again.");
            }

        }

    };

    return (

        <div className="auth-container">

            <h2>Email Verification</h2>

            <p>OTP sent to <b>{email}</b></p>

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            {success && (
                <p style={{ color: "green" }}>{success}</p>
            )}

            <input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
            />

            <button onClick={handleVerify}>
                Verify OTP
            </button>

        </div>

    );

}

export default VerifyOTP;