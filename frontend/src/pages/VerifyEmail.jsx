import React, {useState, useContext, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import { UserContext } from "../context/UserContext";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";


const VerifyEmail = () => {
    const navigate = useNavigate();
    const {verificationCode} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);

    const submitVerification = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: verificationCode }),
        };

        const response = await fetch("/verifyemail", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            //setToken(data.access_token);
            console.log("Successful Verification");
        }
    };

    useEffect(() => {
        submitVerification()
        navigate("/");
    }, );

    return(<ErrorMessage message={errorMessage} />);
};

export default VerifyEmail;