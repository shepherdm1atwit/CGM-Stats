/**
 * @file Register.jsx
 * @brief User registration component.
 */
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import ErrorMessage from "./ErrorMessage-BS";
import { FloatingLabel } from "react-bootstrap";

/**
 * Register Component
 *
 * This component provides a form for users to register.
 * Once registered, users will receive a verification link in their email.
 * The component also provides feedback on registration status.
 *
 * @returns {JSX.Element} The rendered registration form.
 */
const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

    /**
   * Asynchronously submit the registration data to the server.
   */
  const submitRegistration = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
      }),
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

  /**
   * Handle the form submission event.
   *
   * This method ensures that the password meets length requirements
   * and that the password matches the confirmation password.
   *
   * @param {Event} e - The form submission event.
   */
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
    <Container className="w-75 justify-content-center">
      <Form onSubmit={handleSubmit}>
        {/* <h3 className="mb-3" align="center">Register</h3> */}
        <Form.Group className="mb-3">
          <FloatingLabel label="Your First Name">
            <Form.Control
              type="text"
              placeholder="Enter name"
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Your Email Address">
            <Form.Control
              type="email"
              placeholder="Enter email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Enter Password">
            <Form.Control
              type="password"
              placeholder="Enter password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3">
          <FloatingLabel label="Confirm Password">
            <Form.Control
              type="password"
              placeholder="Enter password"
              autoComplete="new-password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <ErrorMessage message={errorMessage} color="red" />
        {successMessage && <Alert variant="primary">{successMessage}</Alert>}

        <Button variant="success" type="submit" className="w-100 btn-lg">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
