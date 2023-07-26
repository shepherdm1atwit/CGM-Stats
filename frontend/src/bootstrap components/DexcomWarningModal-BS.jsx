import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DexcomModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let host = window.location.origin;
  let dexurl =
    "https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=FzbQyNRMDTm8xdRrcR2STg8I7S781RC0&redirect_uri=" +
    host +
    "/VerifyDexcom/&response_type=code&scope=offline_access";

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Connect CGM Stats to Dexcom!
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="">Before you go...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          To connect to Dexcom, you will automatically be briefly taken away
          from, and returned to CGM Stats.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" href={dexurl} onClick={handleClose}>
            Understood. Connect me!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default DexcomModal;
