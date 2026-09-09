export const projects = {
  syscontrol: {
    name: 'SysControl', stack: 'Python / MCP', summary: 'A systems copilot for your machine.',
    description: 'An AI systems copilot with tools for CPU, memory, GPU, disk, networking, processes, applications, documents, and web research.',
    note: 'The interesting part is connecting the assistant to the machine: giving it useful, inspectable tools instead of making it guess what is happening.',
    diagram: 'assistant\n   │\n   └── MCP tools\n         ├── cpu / memory / gpu\n         ├── disk / network / processes\n         └── apps / documents / research',
    url: 'https://github.com/ks6573/SysControl',
  },
  terminaude: {
    name: 'Terminaude', stack: 'Swift / macOS', summary: 'A terminal built around Claude.',
    description: 'A macOS terminal wrapper designed around a Claude-first workflow for command-line work.',
    note: 'A place to explore what native desktop software can do for AI-assisted development, while keeping the command line close at hand.',
    diagram: 'macOS\n   │\n   └── Terminaude\n         └── Claude-first command-line workflow',
    url: 'https://github.com/ks6573/Terminaude',
  },
  performance: {
    name: 'PerformanceIntelligence', stack: 'Swift / iOS', summary: 'Device health you can act on.',
    description: 'An iOS app that monitors device health, calculates a performance score, and recommends actions to prevent slowdowns.',
    note: 'Making telemetry useful means connecting the measurement to an action the person holding the device can understand.',
    diagram: 'device telemetry\n   └── performance score\n         └── recommended actions',
    url: 'https://github.com/ks6573/PerformanceIntelligence',
  },
  options: {
    name: 'OptionsTitan', stack: 'Python / ML', summary: 'Options data and strategy models.',
    description: 'An options prediction and strategy modeling system using Greeks, technical indicators, VIX regimes, and multi-year datasets.',
    note: 'A modeling project built around market data, engineered features, and the behavior of options strategies.',
    diagram: 'options datasets\n   └── Greeks / indicators / VIX regimes\n         └── prediction & strategy models',
    url: 'https://github.com/ks6573/OptionsTitan',
  },
  psa: {
    name: 'PSA', stack: 'Python / ML', summary: 'Password robustness, visualized.',
    description: 'A Password Strength Analyzer that uses machine learning to assess and visualize password robustness.',
    note: 'An applied security ML project that turns a model assessment into visible feedback.',
    diagram: 'password input\n   └── ML assessment\n         └── robustness visualization',
    url: 'https://github.com/ks6573/PSA',
  },
};
