import React, { useState } from "react";
import Register from "./Register-BS";
import Login from "./Login-BS";
import ForgotPassword from "./TEMPForgotPassword-BS";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import '../custom.scss';

const UserManage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (

    <Card className="d-flex-inline justify-content-center col-5">
      <Card.Header className="d-flex-inline justify-content-center">
          <ButtonGroup className="d-flex w-100">
                <Button
                  className="rounded-0 col-3"
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
                  className="rounded-0 col-3"
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
                  className="rounded-0 col-3"
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
