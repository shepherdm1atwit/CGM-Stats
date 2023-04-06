import React, { useState } from "react";
import DisconnectDexcomButton from "./DisconnectDexcomButton";

const SettingsModal = ({ onClose }) => {
  const [isActive, setIsActive] = useState(true);

  const closeModal = () => {
    setIsActive(false);
    onClose();
  };

  const cancelModal = () => {
    setIsActive(false);
    onClose();
  };

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Modal title</p>
          <button className="delete" aria-label="close" onClick={closeModal}></button>
        </header>
        <section className="modal-card-body">
          <DisconnectDexcomButton />
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success">Save changes</button>
          <button className="button" onClick={cancelModal}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;