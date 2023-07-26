import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage-BS";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import { FloatingLabel } from "react-bootstrap";

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
