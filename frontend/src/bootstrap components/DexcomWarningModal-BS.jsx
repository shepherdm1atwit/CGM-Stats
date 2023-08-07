/**
 * @file DexcomModal.jsx
 * @brief Modal component to guide users through the Dexcom connection process.
 */

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

/**
 * DexcomModal Component
 *
 * This component provides a modal window prompting the user to connect CGM Stats with Dexcom.
 * Clicking the button will generate the modal, which when accepted will direct the user to the Dexcom
 * authentication page.
 *
 * @returns {JSX.Element} Rendered component
 */
function DexcomModal() {
  // Modal visibility state
  const [show, setShow] = useState(false);

  // Handlers to control modal visibility
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Generate Dexcom URL for the OAuth2 process
  let host = window.location.origin;
  let dexurl =
    "https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=FzbQyNRMDTm8xdRrcR2STg8I7S781RC0&redirect_uri=" +
    host +
    "/VerifyDexcom/&response_type=code&scope=offline_access";

  return (
    <>
      {/* Button to trigger modal */}
      <Button variant="success" onClick={handleShow}>
        Connect CGM Stats to Dexcom!
      </Button>
      {/* Modal contents */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="">Before you go...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          To connect to Dexcom, you will automatically be briefly taken away
          from, and returned to CGM Stats.
        </Modal.Body>
        <Modal.Footer>
          {/* Redirect button to Dexcom OAuth2 process */}
          <Button variant="success" href={dexurl} onClick={handleClose}>
            Understood. Connect me!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DexcomModal;
