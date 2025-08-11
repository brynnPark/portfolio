
// src/components/AboutWindow.jsx
import React from "react";
console.log("Rendering AboutWindow");
export default function AboutWindow() {
  return (
      <div
        className="window"
        style={{ position: "absolute", top: 180, left: 60, width: 400, zIndex: 9 }}
      >
        <div className="title-bar" style={{ backgroundColor: "#ffc0cb" }}>
          <div className="title-bar-text">About Me</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <p>
            I'm a cloud-native engineer who loves designing well-architected systems
            with AWS, Kubernetes, and GitOps.
          </p>
          <p>
            Currently exploring Linux internals &amp; memory management in NUMA systems.
          </p>
        </div>
      </div>
  );
}

