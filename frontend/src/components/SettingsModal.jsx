import React, { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import DisconnectDexcomButton from "./DisconnectDexcomButton";

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "maximumGlucose") {
      setMaximumGlucose(value);
    } else if (name === "minimumGlucose") {
      setMinimumGlucose(value);
    }
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  const maxGlucose = parseInt(maximumGlucose, 10);
  const minGlucose = parseInt(minimumGlucose, 10);
  if (maxGlucose <= minGlucose) {
    setErrorMessage("Maximum glucose value must be higher than minimum glucose value");
  } else {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ minimum: minGlucose, maximum: maxGlucose }),
      };
      const response = await fetch("/api/savepreferences", requestOptions);
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error("Error sending preferences to backend.");
      }
      closeModal();
    } catch (error) {
      setErrorMessage(error.message);
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
                Save
              </button>
              <button className="button" onClick={closeModal}>
                Cancel
                </button>
              <DisconnectDexcomButton class="is-justify-content-right" />
            </footer>
          </section>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;