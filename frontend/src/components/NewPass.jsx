import React, { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const NewPass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const { verificationCode } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  const [successMessage, setSuccessMessage] = useState("");

  const submitPassChange = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hashed_password: password }),
    };

    try {

      //CHANGE 'register' TO PROPER DIRECTORY PLS

      const response = await fetch("/api/register", requestOptions);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.detail);
      } else {
        setSuccessMessage("Password changed successfully.");
        setErrorMessage("");
        navigate("/");
      }
    } catch (error) {
      setErrorMessage("An error occurred while changing password.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword && password.length > 5) {
      submitPassChange();
    } else {
      if (password.length <= 5) {
        setErrorMessage("Password must be at least 6 characters long");
      } else {
        setErrorMessage("Password and confirmation password do not match");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Change Password</h1>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Confirm Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              autoComplete="new-password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <ErrorMessage message={errorMessage} color="red" />
        {successMessage && (
          <div className="notification is-primary">{successMessage}</div>
        )}
        <br />
        <button className="button is-primary" type="submit">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default NewPass;