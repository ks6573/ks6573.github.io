import SiteHeader from "./SiteHeader";
import TypedText from "./TypedText";

const contacts = [
  {
    label: "Email",
    value: "ks6573@rit.edu",
    action: "Send Email",
    href: "mailto:ks6573@rit.edu",
  },
  {
    label: "GitHub",
    value: "github.com/ks6573",
    action: "Open GitHub",
    href: "https://github.com/ks6573",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/karan-seroy",
    action: "Open LinkedIn",
    href: "https://linkedin.com/in/karan-seroy/",
  },
];

function ContactPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <SiteHeader />

      <main className="container dashboard-page">
        <section className="hero compact-hero">
          <TypedText as="h1" text="Contact" speed={34} />
          <TypedText
            as="p"
            className="lead"
            text="Open to ML engineering, applied AI, and data-driven product work."
            speed={12}
            startDelay={330}
          />
        </section>

        <section className="section">
          <article className="signal-panel contact-panel">
            <div className="panel-head">
              <h2>Channels</h2>
              <span className="panel-meta">available</span>
            </div>
            <div className="contact-list">
              {contacts.map((contact) => (
                <div className="contact-row" key={contact.label}>
                  <div>
                    <div className="label">{contact.label}</div>
                    <div className="value">{contact.value}</div>
                  </div>
                  <a
                    className="text-link"
                    href={contact.href}
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {contact.action}
                  </a>
                </div>
              ))}
            </div>
          </article>
        </section>

        <footer className="footer">
          <div className="muted">© {year} Karan Seroy</div>
          <div className="terminal-prompt">contact --open</div>
        </footer>
      </main>
    </>
  );
}

export default ContactPage;
