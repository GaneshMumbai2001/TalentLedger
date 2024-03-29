import React from "react";

const LanguagePercentageDisplay = ({ languagePercentages }) => {
  if (!languagePercentages) {
    return <p>No language data available.</p>;
  }

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

  const sortedLanguages = Object.entries(languagePercentages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="langbox border px-5 py-3 w-[320px] 2xl:w-[350px] border-white rounded-lg">
      <p>Most Used Languages</p>
      {sortedLanguages.map(([language, percentage], index) => (
        <div
          key={language}
          className="language-bar flex  align-middle justify-between   items-center space-x-2"
        >
          <span>{language}: </span>
          <div className="flex w-full space-x-2">
            <div
              className="bar"
              style={{
                width: `${percentage}%`,
                backgroundColor: colors[index % colors.length],
                height: "20px",
                display: "inline-block",
                margin: "5px 0",
              }}
            />
            <span>{parseFloat(percentage).toFixed(2)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LanguagePercentageDisplay;
