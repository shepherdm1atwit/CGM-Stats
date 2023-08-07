/**
 * @file UserManage.jsx
 * @brief Component to manage user interactions like Registering, Logging in, and Resetting Password.
 */
import React, { useState } from "react";
import Register from "./Register-BS";
import Login from "./Login-BS";
import ForgotPassword from "./ForgotPassword-BS";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

/**
 * UserManage Component
 *
 * Provides a card-based interface for users to switch between Registering,
 * Logging in, and Resetting their Password. The content of the card changes
 * based on which action the user wants to perform.
 *
 * @returns {JSX.Element} Rendered component for user management actions.
 */
const UserManage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <Card className="w-100 vh-75 rounded-bottom-3 rounded-top-0">
      <Card.Header className="justify-content-center p-0 w-100">
        <ButtonGroup className="w-100">
          <Button
            className="rounded-0 col-3 btn-lg m-0"
            variant={showRegister ? "success" : "outline-success"}
            onClick={() => {
              setShowRegister(true);
              setShowLogin(false);
              setShowForgotPassword(false);
            }}
          >
            Register
          </Button>
          <Button
            className="rounded-0 col-3 btn-lg m-0"
            variant={showLogin ? "success" : "outline-success"}
            onClick={() => {
              setShowRegister(false);
              setShowLogin(true);
              setShowForgotPassword(false);
            }}
          >
            Login
          </Button>
          <Button
            className="rounded-0 col-3 btn-lg m-0"
            variant={showForgotPassword ? "success" : "outline-success"}
            onClick={() => {
              setShowRegister(false);
              setShowLogin(false);
              setShowForgotPassword(true);
            }}
          >
            Reset Password
          </Button>
        </ButtonGroup>
      </Card.Header>
      <Card.Body className="pt-4">
        {showRegister && <Register />}
        {showLogin && <Login />}
        {showForgotPassword && <ForgotPassword />}
      </Card.Body>
    </Card>
  );
};

export default UserManage;
