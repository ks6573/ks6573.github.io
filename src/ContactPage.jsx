import { Link } from "react-router-dom";

function ContactPage() {
  const year = new Date().getFullYear();

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <div className="avatar" />
            <div>
              <div className="name">Karan Seroy</div>
              <div className="role">Machine Learning Engineer</div>
            </div>
          </div>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/projects.html">Projects</Link>
            <Link to="/about.html">About</Link>
            <span className="nav-current" aria-current="page">
              Contact
            </span>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1>
            Contact
            <span className="muted"> and collaboration details.</span>
          </h1>
          <p className="lead">
            Open to ML engineering, applied AI, and data-driven product work. The fastest way
            to reach me is email.
          </p>
        </section>

        <section className="section">
          <div className="card contact-card">
            <div className="contact-row">
              <div>
                <div className="label">Email</div>
                <div className="value">karan1011seroy@gmail.com</div>
              </div>
              <a className="btn" href="mailto:karan1011seroy@gmail.com">
                Send Email
              </a>
            </div>

            <div className="contact-row">
              <div>
                <div className="label">GitHub</div>
                <div className="value">github.com/ks6573</div>
              </div>
              <a className="btn secondary" href="https://github.com/ks6573" target="_blank" rel="noreferrer">
                Open GitHub
              </a>
            </div>

            <div className="contact-row contact-row-last">
              <div>
                <div className="label">LinkedIn</div>
                <div className="value">linkedin.com/in/karan-seroy</div>
              </div>
              <a
                className="btn secondary"
                href="https://linkedin.com/in/karan-seroy/"
                target="_blank"
                rel="noreferrer"
              >
                Open LinkedIn
              </a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="muted">© {year} Karan Seroy</div>
        </footer>
      </main>
    </>
  );
}

export default ContactPage;
