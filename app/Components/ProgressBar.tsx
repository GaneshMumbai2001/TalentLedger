import { useEffect } from "react";

export const ProgressBar = ({ currentStep, totalSteps }) => {
  const fillerStyles = {
    height: "100%",
    width: `${(currentStep / totalSteps) * 100}%`,
    background: "linear-gradient(to right, #00C0AB, #0078AA)",
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 0.5s ease-in-out",
    boxShadow: "0 0 10px #00C0AB",
    position: "relative",
    overflow: "hidden",
    zIndex: 1,
  };

  const beforeStyles = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `linear-gradient(to right, rgba(255,255,255,0.6), rgba(255,255,255,0))`,
    animation: "lightning 1.5s infinite linear",
    zIndex: -1,
  };
  useEffect(() => {
    const styles = `
      @keyframes lightning {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }, []);

  return (
    <div
      style={{
        width: "882.5px",
        height: "17px",
        backgroundColor: "#EEE",
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={fillerStyles}>
        <div style={beforeStyles} />
      </div>
    </div>
  );
};
