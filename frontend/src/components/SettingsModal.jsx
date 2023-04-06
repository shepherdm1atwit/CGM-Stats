import React, { useState } from "react";
import DisconnectDexcomButton from "./DisconnectDexcomButton";

const SettingsModal = ({ onClose }) => {
  const [isActive, setIsActive] = useState(true);
  const [highestGlucose, setHighestGlucose] = useState("");
  const [lowestGlucose, setLowestGlucose] = useState("");

  const closeModal = () => {
    setIsActive(false);
    onClose();
  };

  const cancelModal = () => {
    setIsActive(false);
    onClose();
  };

  const handleHighestGlucoseChange = (event) => {
    setHighestGlucose(event.target.value);
  };

  const handleLowestGlucoseChange = (event) => {
    setLowestGlucose(event.target.value);
  };

  const handleSubmit = async (e) => {
    // Here you can send the highestGlucose and lowestGlucose values to the backend
    console.log("Highest glucose value:", highestGlucose);
    console.log("Lowest glucose value:", lowestGlucose);
  };

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Settings</p>
          <button className="delete" aria-label="close" onClick={closeModal}></button>
        </header>
        <section className="modal-card-body">

          <div className="field">
            <label className="label">Highest Preferred Blood Glucose (mg/dL)</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={highestGlucose}
                onChange={handleHighestGlucoseChange}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Lowest Preferred Blood Glucose (mg/dL)</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={lowestGlucose}
                onChange={handleLowestGlucoseChange}
              />
            </div>
          </div>
          <DisconnectDexcomButton />
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" type="submit" onClick={handleSubmit}>Save changes</button>
          <button className="button" onClick={cancelModal}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;