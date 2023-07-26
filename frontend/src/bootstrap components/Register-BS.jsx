import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import ErrorMessage from "./ErrorMessage-BS";
import { FloatingLabel } from "react-bootstrap";

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
      body: JSON.stringify({
        email: email,
        name: name,
        hashed_password: password,
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
