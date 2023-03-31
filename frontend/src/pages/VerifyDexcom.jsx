import React, {useState, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";


const VerifyDexcom = () => {
    const navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("");

    const submitVerify = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dexAuthCode: queryParameters.get("code") }),

        };

        const response = await fetch("/api/verifydexcom", requestOptions);
        const data = await response.json();
        console.log(queryParameters.get("code"));

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            console.log("Successful Verification");
        }
    };

    useEffect(() => {
        submitVerify()
        navigate("/");
    }, );

    return(<ErrorMessage message={errorMessage} />);
};

export default VerifyDexcom;