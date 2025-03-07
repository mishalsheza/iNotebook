import React, { useContext, useEffect } from "react";
import noteContext from "../context/Note/noteContext";

const About = () => {
  const a = useContext(noteContext);
  useEffect(() => {
    a.update();
  },[]);
  return (
    <div>
      This is about {a.state.name} and {a.state.class}
    </div>
  );
};

export default About;
