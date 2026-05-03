import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

function TypedText({ as: Component = "span", text, className = "", speed = 18, startDelay = 80 }) {
  const reduceMotion = useReducedMotion();
  const [visibleText, setVisibleText] = useState(reduceMotion ? text : "");
  const [isTyping, setIsTyping] = useState(!reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setVisibleText(text);
      setIsTyping(false);
      return undefined;
    }

    setVisibleText("");
    setIsTyping(true);

    let index = 0;
    let intervalId;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setVisibleText(text.slice(0, index));

        if (index >= text.length) {
          window.clearInterval(intervalId);
          setIsTyping(false);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [reduceMotion, speed, startDelay, text]);

  return (
    <Component className={`typed-text ${className}${isTyping ? " is-typing" : ""}`}>
      {visibleText}
      <span className="typed-cursor" aria-hidden="true" />
    </Component>
  );
}

export default TypedText;
