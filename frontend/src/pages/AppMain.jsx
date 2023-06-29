import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";
import UserManage from "../bootstrap components/UserManage-BS";
import NavBar from "../bootstrap components/NavBar-BS";
import GraphModal from "../bootstrap components/GraphModal-BS";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import { User } from "react-feather";
import "../custom.scss";

const AppMain = () => {
  const [message, setMessage] = useState("");
  const { authToken, dexConnect } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [dexcomConnected] = dexConnect;

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("/api/api", requestOptions);
    const data = await response.json();
    //console.log(data)

    if (!response.ok) {
      setMessage("Oops, something messed up, no backend connection.");
    } else {
      setMessage(data.message);
    }
  };

  useEffect(() => {
    getWelcomeMessage();
  }, []);

  if (token === null) {
    return (
      <div className="bg-light">
        {/* COMMENTED OUT FOR NOW. MAY COME BACK!
                <Header title={message} /> */}

        <Container className="vh-100">
          <Row className="vh-100 align-content-center">
            <Col className="d-inline align-self-center">
              <h1 className="fw-bold squash">Welcome to CGM Stats!</h1>
              <div className="border-bottom w-75"></div>
              <p className="expand pt-2">
                The one stop shop for all of your self-monitoring needs.
              </p>
            </Col>
            <Col className="d-inline justify-content-center">
              <UserManage />
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else if (dexcomConnected !== true) {
    let host = window.location.origin;
    let dexurl =
      "https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=FzbQyNRMDTm8xdRrcR2STg8I7S781RC0&redirect_uri=" +
      host +
      "/VerifyDexcom/&response_type=code&scope=offline_access";
    return (
      <>
        <Header title={message} />
        <div className="d-flex justify-content-center">
          <Button href={dexurl} className="btn btn-primary" type="button">
            Connect to Dexcom
          </Button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <NavBar />
        <Container className="justify-content-center">
          <Container className="row">
            <GraphModal />
          </Container>
        </Container>
      </>
    );
  }
};

export default AppMain;
