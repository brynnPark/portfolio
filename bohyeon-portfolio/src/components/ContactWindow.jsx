// src/components/ContactWindow.jsx
import React from "react";
import Draggable from "react-draggable";

export default function ContactWindow() {
  return (
    <Draggable handle=".title-bar">
      <div
        className="window"
        style={{ position: "absolute", top: 300, left: 100, width: 360, zIndex: 7 }}
      >
        <div className="title-bar" style={{ backgroundColor: "#ffc0cb" }}>
          <div className="title-bar-text">Contact</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <p>Email: <a href="mailto:bohyeon@email.com">bohyeon@email.com</a></p>
          <p>Instagram: <span style={{ color: "#d63384" }}>@boh.dev</span></p>
          <button className="button">Say Hello 💌</button>
        </div>
      </div>
    </Draggable>
  );
}
