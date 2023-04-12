import React, { useState, useContext } from "react";
import DisconnectDexcomButton from "./DisconnectDexcomButton";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";

const SettingsModal = ({ onClose }) => {
  const [isActive, setIsActive] = useState(true);
  const { authToken } = useContext(UserContext);
  const [token] = authToken;
  const [errorMessage, setErrorMessage] = useState("");
  const [maximumGlucose, setMaximumGlucose] = useState("");
  const [minimumGlucose, setMinimumGlucose] = useState("");

  const closeModal = () => {
    setIsActive(false);
    onClose();
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;
    if (name === "maximumGlucose") {
      setMaximumGlucose(value);
    } else if (name === "minimumGlucose") {
      setMinimumGlucose(value);
    }
  };
    //Function currently doesn't work
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Max"+maximumGlucose)
    console.log("Min"+minimumGlucose)
    if (maximumGlucose <= minimumGlucose) {
      console.log("Max"+maximumGlucose)
    console.log("Min"+minimumGlucose)
      setErrorMessage("Maximum glucose value must be higher than minimum glucose value");
    } else {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ minimum: minimumGlucose, maximum: maximumGlucose }),
      };
      const response = await fetch("/api/savepreferences", requestOptions);
      if (!response.ok) {
        setErrorMessage("Error sending preferences to backend.");
      } else {
        setErrorMessage("");
      }
    }
  };
  const test = () => {
    console.log("Max"+maximumGlucose)
    console.log("Min"+minimumGlucose)
    console.log("Max > Min"+maximumGlucose > minimumGlucose )
  }

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
                  name="maximumGlucose"
                  value={maximumGlucose}
                  onChange={handleChange}
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
                  name="minimumGlucose"
                  value={minimumGlucose}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
            <ErrorMessage message={errorMessage} color="red" />
            <footer className="modal-card-foot">
              <button className="button is-primary" type="submit">
                Save changes
              </button>
              <button className="button" onClick={closeModal}>
                Cancel
              </button>
              <DisconnectDexcomButton class="is-justify-content-right" />
              <button onClick={test}>
                Test
              </button>
            </footer>
          </section>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;