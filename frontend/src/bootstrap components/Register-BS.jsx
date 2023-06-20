import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import ErrorMessage from "./ErrorMessage-BS";

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
    <Container className="d-flex justify-content-center">
      <Form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 text-center">Register</h1>
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
            value={confirmationPassword}
            onChange={(e) => setConfirmationPassword(e.target.value)}
            required
          />
        </Form.Group>
        <ErrorMessage message={errorMessage} color="red" />
        {successMessage && (
          <Alert variant="primary">{successMessage}</Alert>
        )}
        <Button variant="primary" type="submit" className="w-100 mt-3">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
