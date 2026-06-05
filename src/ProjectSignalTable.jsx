import { useMemo, useState } from "react";

function ProjectDetailCard({ project }) {
  return (
    <div className="project-detail">
      <div>
        <div className="detail-title">{project.title}</div>
        <p>{project.description}</p>
      </div>
      <div className="detail-meta">
        <span>{project.tech}</span>
        {project.url ? (
          <a href={project.url} target="_blank" rel="noreferrer">
            Repository
          </a>
        ) : (
          <span>Resume project</span>
        )}
      </div>
    </div>
  );
}

function ProjectSignalTable({ projects, title = "Recent Projects", compact = false }) {
  const [selectedKey, setSelectedKey] = useState(projects[0]?.title ?? "");

  const selectedProject = useMemo(
    () => projects.find((project) => project.title === selectedKey) ?? projects[0],
    [projects, selectedKey],
  );
  const visibleDetailProjects = useMemo(() => {
    if (!selectedProject) return [];

    if (selectedProject.title !== "SysControl") {
      return [selectedProject];
    }

    const terminaude = projects.find((project) => project.title === "Terminaude");
    return terminaude ? [selectedProject, terminaude] : [selectedProject];
  }, [projects, selectedProject]);

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

      {visibleDetailProjects.map((project) => (
        <ProjectDetailCard key={`detail-${project.title}`} project={project} />
      ))}
    </article>
  );
}

export default ProjectSignalTable;
