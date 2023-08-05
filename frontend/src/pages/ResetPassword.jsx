/**
 * @file ResetPassword.jsx
 * @brief This file contains the implementation of the ResetPassword component.
 */
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import {
  Alert,
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../bootstrap components/ErrorMessage-BS";

/**
 * @class ResetPassword
 * @brief A functional component to reset the password.
 *
 * This component includes a Header and a NewPass component.
 * It is designed to create a responsive layout that contains
 * a space to reset the user's password.
 *
 * @return The JSX code for the Reset Password page.
 */

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
    <Card className="w-100 vh-75 rounded-bottom-3 rounded-top-0">
      <span className="border border-success">
        <Card.Header
          className="justify-content-center pt-2 w-100 fw squash"
          as="h2"
        >
          Change Password
        </Card.Header>
      </span>
      <Card.Body className="pt-4">
        <Container className="w-75 justify-content-center">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <FloatingLabel label="New Password">
                <Form.Control
                  type="password"
                  placeholder="New password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Confirm new password">
                <Form.Control
                  type="password"
                  placeholder="New password"
                  autoComplete="new-password"
                  value={confirmationPassword}
                  onChange={(e) => setConfirmationPassword(e.target.value)}
                  required
                />
              </FloatingLabel>
            </Form.Group>
            <ErrorMessage message={errorMessage} />
            {successMessage && (
              <Alert variant="primary">{successMessage}</Alert>
            )}
            <Button variant="success" type="submit" className="w-100 btn-lg">
              Change Password
            </Button>
          </Form>
        </Container>
      </Card.Body>
    </Card>
  );
};

const ResetPassword = () => {
  return (
    <div className="vh-100 bg-success-subtle">
      <Container className="vw-100">
        <Row className="vh-100 row-cols-1 row-cols-sm-1 row-cols-lg-2">
          <Col className="align-self-end align-self-lg-center text-center">
            <h1 className="fw-bold squash">Welcome to CGM Stats!</h1>
            <div className="border-bottom border-success mx-5"></div>
            <p className="expand pt-2">
              The one stop shop for all of your self-monitoring needs.
            </p>
          </Col>
          <Col className="align-self-center pt-0 p-2 pt-lg-0 p-lg-3">
            <NewPass />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;
