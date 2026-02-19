import { useMemo, useState } from 'react';
import { runComparison } from './services/compareApi';

const sliderDefs = [
  ['costSensitivity', 'Cost sensitivity'],
  ['sustainabilityImportance', 'Sustainability importance'],
  ['longTermFocus', 'Long-term focus'],
  ['riskAversion', 'Risk aversion'],
];

function App() {
  const [form, setForm] = useState({
    productA: '',
    productB: '',
    region: '',
    customCriterion: '',
    sliders: {
      costSensitivity: 50,
      sustainabilityImportance: 50,
      longTermFocus: 50,
      riskAversion: 50,
    },
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const radarKeys = useMemo(() => (result ? Object.keys(result.scores.criteria).slice(0, 6) : []), [result]);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await runComparison(form);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="top-nav"><div className="brand">CompAIre App (Repo: compaire-app2)</div></header>
      <main className="content">
        <section className="panel">
          <h1>CompAIre MVP — Product & Service Comparison</h1>
          <div className="controls-grid">
            <input placeholder="Product A" value={form.productA} onChange={(e) => setForm({ ...form, productA: e.target.value })} />
            <input placeholder="Product B" value={form.productB} onChange={(e) => setForm({ ...form, productB: e.target.value })} />
            <input placeholder="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
            <input placeholder="Custom criterion (optional)" value={form.customCriterion} onChange={(e) => setForm({ ...form, customCriterion: e.target.value })} />
          </div>
          <div className="sliders">
            {sliderDefs.map(([key, label]) => (
              <label key={key}>{label}: {form.sliders[key]}
                <input type="range" min="0" max="100" value={form.sliders[key]} onChange={(e) => setForm({ ...form, sliders: { ...form.sliders, [key]: Number(e.target.value) } })} />
              </label>
            ))}
          </div>
          <button className="compare-button" onClick={submit} disabled={loading || !form.productA || !form.productB || !form.region}>{loading ? 'Comparing...' : 'Compare'}</button>
          {error && <p className="error-text">{error}</p>}
        </section>

        {result && (
          <>
            <section className="panel score-panel">
              <p>Total Score A: <strong>{result.scores.total.a}</strong> | Total Score B: <strong>{result.scores.total.b}</strong></p>
              <p>Winner: <strong>{result.winner}</strong> • Confidence: <strong>{result.confidence}%</strong> • Remaining daily calls: <strong>{result.remaining}</strong></p>
            </section>

            <section className="panel">
              <h2>Radar snapshot</h2>
              <div className="radar-grid">
                {radarKeys.map((k) => (
                  <div key={k} className="radar-row"><span>{k}</span><div><em>A {result.scores.criteria[k].a}</em><em>B {result.scores.criteria[k].b}</em></div></div>
                ))}
              </div>
            </section>

            <section className="panel">
              <h2>Criteria, weights, and evidence</h2>
              <table><thead><tr><th>Criterion</th><th>Weight</th><th>A</th><th>B</th><th>Evidence</th></tr></thead><tbody>
                {Object.entries(result.scores.criteria).map(([k, row]) => (
                  <tr key={k}><td>{k}</td><td>{row.weight}</td><td>{row.a}</td><td>{row.b}</td><td><a href={result.evidenceUrls.a[k][0]} target="_blank" rel="noreferrer">A src</a> / <a href={result.evidenceUrls.b[k][0]} target="_blank" rel="noreferrer">B src</a></td></tr>
                ))}
              </tbody></table>
            </section>

            <section className="panel score-panel">
              <p>TCO (5y estimate): A <strong>{result.tco.a ?? 'N/A'}</strong> vs B <strong>{result.tco.b ?? 'N/A'}</strong></p>
              <p>Sustainability: A <strong>{result.sustainability.a ?? 'N/A'}</strong> vs B <strong>{result.sustainability.b ?? 'N/A'}</strong></p>
              <p>{result.explanation}</p>
              <p>{result.tradeoffs}</p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
