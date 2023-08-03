/**
 * @file ResetPassword.jsx
 * @brief This file contains the implementation of the ResetPassword component.
 */
import React from "react";
import Header from "../components/Header";
import NewPass from "../bootstrap components/NewPass-BS";

/**
 * @class ResetPassword
 * @brief A functional component to reset the password.
 *
 * This component includes a Header and a NewPass component.
 * It is designed to create a responsive layout that contains
 * a space to reset the user's password.
 *
 * @return The JSX code for the Reset Password page.
 */
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