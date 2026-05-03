import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const commandHelp = [
  "help",
  "about",
  "projects",
  "contact",
  "skills",
  "theme dark",
  "theme light",
  "clear",
];

const skills = [
  "Python",
  "R",
  "C/C++",
  "SQL",
  "Java",
  "scikit-learn",
  "XGBoost",
  "TensorFlow",
  "PyTorch",
  "AWS",
  "Docker",
  "Kubernetes/Kubeflow",
  "ArgoCD",
];

const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function setPortfolioTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    window.localStorage.setItem("portfolio-theme", theme);
  } catch (_error) {
    // Theme changes should still work when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: theme }));
}

function FloatingTerminal() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEvalMode, setIsEvalMode] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([
    {
      type: "system",
      text: "Type help for commands.",
    },
  ]);

  const prompt = useMemo(() => (isEvalMode ? "karan@seroy:~/secret$" : "karan@seroy:~$"), [isEvalMode]);

  useEffect(() => {
    if (!isOpen || isEvalMode) return undefined;

    let progress = 0;

    function handleKonami(event) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === konamiCode[progress]) {
        if (progress >= 8) {
          event.preventDefault();
        }
        progress += 1;
        if (progress === konamiCode.length) {
          setIsEvalMode(true);
          setLines((current) => [
            ...current,
            { type: "system", text: "konami sequence accepted." },
            { type: "system", text: "hidden command unlocked: eval" },
          ]);
          progress = 0;
        }
        return;
      }

      progress = key === konamiCode[0] ? 1 : 0;
    }

    window.addEventListener("keydown", handleKonami);
    return () => window.removeEventListener("keydown", handleKonami);
  }, [isOpen, isEvalMode]);

  function openTerminal() {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function pushLine(line) {
    setLines((current) => [...current, line]);
  }

  function runCommand(rawCommand) {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    pushLine({ type: "command", text: `${prompt} ${rawCommand}` });

    if (command === "clear") {
      setLines([]);
      return;
    }

    if (command === "help") {
      const visibleCommands = isEvalMode ? [...commandHelp, "eval", "sudo ship"] : commandHelp;
      pushLine({ type: "system", text: `Commands: ${visibleCommands.join(", ")}` });
      return;
    }

    if (isEvalMode && command === "eval") {
      pushLine({ type: "system", text: "running portfolio evaluation..." });
      pushLine({ type: "system", text: "baseline: clean" });
      pushLine({ type: "system", text: "signal density: high" });
      pushLine({ type: "system", text: "gradient blob count: 0" });
      pushLine({ type: "system", text: "production readiness: 98.7%" });
      pushLine({ type: "system", text: "recommendation: ship it" });
      return;
    }

    if (isEvalMode && command === "sudo ship") {
      pushLine({ type: "system", text: "deployment confidence: maximum" });
      pushLine({ type: "system", text: "status: quietly inevitable" });
      return;
    }

    if (command === "about") {
      pushLine({ type: "system", text: "Opening about page." });
      navigate("/about.html");
      return;
    }

    if (command === "projects") {
      pushLine({ type: "system", text: "Opening projects page." });
      navigate("/projects.html");
      return;
    }

    if (command === "contact") {
      pushLine({ type: "system", text: "Opening contact page." });
      navigate("/contact.html");
      return;
    }

    if (command === "skills") {
      pushLine({ type: "system", text: skills.join(" / ") });
      return;
    }

    if (command === "github") {
      pushLine({
        type: "link",
        text: "github.com/ks6573",
        href: "https://github.com/ks6573",
      });
      return;
    }

    if (command === "theme dark" || command === "theme light") {
      const theme = command.endsWith("light") ? "light" : "dark";
      setPortfolioTheme(theme);
      pushLine({ type: "system", text: `Theme set to ${theme}.` });
      return;
    }

    pushLine({ type: "error", text: `Unknown command: ${rawCommand}. Try help.` });
  }

  function submitCommand(event) {
    event.preventDefault();
    runCommand(input);
    setInput("");
  }

  if (!isOpen) {
    return (
      <button type="button" className="terminal-launcher" onClick={openTerminal}>
        <span>{prompt}</span>
      </button>
    );
  }

  return (
    <aside
      className={`floating-terminal${isEvalMode ? " eval-mode" : ""}`}
      aria-label="Interactive site terminal"
    >
      <div className="floating-terminal-head">
        <span>{prompt}</span>
        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close terminal">
          close
        </button>
      </div>

      <div className="terminal-lines" aria-live="polite">
        {lines.map((line, index) => {
          if (line.type === "link") {
            return (
              <a
                key={`${line.text}-${index}`}
                href={line.href}
                target="_blank"
                rel="noreferrer"
                className="terminal-line-output link"
              >
                {line.text}
              </a>
            );
          }

          return (
            <div key={`${line.text}-${index}`} className={`terminal-line-output ${line.type}`}>
              {line.text}
            </div>
          );
        })}
      </div>

      <form className="terminal-form" onSubmit={submitCommand}>
        <label htmlFor="floating-terminal-input">{prompt}</label>
        <input
          ref={inputRef}
          id="floating-terminal-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </aside>
  );
}

export default FloatingTerminal;
