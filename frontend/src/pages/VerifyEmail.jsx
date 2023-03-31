import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import ErrorMessage from "../components/ErrorMessage";


const VerifyEmail = () => {
    const navigate = useNavigate();
    const {verificationCode} = useParams();
    const [errorMessage, setErrorMessage] = useState("");

    const submitVerification = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: verificationCode }),
        };

        const response = await fetch("/api/verifyemail", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
    };

    useEffect(() => {
        submitVerification()
        navigate("/");
    }, );

    return(<ErrorMessage message={errorMessage} />);
};

export default VerifyEmail;