import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitReset = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    };

    const response = await fetch("/api/resetrequest", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setSuccessMessage("");
      setErrorMessage("An error has occurred.");
    } else {
      setSuccessMessage("Please check your email for reset link.");
      setErrorMessage("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    submitReset();

    };


  return (
     <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Forgot Password</h1>
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
       <ErrorMessage message={errorMessage} color="red" />
        {successMessage && (
          <div className="notification is-primary">{successMessage}</div>
        )}
        <br />
        <button className="button is-primary" type="submit">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;