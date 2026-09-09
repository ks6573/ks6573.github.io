import { useEffect, useRef, useState } from 'react';

const files = { github: 'github-contributions.json', codex: 'chatgpt-codex-usage.json', claude: 'claude-usage.json' };
const names = { github: 'GitHub', codex: 'ChatGPT + Codex', claude: 'Claude' };
const number = value => Number.isFinite(value) ? value.toLocaleString('en-US') : '--';
const tokenCount = value => !Number.isFinite(value) ? '--' : value >= 1e9 ? `${(value / 1e9).toFixed(1)}B` : value >= 1e6 ? `${(value / 1e6).toFixed(1)}M` : number(value);
const dayCount = value => Number.isFinite(value) ? `${value}d` : '--';
const snapshotDate = value => typeof value === 'string' ? value.slice(0, 10) : 'date unavailable';
const utcDate = date => new Date(`${date}T00:00:00Z`);

function validSnapshot(data, kind) {
  if (!data || typeof data !== 'object') return false;
  if (kind === 'codex') return data.summary && Array.isArray(data.heatmap?.weeks) && data.heatmap.weeks.every(week => Array.isArray(week) && week.length === 7 && week.every(Number.isFinite));
  const days = kind === 'github' ? data.days : data.heatmap?.days;
  return (kind === 'github' || data.summary) && Array.isArray(days) && days.every(day => /^\d{4}-\d{2}-\d{2}$/.test(day?.date) && Number.isFinite(utcDate(day.date).getTime()) && Number.isFinite(day.count) && Number.isFinite(day.level));
}

function useSnapshot(kind) {
  const [state, setState] = useState({ data: null, error: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, error: false });
    fetch(`/data/${files[kind]}`, { cache: 'no-store', signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then(data => {
        if (!validSnapshot(data, kind)) throw new Error('Invalid snapshot');
        if (!controller.signal.aborted) setState({ data, error: false });
      }).catch(() => { if (!controller.signal.aborted) setState({ data: null, error: true }); });
    return () => controller.abort();
  }, [kind, attempt]);
  return { ...state, retry: () => setAttempt(value => value + 1) };
}

function SnapshotStatus({ state, kind }) {
  return <p className="snapshot-status" role="status">{state.error ? <>{names[kind]} activity is unavailable. <button className="inline-command" onClick={state.retry}>Try again</button></> : `Loading ${names[kind]} activity…`}</p>;
}

function datedCells(days, unit) {
  if (!days.length) return [];
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const start = utcDate(sorted[0].date);
  const end = utcDate(sorted.at(-1).date);
  const byDate = new Map(sorted.map(day => [day.date, day]));
  const cells = Array(start.getUTCDay()).fill(null);
  for (const date = new Date(start); date <= end; date.setUTCDate(date.getUTCDate() + 1)) {
    const key = date.toISOString().slice(0, 10);
    const day = byDate.get(key);
    cells.push(day ? { ...day, label: `${key}: ${number(day.count)} ${unit}${day.count === 1 ? '' : 's'}` } : null);
  }
  return cells;
}

function calendarMonths(cells) {
  const seen = new Set();
  return cells.flatMap((cell, index) => {
    if (!cell || seen.has(cell.date.slice(0, 7))) return [];
    seen.add(cell.date.slice(0, 7));
    return [{ label: utcDate(cell.date).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }), weekIndex: Math.floor(index / 7), span: 3 }];
  });
}

function Heatmap({ cells, months, label, initialReadout, generatedAt }) {
  const [active, setActive] = useState(null);
  const [readout, setReadout] = useState(initialReadout);
  const refs = useRef([]);
  const padded = [...cells];
  while (padded.length % 7) padded.push(null);
  const weeks = padded.length / 7;
  const first = cells.findIndex(Boolean);
  const activeIndex = cells[active] ? active : first;
  function inspect(index) { setActive(index); setReadout(cells[index].label); }
  function move(event, index) {
    const offsets = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
    const offset = offsets[event.key];
    if (!offset) return;
    event.preventDefault();
    let next = Math.max(first, Math.min(cells.length - 1, index + offset));
    while (!cells[next] && next >= first && next < cells.length) next += Math.sign(offset);
    refs.current[next]?.focus();
  }
  if (first < 0) return <p className="muted">No activity is included in this snapshot.</p>;
  return <>
    {months && <div className="usage-months" style={{ '--weeks': weeks }} aria-hidden="true">{months.filter(month => Number.isInteger(month.weekIndex) && month.weekIndex >= 0 && month.weekIndex < weeks).map(month => <span key={month.weekIndex} style={{ gridColumn: `${month.weekIndex + 1} / span ${Math.max(1, Math.min(month.span || 1, weeks - month.weekIndex))}` }}>{month.label}</span>)}</div>}
    <div className="heatmap" role="group" aria-label={label} style={{ '--weeks': weeks }}>
      {padded.map((cell, index) => cell ? <button key={index} type="button" ref={node => { refs.current[index] = node; }} data-level={Math.max(0, Math.min(4, cell.level))} title={cell.label} aria-label={cell.label} tabIndex={activeIndex === index ? 0 : -1} onMouseEnter={() => setReadout(cell.label)} onFocus={() => inspect(index)} onClick={() => inspect(index)} onKeyDown={event => move(event, index)} /> : <button key={index} type="button" data-empty="" disabled tabIndex={-1} aria-hidden="true" />)}
    </div>
    <div className="activity-bottomline"><span>{readout}</span><span>snapshot: {snapshotDate(generatedAt)}</span></div>
  </>;
}

