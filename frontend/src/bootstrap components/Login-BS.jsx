/**
 * @file Login.jsx
 * @brief Component to manage user login.
 */

import React, { useState, useContext, useEffect } from "react";
import ErrorMessage from "./ErrorMessage-BS";   ///< Component for displaying error messages
import { UserContext } from "../context/UserContext";   ///< User context for global state management
import { Form, Button, Container, FloatingLabel } from "react-bootstrap";   ///< Bootstrap React components

/**
 * Login Component
 *
 * This component manages user login by capturing email and password and sending it to an API endpoint.
 * It also displays error messages as appropriate and handles session expiration.
 *
 * @returns {JSX.Element} The rendered Login component.
 */
const Login = () => {
  // State for managing user inputs and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Extract authentication token and session expiration context
  const { authToken, sessionExp } = useContext(UserContext);
  const [sessionExpired, setSessionExpired] = sessionExp;
  const [, setToken] = authToken;

  /**
   * Handles submission of the login form.
   *
   * Sends a POST request to the API with the provided email and password.
   * If the response contains an error, sets the error message; otherwise, stores the access token.
   *
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };
    const response = await fetch("/api/token", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
    }
  };

  /**
   * Effect hook for managing session expiration.
   *
   * If the session has expired, logs the expiration and resets the session expiration flag,
   * then displays an error message prompting the user to log in again.
   */
  useEffect(() => {
    if (sessionExpired === true) {
      console.log("expired " + sessionExpired);
      setSessionExpired(false);
      console.log("expired " + sessionExpired);
      setErrorMessage("Your session has expired, please log in again.");
    }
  }, []);

  // Rendering the login form
  return (
    <Container className="w-75 justify-content-center">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <FloatingLabel label="Email Address">
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
          <FloatingLabel label="Password">
            <Form.Control
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <ErrorMessage message={errorMessage} />
        <Button variant="success" type="submit" className="w-100 btn-lg">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
