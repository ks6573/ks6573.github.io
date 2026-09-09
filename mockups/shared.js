const projects = {
  syscontrol: { name: 'SysControl', kind: 'Python / Model Context Protocol', description: 'An AI systems copilot that connects an assistant to tools for CPU, memory, GPU, disk, networking, processes, applications, documents, and web research.', detail: 'The portfolio direction gives the project room to explain the relationship between an assistant, its tools, and the machine it operates on.', url: 'https://github.com/ks6573/SysControl' },
  swiftlaw: { name: 'SwiftLaw', kind: 'Applied AI / Professional work', description: 'My work at SwiftLaw includes NLP extraction pipelines for private-fund formation documents, structured schemas, and claim-level grounding and verification.', detail: 'I also work on multi-agent editing, drafting, and question-answering workflows, cost-aware orchestration, and semantic retrieval over chat history.', url: null },
  terminaude: { name: 'Terminaude', kind: 'Swift / macOS', description: 'A macOS terminal wrapper designed around a Claude-first workflow for command-line work.', detail: 'A focused exploration of the interface between native desktop software, command-line tools, and AI-assisted development.', url: 'https://github.com/ks6573/Terminaude' },
  evaluation: { name: 'Prompt evaluation', kind: 'LLM research / cPacket Networks', description: 'At cPacket Networks, I developed an LLM system prompt optimizer using DAG-style evaluation, ground-truth input/output cases, and DeepEval.', detail: 'The work evaluated prompt behavior across Gemini, GPT, and Claude, with attention to both output quality and token usage.', url: null },
  performance: { name: 'PerformanceIntelligence', kind: 'Swift / iOS', description: 'An iOS app that monitors device health, calculates a performance score, and recommends actions to prevent slowdowns.', detail: 'A practical application of telemetry: turn measurements into actions a device owner can understand.', url: 'https://github.com/ks6573/PerformanceIntelligence' },
};

const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project || !dialog) return;
    dialog.querySelector('h2').textContent = project.name;
    dialog.querySelector('.dialog-kind').textContent = project.kind;
    dialog.querySelector('.dialog-description').textContent = project.description;
    dialog.querySelector('.dialog-detail').textContent = project.detail;
    const link = dialog.querySelector('.dialog-link');
    link.hidden = !project.url;
    link.style.display = project.url ? 'inline-flex' : 'none';
    if (project.url) link.href = project.url;
    else link.removeAttribute('href');
    dialog.showModal();
  });
});
if (dialog) {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
}

const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter);
  });
  const count = document.querySelectorAll('[data-category]:not([hidden])').length;
  const status = document.querySelector('#filter-status');
  if (status) status.textContent = `${count} projects shown`;
}));

const stepDetails = [
  ['Start with a source.', 'A small, invented document gives the example an inspectable ground truth.', '"The management fee is 2% annually."', 'Sample document'],
  ['Extract a claim.', 'Turn the sentence into a structured value that can be checked against its source.', '{ "management_fee": 0.02, "period": "annual" }', 'Structured claim'],
  ['Verify the evidence.', 'Check that the extracted value is supported by the supplied sentence.', 'source.includes("2%") && claim.management_fee === 0.02', 'Grounding check'],
  ['Return a traceable result.', 'Keep the claim and its source together so someone can inspect the reasoning.', '{ "value": "2%", "grounded": true, "source": 1 }', 'Verified output'],
];
const steps = [...document.querySelectorAll('[data-step]')];
function selectStep(index) {
  if (!steps.length) return;
  steps.forEach((step, i) => step.setAttribute('aria-pressed', String(i === index)));
  const [title, description, sample, label] = stepDetails[index];
  document.querySelector('#step-title').textContent = title;
  document.querySelector('#step-description').textContent = description;
  document.querySelector('#step-code').textContent = sample;
  document.querySelector('#step-label').textContent = label;
}
steps.forEach(step => step.addEventListener('click', () => selectStep(Number(step.dataset.step))));
const run = document.querySelector('#run-sample');
if (run) run.addEventListener('click', async () => {
  run.disabled = true;
  run.textContent = 'Running sample…';
  const status = document.querySelector('#run-status');
  status.textContent = 'Checking the example claim against its source.';
  for (let i = 0; i < steps.length; i++) {
    selectStep(i);
    await new Promise(resolve => setTimeout(resolve, 320));
  }
  const source = 'The management fee is 2% annually.';
  const claim = { management_fee: 0.02, period: 'annual' };
  const grounded = source.includes('2%') && claim.management_fee === 0.02;
  status.textContent = grounded ? 'Sample passed. The 2% claim matches its source.' : 'Sample failed. The claim needs review.';
  run.textContent = 'Run sample again';
  run.disabled = false;
});

const inspectorButtons = document.querySelectorAll('[data-inspect]');
inspectorButtons.forEach(button => button.addEventListener('click', () => {
  inspectorButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const project = projects[button.dataset.inspect];
  document.querySelector('#inspect-name').textContent = project.name;
  document.querySelector('#inspect-kind').textContent = project.kind;
  document.querySelector('#inspect-description').textContent = project.description;
  document.querySelector('#inspect-link').href = project.url;
}));
