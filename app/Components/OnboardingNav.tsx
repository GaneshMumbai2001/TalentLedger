import Image from "next/image";
import React from "react";
import logo from "../../assets/logo.svg";

function OnboardingNav() {
  return (
    <div className="pt-5 flex items-center space-x-3 mx-20">
      <Image className="w-auto h-8 md:h-12" alt="" src={logo} />{" "}
    </div>
  );
}

export default OnboardingNav;
