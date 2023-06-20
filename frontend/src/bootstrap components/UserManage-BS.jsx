import React, { useState } from "react";
import Register from "./Register-BS";
import Login from "./Login-BS";
import ForgotPassword from "./TEMPForgotPassword-BS";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './App.css';
const UserManage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (

    <Card className="d-flex-inline justify-content-center">
      <Card.Header className="d-flex-inline justify-content-center">
          <ButtonGroup>
            <Button
              variant={showRegister ? "primary" : "outline-primary"}
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
                setShowForgotPassword(false);
              }}
            >
              Register
            </Button>
            <Button
              variant={showLogin ? "primary" : "outline-primary"}
              onClick={() => {
                setShowRegister(false);
                setShowLogin(true);
                setShowForgotPassword(false);
              }}
            >
              Login
            </Button>
            <Button
              variant={showForgotPassword ? "primary" : "outline-primary"}
              onClick={() => {
                setShowRegister(false);
                setShowLogin(false);
                setShowForgotPassword(true);
              }}
            >
              Forgot Password
            </Button>
          </ButtonGroup>
      </Card.Header>
      <Card.Body>
        {showRegister && <Register />}
        {showLogin && <Login />}
        {showForgotPassword && <ForgotPassword/>}
      </Card.Body>
    </Card>
  );
};

export default UserManage;
