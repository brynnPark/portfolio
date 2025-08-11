// src/components/ProjectsWindow.jsx
import React from "react";
import Draggable from "react-draggable";

export default function ProjectsWindow() {
  return (
    <Draggable handle=".title-bar">
      <div
        className="window"
        style={{ position: "absolute", top: 240, left: 160, width: 420, zIndex: 8 }}
      >
        <div className="title-bar" style={{ backgroundColor: "#ffc0cb" }}>
          <div className="title-bar-text">Projects</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <ul>
            <li>
              <strong>Home Server GitOps</strong>: Kubernetes + ArgoCD + GitHub Actions
            </li>
            <li>
              <strong>WSS Kernel Module</strong>: NUMA hinting fault-based WSS estimation
            </li>
            <li>
              <strong>ITeamoa</strong>: Serverless recruiting platform on AWS
            </li>
          </ul>
        </div>
      </div>
    </Draggable>
  );
}
