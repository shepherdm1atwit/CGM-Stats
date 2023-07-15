import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";
import UserManage from "../bootstrap components/UserManage-BS";
import NavBar from "../bootstrap components/NavBar-BS";
import GraphModal from "../bootstrap components/GraphModal-BS";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Col, Modal, Row } from "react-bootstrap";
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

  {
    /* below are used for the warning modal shown before connecting to dexcom */
  }
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (token === "null") {
    return (
      <div className="vh-100 bg-light">
        {/* COMMENTED OUT FOR NOW. MAY COME BACK!
                <Header title={message} /> */}

        <Container className="vw-100">
          <Row className="vh-100 row-cols-1 row-cols-sm-1 row-cols-lg-2">
            <Col className="align-self-end align-self-lg-center text-center">
              <h1 className="fw-bold squash">Welcome to CGM Stats!</h1>
              <div className="border-bottom mx-5"></div>
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
    let host = window.location.origin;
    let dexurl =
      "https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=FzbQyNRMDTm8xdRrcR2STg8I7S781RC0&redirect_uri=" +
      host +
      "/VerifyDexcom/&response_type=code&scope=offline_access";

    return (
      <>
        <Header title={message} />
        <div className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleShow}>
            Connect CGM Stats to Dexcom
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className="">Connect to Dexcom!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Logging in to Dexcom via CGM Stats does not grant CGM Stats or its
              authors visibility of your Dexcom account login information. We
              use a secure connection that directly pipes your glucose data from
              their servers into our visualizers. That's it!
              <br />
              <br />
              To connect to Dexcom, you will automatically be briefly taken away
              from, and returned to CGM Stats.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" href={dexurl} onClick={handleClose}>
                Understood. Connect me!
              </Button>
            </Modal.Footer>
          </Modal>
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
