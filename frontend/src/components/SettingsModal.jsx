import React, { useState, useContext, useEffect } from "react";
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
  const [data, setData] = useState({ maximum: null, minimum: null });

  useEffect(() => {
    const getPreferences = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch("/api/getpreferences", requestOptions);
        const data = await response.json();
        //console.log(data);
        if (!response.ok) {
          throw new Error("Error retrieving preferences from backend.");
        }
        setData({ maximum: data.maximum, minimum: data.minimum });
      }
      catch (error) {
        setErrorMessage(error.message);
      }
    };
      getPreferences();
  },[isActive]);

  const deletePreferences = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/deletepreferences", requestOptions);
    const data = await response.json();
    if( !response.ok ){
      setErrorMessage(data.detail)
    }
    else{
      setErrorMessage("")
      closeModal()
    }
  };

  const closeModal = () => {
    setIsActive(false);
    onClose();
    window.location.reload()
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
    } else if (maxGlucose === 0 || minGlucose === 0) {
      setErrorMessage("Maximum and minimum glucose values must be greater than 0");
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
              <label className="label">{`Current Maximum: ${data.maximum || "-"} (mg/dL)`}</label>
              <div className="control">
                <span className="has-text-grey">Enter your maximum preferred blood glucose (mg/dL)</span>
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
              <label className="label">{`Current Minimum: ${data.minimum || "-"} (mg/dL)`}</label>
              <div className="control">
                <span className="has-text-grey">Enter your minimum preferred blood glucose (mg/dL)</span>
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
              <button className="button" onClick={deletePreferences}>
                Clear Preferences
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