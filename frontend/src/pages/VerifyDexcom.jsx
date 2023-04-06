import React, {useState, useContext, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import {UserContext} from "../context/UserContext";


const VerifyDexcom = () => {
    const navigate = useNavigate();
    const {authToken,} = useContext(UserContext);
    const [token,] = authToken;
    const [queryParameters] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("");

    const submitDexAuth = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ code: queryParameters.get("code") }),
        };

        const response = await fetch("/api/authdexcom", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            console.log("Successful Verification");
        }
    };

    useEffect(() => {
        submitDexAuth()
        navigate("/");
    }, );

    return(<ErrorMessage message={errorMessage} />);
};

export default VerifyDexcom;