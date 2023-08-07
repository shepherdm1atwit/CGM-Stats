/**
 * @file ErrorMessage.jsx
 * @brief Component for displaying error messages.
 */

import React from "react";
import Alert from 'react-bootstrap/Alert';

/**
 * ErrorMessage Component
 *
 * A simple component to display error messages in an alert. It utilizes the Alert component from 'react-bootstrap'.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.message - The error message to be displayed.
 *
 * @returns {JSX.Element|null} Rendered error message alert if a message is provided, null otherwise.
 */
const ErrorMessage = ({ message }) => (
  message && <Alert variant="danger">{message}</Alert>
);

export default ErrorMessage;
