import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";

const NewPass = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const { resetCode } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitPassChange = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetCode, password: password }),
    };

    try {
      const response = await fetch("/api/resetpassword", requestOptions);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.detail);
      }
      else {
        setSuccessMessage("Password changed successfully.");
        setErrorMessage("");
        navigate("/");
      }
    }
    catch (error) {
      setErrorMessage("An error occurred while changing password.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword && password.length > 5) {
      submitPassChange();
    }
    else {
      if (password.length <= 5) {
        setErrorMessage("Password must be at least 6 characters long");
      }
      else {
        setErrorMessage("Password and confirmation password do not match");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="col">
      <form className="card p-4" onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 text-center">Change Password</h1>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
            value={confirmationPassword}
            onChange={(e) => setConfirmationPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <ErrorMessage message={errorMessage} color="red" />
        {successMessage && (
          <div className="alert alert-primary" role="alert">{successMessage}</div>
        )}
        <br />
        <button className="btn btn-primary" type="submit">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default NewPass;
