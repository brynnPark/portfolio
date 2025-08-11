import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const loadWin95Css = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = process.env.PUBLIC_URL + "/assets/win95.css";
  document.head.appendChild(link);
};

const closeStartMenu = () => {
  const el = document.getElementById("start-button-input");
  if (el) el.checked = false;
};

/* Desktop icon */
function DesktopIcon({ id, label, img, x, y, selected, onSelect, onOpen }) {
  return (
    <div
      className="loaded-icon"
      style={{ position: "absolute", left: x, top: y, width: 75 }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(id)}
        onDoubleClick={() => onOpen(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen(id);
          if (e.key === " ") onSelect(id);
        }}
        className={`desktop-icon ${selected ? "selected" : ""}`}
        style={{
          textDecoration: "none",
          display: "block",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <img src={img} alt={`${label} Icon`} style={{ width: 52, height: 52 }} />
        <div className="desktop-icon-title">{label}</div>
      </div>
    </div>
  );
}

/* Draggable window */
function DraggableWindow({
  id,
  title,
  iconSrc,
  initial = { left: 60, top: 260, width: 640 },
  z,
  bringToFront,
  minimized,
  maximized,
  onMinimize,
  onMaximize,
  onClose,
  children,
}) {
  const wrapperRef = useRef(null);
  const [pos, setPos] = useState({ x: initial.left, y: initial.top });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    const root = wrapperRef.current;
    if (!root) return;
    const handle = root.querySelector(".card-header");
    if (!handle) return;

    const onDown = (e) => {
      if (minimized || maximized) return;
      bringToFront(id);
      dragging.current = true;
      const p = e.touches?.[0] ?? e;
      setDragStart({ x: p.clientX, y: p.clientY });
      setStartPos({ ...pos });
      document.body.style.userSelect = "none";
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      const p = e.touches?.[0] ?? e;
      const dx = p.clientX - dragStart.x;
      const dy = p.clientY - dragStart.y;
      setPos({ x: startPos.x + dx, y: startPos.y + dy });
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.userSelect = "";
    };

    const opts = { passive: false };
    handle.addEventListener("mousedown", onDown, opts);
    window.addEventListener("mousemove", onMove, opts);
    window.addEventListener("mouseup", onUp, opts);
    handle.addEventListener("touchstart", onDown, opts);
    window.addEventListener("touchmove", onMove, opts);
    window.addEventListener("touchend", onUp, opts);

    return () => {
      handle.removeEventListener("mousedown", onDown, opts);
      window.removeEventListener("mousemove", onMove, opts);
      window.removeEventListener("mouseup", onUp, opts);
      handle.removeEventListener("touchstart", onDown, opts);
      window.removeEventListener("touchmove", onMove, opts);
      window.removeEventListener("touchend", onUp, opts);
      document.body.style.userSelect = "";
    };
  }, [pos, dragStart, startPos, minimized, maximized, id, bringToFront]);

  const hidden = minimized;
  const frameStyle = maximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100vh - 56px)",
        transform: "none",
      }
    : {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: initial.width || "min(1100px, 96vw)",
      };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        ...frameStyle,
        zIndex: z,
        display: hidden ? "none" : "block",
      }}
      onMouseDown={() => bringToFront(id)}
    >
      <div className="card" style={{ height: maximized ? "100%" : "auto" }}>
        <div
          className="card-header d-flex align-items-center justify-content-between"
          style={{
            cursor: maximized ? "default" : "move",
            userSelect: "none",
          }}
        >
          <div className="d-flex align-items-center">
            {iconSrc && (
              <img
                src={iconSrc}
                alt=""
                style={{ width: 18, height: 18, marginRight: 6 }}
              />
            )}
            <span className="my-0">{title}</span>
          </div>
          <div className="d-flex align-items-center">
            <div className="title-bar-controls">
              <button
                aria-label="Minimize"
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize(id);
                }}
                title="Minimize"
              />
              <button
                aria-label="Maximize"
                className="maximize"
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize(id);
                }}
                title="Maximize"
              />
              <button
                aria-label="Close"
                className="close"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(id);
                }}
                title="Close"
              />
            </div>
          </div>
        </div>
        <div
          className="card-body"
          style={{
            height: maximized ? "calc(100% - 56px)" : "auto",
            overflow: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("skills");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const appRef = useRef(null);

  // z-order
  const zCounter = useRef(50);
  const [zMap, setZMap] = useState({ about: 51, projects: 52, webamp: 53 });

  // windows
  const [windows, setWindows] = useState({
    about:   { id: "about",   title: "About ME",          open: true, minimized: false, maximized: false, icon: "/assets/icons/msg_question-0.png", initial: { left: 400,  top: 200, width: 620 } },
    projects:{ id: "projects",title: "Projects",          open: true, minimized: false, maximized: false, icon: "/assets/icons/computer_2_cool-0.png", initial: { left: 400,  top: 520, width: 620 } },
    webamp:  { id: "webamp",  title: "Webamp is coming",  open: true, minimized: true, maximized: false, icon: "/assets/icons/computer_2_cool-4.png", initial: { left: 830, top: 250, width: 620 } },
  });

  const bringToFront   = (id) => setZMap((p) => ({ ...p, [id]: ++zCounter.current }));
  const setMinimized   = (id, v) => setWindows((p) => ({ ...p, [id]: { ...p[id], minimized: v, open: v ? p[id].open : true } }));
  const toggleMaximized= (id) => setWindows((p) => ({ ...p, [id]: { ...p[id], maximized: !p[id].maximized, minimized: false } }));
  const closeWindow    = (id) => setWindows((p) => ({ ...p, [id]: { ...p[id], open: false, minimized: false, maximized: false } }));
  const reopenWindow   = (id) => setWindows((p) => ({ ...p, [id]: { ...p[id], open: true, minimized: false } }));

  // Start menu open/close
  const [startOpen, setStartOpen] = useState(false);

  // time
  const [timeText, setTimeText] = useState("");
  useEffect(() => {
    loadWin95Css();
    const tick = () => {
      const d = new Date();
      const hh = d.getHours();
      const mm = d.getMinutes().toString().padStart(2, "0");
      const ampm = hh >= 12 ? "PM" : "AM";
      const hh12 = ((hh + 11) % 12) + 1;
      setTimeText(`${hh12}:${mm} ${ampm}`);
    };
    tick();
    const i = setInterval(tick, 30000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest(".taskbar") && !e.target.closest("#start-menu-pop")) setStartOpen(false);
      if (!appRef.current?.contains(e.target) || !e.target.closest(".desktop-icon")) setSelectedIcon(null);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // Desktop icons
  const icons = [
    { id: "resume", label: "Resume", img: "/assets/icons/directory_open_file_mydocs-4.png", x: 60, y: 110, url: "/assets/devops_resume.pdf" },
    { id: "blog",   label: "Blog",   img: "/assets/icons/url1-0.png",                       x: 60, y: 230, url: "https://tech.brynnpark.xyz/" },
    { id: "github", label: "Tistory", img: "/assets/icons/accessibility_two_windows.png",   x: 60, y: 350, url: "https://brynn-park.tistory.com/"},
    { id: "contact",label: "Contact",img: "/assets/icons/recycle_bin_full-2.png",           x: 60, y: 470, url: ""},
  ];
  const openIcon = (id) => {
    const t = icons.find((i) => i.id === id);
    if (t) window.open(t.url, "_blank");
  };


const projects = [
  {
    id: "iteamoa",
    title: "🔧 iteamoa",
    desc: "Kubernetes, GitOps, Home Server",
    details: "A platform that recruits project team members using Kubernetes, GitOps, and a home server setup..."
  },
  {
    id: "db",
    title: "🐧 DB",
    desc: "Building DB for second handed market platform",
    details: "Designed and built a scalable database for a second-handed market platform..."
  },
  {
    id: "ai",
    title: "🪄 AI & Data analytics",
    desc: "Using machine learning to analyze data",
    details: "Implemented data pipelines and ML models for analytics..."
  }
];

const openProjectWindow = (project) => {
  setWindows((prev) => {
    if (prev[project.id]) {
      // Already exists → just bring to front & unminimize
      bringToFront(project.id);
      return {
        ...prev,
        [project.id]: { ...prev[project.id], minimized: false, open: true }
      };
    }
    // Add new window
    return {
      ...prev,
      [project.id]: {
        id: project.id,
        title: project.title,
        icon: "/assets/icons/directory_folder_options-5.png",
        open: true,
        minimized: false,
        maximized: false,
        initial: { left: 750, top: 360, width: 500 },
        content: project.details
      }
    };
  });
  bringToFront(project.id);
};




  return (
    <div
      ref={appRef}
      className="App"
      style={{
        position: "relative",
        backgroundImage: "url('/assets/windowsxp.jpg')",
        backgroundSize: "cover",
        minHeight: "100vh",
        paddingBottom: "56px",
        overflow: "hidden",
      }}
    >
      {/* Top navbar (optional) */}
      <nav className="navbar navbar-expand-lg navbar-light navbar-95">
        <a className="navbar-brand" href="/">
          <img src="/assets/icons/computer-3.png" alt="icon" /> Navbar
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active"><a className="nav-link" href="/">About Me</a></li>
            
            <li className="nav-item dropdown">
            <button
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Projects
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={() => reopenWindow("projects")}>
                    iteamoa
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => reopenWindow("about")}>
                    DB
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => reopenWindow("webamp")}>
                    Ai & Data analytics
                  </button>
                </li>
              </ul>
            </li>
            <li className="nav-item"><a className="nav-link" href="#blog">Blog</a></li>
          </ul>
        </div>
        <div className="col-0">
          <a href="mailto:brynnparkjustdoit@email.com" className="btn start-button">
            <img src="/assets/icons/users-1.png" alt="icon" className="icon-16" /> Contact Me
          </a>
          <a href="https://github.com/brynnPark/" className="btn start-button">
            <img src="/assets/icons/directory_folder_options-5.png" alt="icon" className="icon-16" /> GitHub
          </a>
          <a href="https://tech.brynnpark.xyz" className="btn start-button">
            <img src="/assets/icons/html-4.png" alt="icon" className="icon-16" /> Blog
          </a>
        </div>
      </nav>


      {/* Desktop Icons */}
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          id={icon.id}
          label={icon.label}
          img={icon.img}
          x={icon.x}
          y={icon.y}
          selected={selectedIcon === icon.id}
          onSelect={setSelectedIcon}
          onOpen={openIcon}
        />
      ))}

      {/* Windows */}
      {windows.about.open && (
        <DraggableWindow
          id="about"
          title="About ME"
          iconSrc="/assets/icons/msg_question-0.png"
          initial={windows.about.initial}
          z={zMap.about}
          bringToFront={bringToFront}
          minimized={windows.about.minimized}
          maximized={windows.about.maximized}
          onMinimize={(id) => setMinimized(id, true)}
          onMaximize={toggleMaximized}
          onClose={closeWindow}
        >
          <div className="row">
            <div className="col-md-0 my-auto">
              <ul className="list-unstyled mt-3 mb-4">
                <li>🔧 Cloud & Infrastructure Engineer</li>
                <li>🎨 Lover of retro, pink, and aesthetics</li>
                <li>📚 Exploring Linux internals, NUMA, and beyond</li>
                <li>💡 I enjoy blogging, mentoring, and building things</li>
              </ul>
              <a href="personal_page.html" className="btn btn-lg btn-block"> Contact me </a>
            </div>
          </div>
        </DraggableWindow>
      )}

        <div className="col-md-3 my-auto" style={{ position: "relative" }}>
          <div className="container mb-3"
            style={{
                position: "absolute",
                top: 100,
                left: 1300,
                width: 520,       // fixed width
                height: "auto",   // or set a fixed height if needed
                flex: "none"      // prevents flex-based resizing
              }}
            >
            <ul className="nav nav-tabs">
              {["skills", "profile", "contact"].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>

            <div className="tab-content" style={{ minHeight: "210px" }}>
              {activeTab === "skills" && (
                <div>
                  
                  {/* Core Skills */}
                  <div className="kv-group">
                    <div className="kv-title">Core</div>
                    <div className="start-menu__line" aria-hidden="true"></div>
                    <div className="kv-val chip-wrap">
                      <span className="badge-95">Kubernetes</span>
                      <span className="badge-95">Helm</span>
                      <span className="badge-95">ArgoCD</span>
                      <span className="badge-95">Linux</span>
                      <span className="badge-95">Networking</span>
                      <span className="badge-95">Networking</span>
                    </div>
                  </div>

                  {/* Cloud & Tooling */}
                  <div className="kv-group">
                    <div className="kv-title">Cloud & Tooling</div>
                    <div className="start-menu__line" aria-hidden="true"></div>
                    <div className="kv-val chip-wrap">
                      <span className="badge-95">AWS</span>
                      <span className="badge-95">Terraform</span>
                      <span className="badge-95">GitHub Actions</span>
                      <span className="badge-95">Docker</span>
                      <span className="badge-95">Prometheus</span>
                    </div>
                  </div>

                  {/* Currently Exploring */}
                  <div className="kv-group">
                    <div className="kv-title"> Currently Exploring </div>
                    <div className="start-menu__line" aria-hidden="true"></div>
                    <div className="kv-val chip-wrap">
                      <span className="badge-95"> Linux </span>
                      <span className="badge-95"> Monitoring </span>
                      <span className="badge-95"> eBPF </span>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "profile" && (
                <div className="kv">
                  {/* Core Skills */}
                  <div className="kv-group">
                    <div className="kv-title">Role</div>
                    <div className="start-menu__line" aria-hidden="true"></div>
                    <div className="kv-val chip-wrap">
                      <span className="badge-95">Kubernetes</span>
                      <span className="badge-95">Helm</span>
                      <span className="badge-95">Argo CD</span>
                      <span className="badge-95">Linux</span>
                      <span className="badge-95">Networking</span>
                    </div>
                  </div>

                  {/* Cloud & Tooling */}
                  <div className="kv-group">
                    <div className="kv-title">Interests</div>
                    <div className="start-menu__line" aria-hidden="true"></div>
                    <div className="kv-val chip-wrap">
                      <span className="badge-95">AWS</span>
                      <span className="badge-95">Terraform</span>
                      <span className="badge-95">GitHub Actions</span>
                      <span className="badge-95">Docker</span>
                      <span className="badge-95">Prometheus</span>
                    </div>
                  </div>

                  {/* Certificates */}
                  <div className="kv-group">
                    <div className="kv-title"> Certificates </div>
                    <div className="start-menu__line" aria-hidden="true"></div>
                    <div className="kv-val chip-wrap">
                      <span className="badge-95">Linux Foundation Systems Administrator</span>
                      <span className="badge-95">AWS Solutions Architect - Associate</span>
                      <span className="badge-95">AWS Solutions Architect - Professional</span>
                      <span className="badge-95">AWS DevOps Engineer - Professional</span>
                      <span className="badge-95">GCP Associate Cloud Engineer </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div>
                  <p className="contact-list">Feel free to reach out via email <br />
                    or connect with me on social media ! </p>
                  <div className="social-buttons mt-3">
                    <a href="mailto:brynnparkjustdoit@gmail.com" className="btn btn-sm me-2">✉️ Email</a>
                    <a href="https://github.com/brynnPark/" target="_blank" rel="noreferrer" className="btn btn-sm me-2">🐙 GitHub</a>
                    <a href="https://www.linkedin.com/in/bohyeon-park-3a79611b6" target="_blank" rel="noreferrer" className="btn btn-sm me-2">LinkedIn</a>
                    <a href="https://x.com/BrynnPark_eth" target="_blank" rel="noreferrer" className="btn btn-sm me-2">X</a>
                    <a href="https://www.instagram.com/justdoitbrynn" target="_blank" rel="noreferrer" className="btn btn-sm me-2">IG</a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      
        {Object.values(windows)
          .filter(w => w.open && !["about","projects","webamp"].includes(w.id))
          .map((w) => (
            <DraggableWindow
              key={w.id}
              id={w.id}
              title={w.title}
              iconSrc={w.icon}
              initial={w.initial}
              z={zMap[w.id] || 0}
              bringToFront={bringToFront}
              minimized={w.minimized}
              maximized={w.maximized}
              onMinimize={(id) => setMinimized(id, true)}
              onMaximize={toggleMaximized}
              onClose={closeWindow}
            >
              <p>{w.content}</p>
            </DraggableWindow>
        ))}


      {windows.projects.open && (
        <DraggableWindow
          id="projects"
          title="Projects"
          iconSrc="/assets/icons/computer_2_cool-0.png"
          initial={windows.projects.initial}
          z={zMap.projects}
          bringToFront={bringToFront}
          minimized={windows.projects.minimized}
          maximized={windows.projects.maximized}
          onMinimize={(id) => setMinimized(id, true)}
          onMaximize={toggleMaximized}
          onClose={closeWindow}
        >
        <ul className="list-unstyled projects-list">
          {projects.map((proj) => (
            <li
              key={proj.id}
              onClick={() => openProjectWindow(proj)}
              style={{ cursor: "pointer" }}
            >
               <img
            src="/assets/icons/directory_folder_options-5.png"
            alt=""
            width="20"
            height="20"
          />
              <strong>{proj.title}</strong> — {proj.desc}
            </li>
          ))}
        </ul>

        </DraggableWindow>

      )}

      {windows.webamp.open && (
        <DraggableWindow
          id="webamp"
          title="Webamp is coming soon 🎶"
          iconSrc="/assets/icons/computer_2_cool-4.png"
          initial={windows.webamp.initial}
          z={zMap.webamp}
          bringToFront={bringToFront}
          minimized={windows.webamp.minimized}
          maximized={windows.webamp.maximized}
          onMinimize={(id) => setMinimized(id, true)}
          onMaximize={toggleMaximized}
          onClose={closeWindow}
        >
          <div id="app" style={{ minHeight: 200 }} />
          <p className="mt-2">* Audio player not available yet. Waiting for your MP3s :)</p>
        </DraggableWindow>
      )}

      {/* ===== Taskbar (Start button + separator + task buttons + clock) ===== */}
      <footer className="taskbar">
        <div className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
          <div className="d-flex align-items-center">
            {/* Start AREA: relative wrapper so the menu can anchor to the button */}
            <div className="start-area">
              {/* hidden checkbox toggles the menu */}
              <input id="start-button-input" type="checkbox" />

              {/* the actual Start button (label toggles the checkbox) */}
              <label htmlFor="start-button-input" className="start-button">
                <img src="/assets/icons/windows-0.png" alt="" className="icon-16-4" />
                Start
              </label>

              {/* the Win98-style Start menu, anchored to the Start button */}
              <div id="start-menu" className="start-menu win98-menu" role="menu" aria-label="Start menu">
                <div id="windows-start-menu-blue" className="win98-rail">Windows <span>98</span></div>

                <ul className="start-menu__list">
                  <li className="start-menu__line" aria-hidden="true"></li>

                  <li>
                    <button
                      className="start-menu__item"
                      onClick={() => {
                        reopenWindow("about");
                        document.getElementById("start-button-input").checked = false;
                      }}
                    >
                      <img src="/assets/icons/msg_question-0.png" alt="" /> About ME
                    </button>
                  </li>

                  <li className="start-menu__li--has-sub">
                    <button
                      className="start-menu__item start-menu__item--has-sub"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <img src="/assets/icons/computer_2_cool-0.png" alt="" /> Projects
                    </button>

                    {/* Submenu (flies out to the right) */}
                    <ul className="start-menu__submenu" role="menu" aria-label="Projects submenu">
                      <li>
                        <button
                          className="start-menu__item"
                          onClick={() => {
                            openProjectWindow(projects.find(p => p.id === "iteamoa"));
                            closeStartMenu();
                          }}
                        >
                          <img src="/assets/icons/directory_folder_options-5.png" alt="" />
                          iteamoa (k8s, gitops)
                        </button>
                      </li>
                      <li>
                        <button
                          className="start-menu__item"
                          onClick={() => {
                            openProjectWindow(projects.find(p => p.id === "db"));
                            closeStartMenu();
                          }}
                        >
                          <img src="/assets/icons/note-0.png" alt="" />
                          DB (Second Handed Market)
                        </button>
                      </li>
                      <li>
                        <button
                          className="start-menu__item"
                          onClick={() => {
                            openProjectWindow(projects.find(p => p.id === "ai"));
                            closeStartMenu();
                          }}
                        >
                          <img src="/assets/icons/url1-0.png" alt="" />
                          AI & Data Analytics
                        </button>
                      </li>
                    </ul>
                  </li>


                  <li>
                    <a
                      href="#"
                      className="start-menu__item"
                      onClick={(e) => { e.preventDefault(); reopenWindow("webamp"); document.getElementById("start-button-input").checked = false; }}
                    >
                      <img src="/assets/icons/computer_2_cool-4.png" alt="" /> Webamp
                    </a>
                  </li>

                  <li className="start-menu__line" aria-hidden="true"></li>

                  <li>
                    <button
                      className="start-menu__item"
                      onClick={() => {
                        reopenWindow("webamp");
                        document.getElementById("start-button-input").checked = false;
                      }}
                    >
                      <img src="/assets/icons/computer_2_cool-4.png" alt="" /> Webamp
                    </button>
                  </li>

                  <li>
                    <a
                      href="https://tech.brynnpark.xyz/"
                      target="_blank"
                      rel="noreferrer"
                      className="start-menu__item"
                      onClick={() => { document.getElementById("start-button-input").checked = false; }}
                    >
                      <img src="/assets/icons/url1-0.png" alt="" /> Blog
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Silver separator bar */}
            <div className="taskbar__separator" />

            {/* Task buttons */}
            <div className="task-buttons">
              {Object.values(windows)
                .filter((w) => w.open)
                .map((w) => (
                  <button
                    key={w.id}
                    className="task-button"
                    style={{ backgroundColor: w.minimized ? "#d5d5d5" : "silver" }}
                    onClick={() => {
                      const el = document.getElementById("start-button-input");
                      if (el) el.checked = false; // close start menu if open
                      if (w.minimized) { setMinimized(w.id, false); bringToFront(w.id); }
                      else { setMinimized(w.id, true); }
                    }}
                  >
                    <img src={w.icon} alt="" className="icon-16" /> {w.title}
                  </button>
                ))}
            </div>
          </div>

          <div className="time">{timeText}</div>
        </div>
      </footer>


      <div className="header"
        style={{
          position: "absolute",
          bottom: "60px", // just above the taskbar
          left: "20%",
          transform: "translateX(-50%)",
          textAlign: "center",
          width: "100%",
        }}>
        <p className="lead" style={{ color: "white" }}> ** You can use Tabs BELOW </p>
      </div>

    </div>
  );
}