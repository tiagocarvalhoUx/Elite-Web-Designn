const URL_ = 'https://elite-web-designn.vercel.app/'
const strategy = process.argv[2] || 'mobile'
const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(URL_)}&strategy=${strategy}` +
  ['performance','accessibility','best-practices','seo'].map(c=>`&category=${c}`).join('')

const r = await fetch(api)
if (!r.ok) { console.log('API', r.status, (await r.text()).slice(0,300)); process.exit(1) }
const j = await r.json()
const lh = j.lighthouseResult

console.log(`=== ${strategy.toUpperCase()} — ${lh.fetchTime?.slice(0,19)} ===\n`)
console.log('--- notas ---')
for (const [k,v] of Object.entries(lh.categories)) console.log(`  ${String(Math.round(v.score*100)).padStart(3)}  ${v.title}`)

console.log('\n--- métricas ---')
for (const id of ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index']) {
  const a = lh.audits[id]; if(a) console.log(`  ${a.displayValue.padStart(9)}  ${a.title}  (score ${Math.round((a.score??0)*100)})`)
}

console.log('\n--- oportunidades e diagnósticos que falharam ---')
const fails = Object.values(lh.audits)
  .filter(a => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'informative')
  .sort((a,b) => (b.details?.overallSavingsMs||0) - (a.details?.overallSavingsMs||0))
for (const a of fails) {
  const save = a.details?.overallSavingsMs ? `  [~${Math.round(a.details.overallSavingsMs)}ms]` : ''
  const bytes = a.details?.overallSavingsBytes ? `  [${(a.details.overallSavingsBytes/1024).toFixed(0)}kB]` : ''
  console.log(`  ${String(Math.round(a.score*100)).padStart(3)}  ${a.title}${save}${bytes}`)
}

const lcp = lh.audits['largest-contentful-paint-element']
if (lcp?.details?.items?.[0]?.items?.[0]) console.log('\n--- elemento LCP ---\n  ' + JSON.stringify(lcp.details.items[0].items[0].node?.snippet||'').slice(0,200))
