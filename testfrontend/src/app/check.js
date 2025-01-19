import React from "react";
import { useNavigate } from "react-router-dom";

const Check = () => {
  const navigate = useNavigate();

  const goToVerified = () => {
    navigate("/verified");
  };

  return (
    <div>
      <h1>Check Page</h1>
      <button onClick={goToVerified}>Go to Verified Page</button>
    </div>
  );
};

export default Check;
