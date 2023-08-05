/**
 * @file AppMain.jsx
 * @brief Main application component for CGM Stats
 *
 * This file contains the main application logic and components. It controls user authentication,
 * connection status, and component rendering based on the user's state.
 */

import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import UserManage from "../bootstrap components/UserManage-BS";
import NavBar from "../bootstrap components/NavBar-BS";
import GraphCarousel from "../bootstrap components/GraphCarousel-BS";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import "../custom.scss";
import PrimaryGraphs from "../bootstrap components/PrimaryGraphs-BS";
import DexcomWarningModalBS from "../bootstrap components/DexcomWarningModal-BS";

/**
 * @function AppMain
 * @description Main application component
 *
 * Renders different sections of the application based on user's authentication and connection status.
 */
const AppMain = () => {
  const { authToken, dexConnect } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [dexcomConnected] = dexConnect;

  /**
   * @function getWelcomeMessage
   * @description Fetch welcome message from the server
   */
  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("/api/api", requestOptions);

    if (!response.ok) {
      console.log("Error: no backend connection.");
    }
  };

  // Fetch welcome message when the component is mounted
  useEffect(() => {
    getWelcomeMessage();
  }, []);

  /**
   * @function goBack
   * @description Reset authentication token to 'null'
   */
  const goBack = () => {
    setToken("null");
  };

  // Rendering logic based on user's authentication and connection status
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
        <NavBar />
        <div className="bg-success-subtle">
          <Container className="justify-content-center pt-6">
            <Container className="row">
              <PrimaryGraphs />
            </Container>
            <Container className="row pb-5">
              <div className="text-center mt-4 mb-4 ">
                <h2>More Graphs:</h2>
              </div>
              <GraphCarousel />
            </Container>
          </Container>
        </div>
      </>
    );
  }
};

export default AppMain;
