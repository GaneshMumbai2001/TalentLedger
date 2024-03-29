import React from "react";

interface loadingPercentageProps {
  loadingPercentage?: string;
}

function LoadingScreen({ loadingPercentage }: loadingPercentageProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0d1117",
        zIndex: 9999,
        color: "#58a6ff",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          border: "5px solid #58a6ff",
          borderRadius: "50%",
          width: "100px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          animation: "spin 2s linear infinite",
        }}
      ></div>
      <p style={{ fontSize: "1.5em" }}>Loading... {loadingPercentage}%</p>
    </div>
  );
}

export default LoadingScreen;
