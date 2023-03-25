import React, { useState } from "react";

import ErrorMessage from "./ErrorMessage";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitRegistration = async () => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, name: name, hashed_password: password }),
  };

  const response = await fetch("/api/register", requestOptions);
  const data = await response.json();

  if (response.ok) {
    setSuccessMessage("Please check your email for verification link.");
    setErrorMessage("");
  } else {
    setErrorMessage(data.detail);
    setSuccessMessage("");
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword && password.length > 5) {
      submitRegistration();
    } else {
      if (password.length <= 5) {
        setErrorMessage("Password must be at least 6 characters long");
        setSuccessMessage("");
      } else {
        setErrorMessage("Password and confirmation password do not match");
        setSuccessMessage("");
      }
    }
  };


  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Register</h1>
        <div className="field">
          <label className="label">Email Address</label>
          <div className="control">
            <input
              type="email"
              placeholder="Enter email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">First Name</label>
          <div className="control">
            <input
              type="text"
              placeholder="Enter name"
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
