import React, { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import Button from "react-bootstrap/Button";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


const ForgotPasswordBS = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitReset = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    };

    const response = await fetch("/api/resetrequest", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setSuccessMessage("");
      setErrorMessage("An error has occurred.");
    } else {
      setSuccessMessage("Please check your email for reset link.");
      setErrorMessage("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    submitReset();

    };


  return (
     <div className="column">

       <Form onSubmit={handleSubmit}>

        <FloatingLabel
            className="mb-3"
            controlId="floatingTextArea"
            label="Enter your email here"
        >
          <Form.Control
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required />
        </FloatingLabel>

        <Button variant="primary" type="submit">
          Send Reset Link
        </Button>{' '}
      </Form>
      </div>

  );
};

export default ForgotPasswordBS;