import React from "react";
import Alert from 'react-bootstrap/Alert';

const ErrorMessage = ({ message }) => (
  message && <Alert variant="danger">{message}</Alert>
);

export default ErrorMessage;
