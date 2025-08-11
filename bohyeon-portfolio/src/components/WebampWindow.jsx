import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import Webamp from "webamp";

export default function WebampWindow() {
  const containerRef = useRef(null);

  useEffect(() => {
    const webamp = new Webamp({
      initialTracks: [], // no MP3s for now
    });

    if (Webamp.browserIsSupported()) {
      webamp.renderWhenReady(containerRef.current);
    }
  }, []);

  return (
    <Draggable handle=".title-bar">
      <div
        className="window"
        style={{
          position: "absolute",
          top: 100,
          left: 500,
          width: 360,
          zIndex: 10,
        }}
      >
        <div className="title-bar" style={{ backgroundColor: "#ffc0cb" }}>
          <div className="title-bar-text">Webamp 💿</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <div ref={containerRef}></div>
        </div>
      </div>
    </Draggable>
  );
}
