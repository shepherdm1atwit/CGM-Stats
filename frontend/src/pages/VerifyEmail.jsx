/**
 * @file VerifyEmail.jsx
 * @brief Component for email verification.
 */
import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

/**
 * @class VerifyEmail
 * @brief A functional component for verifying user's email.
 *
 * This component manages the email verification process. It takes the
 * verification code from the URL parameters and sends a POST request to the server
 * to verify the email. Any error message during verification is rendered through
 * the ErrorMessage component.
 *
 * @return The JSX code for rendering any error message that may arise during email verification.
 */
const VerifyEmail = () => {
    const navigate = useNavigate();
    const {verificationCode} = useParams();
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * @brief Asynchronous function to verify the email.
     *
     * This function sends a POST request to the server with the verification code.
     * If verification fails, it sets an error message.
     */
    const submitVerification = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token: verificationCode}),
        };

        const response = await fetch("/api/verifyemail", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
    };

    /**
     * @brief useEffect hook to execute the verification and navigate to the root URL.
     *
     * This hook triggers when the component mounts and ensures that the verification process
     * is initiated immediately, followed by navigation to the root URL.
     */
    useEffect(() => {
        submitVerification()
        navigate("/");
    },);

    return (<ErrorMessage message={errorMessage}/>);
};

export default VerifyEmail;