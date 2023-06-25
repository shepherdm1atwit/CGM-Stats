import React, {useState, useContext, useEffect} from "react";
import ErrorMessage from "./ErrorMessage-BS";
import { UserContext } from "../context/UserContext";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {authToken, sessionExp} = useContext(UserContext);
    const [sessionExpired, setSessionExpired] = sessionExp;
  const [,setToken] = authToken;

  const handleSubmit = async (e) => {
    e.preventDefault();
        const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };
    const response = await fetch("/api/token", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
    }
  };

  useEffect(() => {
    if (sessionExpired===true){
      console.log("expired " + sessionExpired)
      setSessionExpired(false);
      console.log("expired " + sessionExpired)
      setErrorMessage("Your session has expired, please log in again.");
    }
  },[]);

  return (
    <Container className="d-flex justify-content-center">
      <Form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 text-center">Login</h1>
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <ErrorMessage message={errorMessage} />
        <Button variant="primary" type="submit" className="w-100 mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
