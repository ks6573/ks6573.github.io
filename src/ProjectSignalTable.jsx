import { useMemo, useState } from "react";

function ProjectSignalTable({ projects, title = "Recent Projects", compact = false }) {
  const [selectedKey, setSelectedKey] = useState(projects[0]?.title ?? "");

  const selectedProject = useMemo(
    () => projects.find((project) => project.title === selectedKey) ?? projects[0],
    [projects, selectedKey],
  );

  if (!projects.length) {
    return (
      <article className="signal-panel">
        <p className="muted">Loading project signals...</p>
      </article>
    );
  }

  return (
    <article className={`signal-panel project-signal-panel${compact ? " compact" : ""}`}>
      <div className="panel-head">
        <h2>{title}</h2>
        <span className="panel-meta">{projects.length} rows</span>
      </div>

      <div className="signal-table-wrap">
        <table className="signal-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Focus</th>
              <th>Impact</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const isSelected = project.title === selectedProject?.title;

              return (
                <tr
                  key={project.title}
                  className={isSelected ? "is-selected" : ""}
                  onClick={() => setSelectedKey(project.title)}
                >
                  <td>
                    <button
                      type="button"
                      className="row-select"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedKey(project.title)}
                    >
                      <span aria-hidden="true">{isSelected ? ">" : ""}</span>
                      {project.title}
                    </button>
                  </td>
                  <td>{project.focus}</td>
                  <td>{project.impact}</td>
                  <td>{project.updated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <div className="project-detail">
          <div>
            <div className="detail-title">{selectedProject.title}</div>
            <p>{selectedProject.description}</p>
          </div>
          <div className="detail-meta">
            <span>{selectedProject.tech}</span>
            {selectedProject.url ? (
              <a href={selectedProject.url} target="_blank" rel="noreferrer">
                Repository
              </a>
            ) : (
              <span>Resume project</span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default ProjectSignalTable;