function Metrics({ items }) {
  return <dl className="usage-metrics">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

export function GitHubActivity() {
  const state = useSnapshot('github');
  if (!state.data) return <SnapshotStatus state={state} kind="github" />;
  const data = state.data;
  return <div data-activity="" className="activity-output">
    <div className="activity-topline"><strong>{number(data.totalContributions)} contributions</strong><span>{data.from} → {data.to}</span></div>
    <Heatmap cells={datedCells(data.days, 'contribution')} label={`GitHub contributions, ${data.from} to ${data.to}`} initialReadout="hover a day to inspect" generatedAt={data.generatedAt} />
  </div>;
}

export function CodexActivity() {
  const state = useSnapshot('codex');
  if (!state.data) return <SnapshotStatus state={state} kind="codex" />;
  const { summary, heatmap, insights = [], plugins = [], generatedAt } = state.data;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells = heatmap.weeks.flatMap((week, weekIndex) => week.map((level, dayIndex) => ({ level, label: `Week ${weekIndex + 1}, ${days[dayIndex]}: activity level ${level} of 4` })));
  const duration = Number.isFinite(summary.longestChatSeconds) ? `${Math.floor(summary.longestChatSeconds / 3600)}h ${Math.floor(summary.longestChatSeconds % 3600 / 60)}m` : '--';
  return <div data-usage="codex">
    <Metrics items={[
      ['lifetime tokens', tokenCount(summary.lifetimeTokens)], ['peak tokens', tokenCount(summary.peakTokens)], ['longest chat', duration],
      ['current streak', dayCount(summary.currentStreakDays)], ['longest streak', dayCount(summary.longestStreakDays)],
    ]} />
    <Heatmap cells={cells} months={Array.isArray(heatmap.monthLabels) ? heatmap.monthLabels : []} label="ChatGPT and Codex token activity; relative levels 0 to 4" initialReadout="relative activity / levels 0–4" generatedAt={generatedAt} />
    {Array.isArray(insights) && Array.isArray(plugins) && <details className="usage-details"><summary>insights + most used plugins</summary><div className="usage-detail-columns"><Metrics items={insights.map(item => [item.label, item.value])} /><Metrics items={plugins.map(item => [item.name, `${number(item.runs)} runs`])} /></div></details>}
  </div>;
}

function MessageTrend({ days }) {
  const recent = [...days].sort((a, b) => a.date.localeCompare(b.date)).slice(-42);
  if (!recent.length) return null;
  const peak = Math.max(...recent.map(day => day.count));
  const start = utcDate(recent[0].date).getTime();
  const end = utcDate(recent.at(-1).date).getTime();
  const points = recent.map(day => [4 + (utcDate(day.date).getTime() - start) / Math.max(1, end - start) * 712, 94 - day.count / Math.max(1, peak) * 86]);
  return <div className="usage-trend">
    <div className="activity-topline"><strong>daily messages / last {recent.length} days</strong><span>peak: {number(peak)}</span></div>
    <svg viewBox="0 0 720 104" role="img" aria-label={`Daily Claude messages, ${recent[0].date} to ${recent.at(-1).date}. Peak ${number(peak)} messages.`}>
      {[8, 50, 94].map(y => <line key={y} x1="4" x2="716" y1={y} y2={y} className="trend-guide" />)}
      <polyline points={points.map(point => point.join(',')).join(' ')} className="usage-trend-line" />
      {recent.map((day, index) => <circle key={day.date} cx={points[index][0]} cy={points[index][1]} r="2"><title>{day.date}: {number(day.count)} messages</title></circle>)}
    </svg>
    <div className="activity-bottomline"><span>{recent[0].date}</span><span>{recent.at(-1).date}</span></div>
  </div>;
}

export function ClaudeActivity() {
  const state = useSnapshot('claude');
  if (!state.data) return <SnapshotStatus state={state} kind="claude" />;
  const { summary, heatmap, generatedAt } = state.data;
  const cells = datedCells(heatmap.days, 'Claude message');
  return <div data-usage="claude">
    <Metrics items={[
      ['sessions', number(summary.sessions)], ['messages', number(summary.messages)], ['tokens', tokenCount(summary.totalTokens)], ['active days', dayCount(summary.activeDays)],
    ]} />
    <Heatmap cells={cells} months={calendarMonths(cells)} label="Claude Code daily messages" initialReadout="hover a day to inspect messages" generatedAt={generatedAt} />
    <MessageTrend days={heatmap.days} />
  </div>;
}
