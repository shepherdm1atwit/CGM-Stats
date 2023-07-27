import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";
import UserManage from "../bootstrap components/UserManage-BS";
import NavBar from "../bootstrap components/NavBar-BS";
import SideBar from "../bootstrap components/Sidebar";
import GraphModal from "../bootstrap components/GraphModal-BS";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Col, Modal, Row } from "react-bootstrap";
import { User } from "react-feather";
import "../custom.scss";
import GraphModalMain from "../bootstrap components/GraphModalMain-BS";
import DexcomWarningModalBS from "../bootstrap components/DexcomWarningModal-BS";

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

  const goBack = () => {
    setToken("null");
  };

  if (token === "null") {
    return (
      <div className="vh-100 bg-success-subtle">
        {/* COMMENTED OUT FOR NOW. MAY COME BACK!
                <Header title={message} /> */}

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
              <UserManage />
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else if (dexcomConnected !== true) {
    return (
      <div className="bg-success-subtle">
        <Container className="vh-100 d-flex justify-content-center align-items-center overflow-visible">
          <Col className="col-8 col-lg-4">
            <h1 className="text-center border-bottom border-success">
              Connect to Dexcom...
            </h1>
            <p className="text-center">
              Logging in to Dexcom via CGM Stats does not grant CGM Stats or its
              authors visibility of your Dexcom account login information. We
              use a secure connection that directly pipes your glucose data from
              their servers into our visualizers.
              <br /> That's it!
            </p>
            <Row>
              <DexcomWarningModalBS />
            </Row>
            <Row className="col-3 mt-3 mx-auto">
              <Button onClick={goBack} variant="outline-secondary" className="">
                Go Back
              </Button>
            </Row>
          </Col>
        </Container>
      </div>
    );
  } else {
    return (
      <>
        <div className="bg-success-subtle">
        <NavBar />
        <Container className="justify-content-center">
          <Container className="row">
            <GraphModalMain />
          </Container>
          <Container className="row">
            <div className="text-center mt-4 mb-4">
              <h2>Explore more graphs here:</h2>
            </div>
            <GraphModal />
          </Container>
        </Container>
        </div>
      </>
    );
  }
};

export default AppMain;
