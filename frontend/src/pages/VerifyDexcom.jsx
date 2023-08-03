/**
 * @file VerifyDexcom.jsx
 * @brief Verification component for Dexcom authentication.
 */
import React, {useState, useContext, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import {UserContext} from "../context/UserContext";

/**
 * @class VerifyDexcom
 * @brief A functional component for verifying Dexcom authentication.
 *
 * This component manages the verification process for Dexcom authentication.
 * It fetches the authentication code from the URL query parameters and
 * sends a POST request to the server to verify the code.
 *
 * @return The JSX code for rendering any error message that may arise during verification.
 */
const VerifyDexcom = () => {
    const navigate = useNavigate();
    const {authToken} = useContext(UserContext);
    const [token, setToken] = authToken;
    const [queryParameters] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * @brief Asynchronous function to verify Dexcom authentication.
     *
     * This function sends a POST request to the server with the authentication code.
     * If verification fails, it sets an error message and marks session as expired.
     */
    const submitDexAuth = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({code: queryParameters.get("code")}),
        };

        const response = await fetch("/api/authdexcom", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            if (data.detail === "Your session has expired.") {
                setSessionExpired(true);
                setToken("null");
            }
            setErrorMessage(data.detail);
        } else {
            //console.log("Successful Verification");
        }
    };

    /**
     * @brief useEffect hook to execute the verification and navigate to the root URL.
     *
     * This hook triggers when the component mounts and ensures that the verification process
     * is initiated immediately, followed by navigation to the root URL.
     */
    useEffect(() => {
        submitDexAuth();
        navigate("/");
    });

    return <ErrorMessage message={errorMessage}/>;
};

export default VerifyDexcom;
