/**
 * @file ForgotPassword.jsx
 * @brief Component that allows users to request a password reset link.
 */

import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage-BS";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import { FloatingLabel } from "react-bootstrap";

/**
 * ForgotPassword Component
 *
 * Provides a form through which users can enter their email to request a password reset link.
 * Displays messages based on the result of the password reset request.
 *
 * @returns {JSX.Element} Rendered forgot password form.
 */
const ForgotPassword = () => {
  // State to track the entered email.
  const [email, setEmail] = useState("");
  // State to track any error messages to display.
  const [errorMessage, setErrorMessage] = useState("");
  // State to track success messages after request.
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * submitReset Function
   *
   * Sends a request to the backend to initiate the password reset process.
   * Sets the appropriate messages based on the response.
   */
  const submitReset = async () => {
    // Options for the fetch request.
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

  /**
   * handleSubmit Function
   *
   * Event handler for form submission. Calls the submitReset function.
   *
   * @param {Event} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    submitReset();
  };

  return (
    <Container className="w-75 justify-content-center">
      <Form onSubmit={handleSubmit}>
        {/* <h3 className="mb-3" align="center">Forgot Password</h3> */}
        <Form.Group className="mb-3">
          <FloatingLabel label="Email Address">
            <Form.Control
              type="email"
              placeholder="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>

        <ErrorMessage message={errorMessage} color="red" />
        {successMessage && <Alert variant="primary">{successMessage}</Alert>}

        <Button variant="success" type="submit" className="w-100 btn-lg">
          Send Reset Link
        </Button>
      </Form>
    </Container>
  );
};

export default ForgotPassword;
