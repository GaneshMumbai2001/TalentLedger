import React from "react";

export const NewprogressBar = ({ currentStep, selectedRole }) => {
  const steps =
    selectedRole === "provider"
      ? [
          { name: "Choose one", number: 1 },
          { name: "Create User ID", number: 2 },
          { name: "GIG Details", number: 3 },
        ]
      : [
          { name: "Choose one", number: 1 },
          { name: "Upload resume", number: 2 },
          { name: "Review details", number: 3 },
        ];

  const progressBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative",
  };

  const stepStyle = (stepNumber) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: stepNumber <= currentStep ? "#000" : "#DCDCDC",
  });

  const stepNumberStyle = (stepNumber) => ({
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: stepNumber <= currentStep ? "#00CBA0" : "#EEE",
    color: stepNumber <= currentStep ? "#FFF" : "#DCDCDC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5px",
    fontWeight: "bold",
  });
  const containerStyle = {
    width: selectedRole === "provider" ? "582.5px" : "582.5px",
  };

  return (
    <div style={containerStyle}>
      <div style={progressBarStyle}>
        {steps.map((step, index) => {
          return (
            <div key={index} style={stepStyle(step.number)}>
              <div className="flex space-x-3 items-center">
                <div style={stepNumberStyle(step.number)}>{step.number}</div>
                <div>{step.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
