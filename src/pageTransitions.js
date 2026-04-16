const PAGE_TRANSITION_MS = 220;

function isTransitionableLink(anchor) {
  const href = anchor.getAttribute("href");
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("javascript:")) return false;
  if (anchor.hasAttribute("download")) return false;
  if (anchor.target && anchor.target !== "_self") return false;

  const destination = new URL(anchor.href, window.location.href);
  if (destination.origin !== window.location.origin) return false;

  return true;
}

export function initPageTransitions() {
  if (typeof window === "undefined") return;
  if (document.body.dataset.pageTransitionsReady === "true") return;

  document.body.dataset.pageTransitionsReady = "true";
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = event.target.closest("a[href]");
    if (!anchor || !isTransitionableLink(anchor)) return;

    event.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.assign(anchor.href);
    }, PAGE_TRANSITION_MS);
  });

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    document.body.classList.remove("is-leaving");
    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  });
}
