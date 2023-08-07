/**
 * @file SettingsModal.jsx
 * @brief Modal component for user settings.
 */
import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ErrorMessage from "../bootstrap components/ErrorMessage-BS";
import { UserContext } from "../context/UserContext";
import LogoutButtonBS from "./LogoutButton-BS";

/**
 * SettingsModal Component
 *
 * Provides a modal window for users to update their glucose preferences
 * or disconnect from their Dexcom account. Users can also clear
 * their stored preferences or log out of their account.
 *
 * @returns {JSX.Element} Rendered modal for user settings.
 */
const SettingsModal = () => {
  // Contextual states and methods from UserContext
  const { authToken, userPrefs, dexConnect, sessionExp } =
    useContext(UserContext);
  const [isActive, setIsActive] = useState(false);
  const [maximumGlucose, setMaximumGlucose] = useState("");
  const [minimumGlucose, setMinimumGlucose] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setSessionExpired] = sessionExp;
  const [token, setToken] = authToken;
  const [prefs] = userPrefs;
  const [, setDexcomConnected] = dexConnect;

  const handleClose = () => setIsActive(false);
  const handleShow = () => setIsActive(true);

  /**
   * Handles the form submission.
   *
   * This function sends updated glucose preferences to the backend.
   * It provides feedback if there's an error in the input or communication.
   */
  const handleSubmit = async () => {
    const maxGlucose = parseInt(maximumGlucose, 10);
    const minGlucose = parseInt(minimumGlucose, 10);
    if (maxGlucose <= minGlucose) {
      setErrorMessage(
        "Maximum glucose value must be higher than minimum glucose value"
      );
    } else if (maxGlucose === 0 || minGlucose === 0) {
      setErrorMessage(
        "Maximum and minimum glucose values must be greater than 0"
      );
    } else {
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ minimum: minGlucose, maximum: maxGlucose }),
        };
        const response = await fetch("/api/savepreferences", requestOptions);
        const data = await response.json();
        if (!response.ok) {
          if (data.detail === "Your session has expired.") {
            setSessionExpired(true);
            setToken("null");
          }
          throw new Error("Error sending preferences to backend.");
        }
        handleClose();
        window.location.reload();
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  const deletePreferences = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/deletepreferences", requestOptions);
    const data = await response.json();
    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setErrorMessage("");
      handleClose();
      window.location.reload();
    }
  };

  const handleDisconnect = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/disconnectdexcom", requestOptions);
    const data = await response.json();
    if (!response.ok) {
      if (data.detail === "Your session has expired.") {
        setSessionExpired(true);
        setToken("null");
      }
      setErrorMessage(data.detail);
    } else {
      setErrorMessage("");
      setDexcomConnected(false);
    }
  };

  return (
    <>
      <Button
        variant="outline-light"
        className="navbar-item"
        onClick={handleShow}
      >
        Settings
      </Button>
      <Modal className="modal-lg" show={isActive} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{`Current Maximum: ${
                prefs.maximum || "-"
              } (mg/dL)`}</Form.Label>
              <Form.Control
                type="number"
                placeholder="Maximum preferred blood glucose (mg/dL)"
                value={maximumGlucose}
                onChange={(e) => setMaximumGlucose(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{`Current Minimum: ${
                prefs.minimum || "-"
              } (mg/dL)`}</Form.Label>
              <Form.Control
                type="number"
                placeholder="Minimum preferred blood glucose (mg/dL)"
                value={minimumGlucose}
                onChange={(e) => setMinimumGlucose(e.target.value)}
              />
            </Form.Group>
            <ErrorMessage message={errorMessage} color="red" />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="warning" onClick={handleDisconnect}>
            Disconnect Dexcom Account
          </Button>
          <Button variant="danger" onClick={deletePreferences}>
            Clear Preferences
          </Button>
          <LogoutButtonBS />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SettingsModal;
