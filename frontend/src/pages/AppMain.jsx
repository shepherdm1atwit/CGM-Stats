import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import Header from "../components/Header";
import UserManage from "../components/UserManage";
import Navbar from "../components/Navbar";
import CurrentGlucoseLevel from "../components/CurrentGlucoseLevel";
import GraphModal from "../components/GraphModal";

const AppMain = () => {
    const [message, setMessage] = useState("");
    const {authToken, dexConnect} = useContext(UserContext);
    const [token,] = authToken;
    const [dexcomConnected,] = dexConnect;

    const getWelcomeMessage = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch("/api/api", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setMessage("Oops, something messed up, no backend connection.");
        } else {
            setMessage(data.message);
        }
    };

    useEffect(() => {
        getWelcomeMessage();
    }, []);

    if( token === null ){
        return (
            <>
                <Header title={message} />
                <div className="columns is-centered is-mobile">
                    <div className="column m-5 is-8 is-offset-2">
                        <UserManage />
                    </div>
                </div>
            </>
        );
    }
    else if( dexcomConnected !== true ){
        //TODO: this link pulls from url to get redirect uri for dexcom, clean up and make sure it works
        let host = window.location.origin
        let dexurl = 'https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=FzbQyNRMDTm8xdRrcR2STg8I7S781RC0&redirect_uri=' + host + '/VerifyDexcom/&response_type=code&scope=offline_access'
        return (
            <>
                <Header title={message} />
                <div className="columns is-centered is-mobile">
                    <div className="column m-5 is-8 is-offset-2 has-text-centered">
                        <a href={dexurl} className="button is-primary"> Connect to Dexcom </a>
                    </div>
                </div>
            </>
        );
    }
    else {
        return (
            <>
                <Navbar />

                <div className="columns is-centered is-mobile">
                    <div className="column m-5 is-8 is-offset-2 has-text-centered">
                        <GraphModal />
                    </div>
                </div>
            </>
        );
    }
};

export default AppMain;