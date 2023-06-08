import React from "react";
import "./aboutSection.css";
import { Typography } from "@material-ui/core";
// import YouTubeIcon from "@material-ui/icons/YouTube";
// import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  // const visitInstagram = () => {
  //   window.location = "https://instagram.com/meabhisingh";
  // };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <span>
              This is a online fashion website made for final year major
              project. With the help of MERN Stack.
            </span>
          </div>
          <div className="aboutSectionContainer2"></div>
        </div>
      </div>
    </div>
  );
};

export default About;
