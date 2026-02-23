(function () {
  const email = "karan1011seroy@gmail.com";
  const emailText = document.getElementById("emailText");
  if (emailText) emailText.textContent = email;

  function copyEmail() {
    navigator.clipboard.writeText(email).then(() => {
      const btn = document.activeElement;
      if (btn && btn.classList.contains("btn")) {
        const prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = prev), 900);
      }
    }).catch(() => {});
  }

  const copy1 = document.getElementById("copyEmail");
  const copy2 = document.getElementById("copyEmail2");
  if (copy1) copy1.addEventListener("click", copyEmail);
  if (copy2) copy2.addEventListener("click", copyEmail);

  // Footer dates
  const year = document.getElementById("year");
  const updated = document.getElementById("updated");
  const now = new Date();
  if (year) year.textContent = String(now.getFullYear());
  if (updated) updated.textContent = now.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

  // Project search
  const search = document.getElementById("projectSearch");
  const cards = Array.from(document.querySelectorAll("#projectGrid .card"));
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      cards.forEach((card) => {
        const text = card.innerText.toLowerCase();
        const tags = (card.getAttribute("data-tags") || "").toLowerCase();
        const show = !q || text.includes(q) || tags.includes(q);
        card.style.display = show ? "" : "none";
      });
    });
  }
})();