import React, { useState, useContext, useEffect } from "react";
import DisconnectDexcomButton from "./DisconnectDexcomButton";
import ErrorMessage from "./ErrorMessage";
import {UserContext} from "../context/UserContext";

const SettingsModal = ({ onClose }) => {
  const [isActive, setIsActive] = useState(true);
  const {authToken,} = useContext(UserContext);
  const [token,] = authToken;
  const [errorMessage, setErrorMessage] =  useState("");
  const [maximumGlucose, setMaximumGlucose] = useState("");
  const [minimumGlucose, setMinimumGlucose] = useState("");

  const closeModal = () => {
    setIsActive(false);
    onClose();
  };

  const handleMaxChange = (event) => {
    setMaximumGlucose(event.target.value);
  };

  const handleMinChange = (event) => {
    setMinimumGlucose(event.target.value);
  };

  //TODO: this component/piece not currently functional, disconnect dexcom button works, settings do not
  const handleSubmit = async () => {
    if (maximumGlucose < minimumGlucose) {
      setErrorMessage("Maximum glucose value must be higher than minimum glucose value");
    }
    else {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ minimum: minimumGlucose, maximum: maximumGlucose })
      };
      const response = await fetch("/api/savepreferences", requestOptions);
      if (!response.ok) {
        setErrorMessage("Error sending preferences to backend.");
      }
      else{
        setErrorMessage("");
      }
    }
  };

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background" onClick={closeModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Settings</p>
            <button className="delete" aria-label="close" onClick={closeModal}></button>
          </header>
          <form onSubmit={handleSubmit}>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Maximum Preferred Blood Glucose (mg/dL)</label>
                <div className="control">
                  <input
                    type="number"
                    value={maximumGlucose}
                    onChange={handleMaxChange}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Minimum Preferred Blood Glucose (mg/dL)</label>
                <div className="control">
                  <input
                    type="number"
                    value={minimumGlucose}
                    onChange={handleMinChange}
                    className="input"
                    required
                  />
                </div>
              </div>
              <ErrorMessage message={errorMessage} color="red" />
              <footer className="modal-card-foot">
                <button className="button is-primary" type="submit">Save changes</button>
                <button className="button" onClick={closeModal}>Cancel</button>
                <DisconnectDexcomButton class="is-justify-content-right" />
              </footer>
            </section>
          </form>
        </div>
      </div>
    );
  };

export default SettingsModal;