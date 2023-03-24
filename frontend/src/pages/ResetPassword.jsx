import React from "react";
import Header from "../components/Header";
import NewPass from "../components/NewPass";

const ResetPassword = () => {
  return (
    <>
      <Header title="Reset Password" />
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          <NewPass />
        </div>
        <div className="column"></div>
      </div>
    </>
  );
};

export default ResetPassword;