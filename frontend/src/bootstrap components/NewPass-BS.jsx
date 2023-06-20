import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage-BS";
import { useNavigate, useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

const NewPass = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const { resetCode } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ...

  return (
    <Container className="d-flex justify-content-center">
      <Card className="p-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 text-center">Change Password</h1>
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
            <Button className="w-100 mt-3" variant="primary" type="submit">
              Change Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NewPass;
