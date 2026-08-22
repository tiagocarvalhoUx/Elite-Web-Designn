import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import { writeFileSync } from 'node:fs'

const URL_ = 'https://elite-web-designn.vercel.app/'
const OUT = process.env.SHOT_DIR

process.env.CHROME_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new','--disable-gpu','--no-first-run'] })

try {
  const runner = await lighthouse(URL_, { port: chrome.port, output: 'json', logLevel: 'error' },
    { extends: 'lighthouse:default', settings: { formFactor: 'mobile', screenEmulation: { mobile:true, width:412, height:823, deviceScaleFactor:1.75, disabled:false },
      throttling: { rttMs:150, throughputKbps:1638.4, cpuSlowdownMultiplier:4, requestLatencyMs:562.5, downloadThroughputKbps:1474.56, uploadThroughputKbps:675 } } })
  const lh = runner.lhr
  writeFileSync(`${OUT}/lh.json`, JSON.stringify(lh))

  console.log('=== MOBILE (throttling 4x CPU / 1.6 Mbps) ===\n')
  console.log('--- notas ---')
  for (const v of Object.values(lh.categories)) console.log(`  ${String(Math.round(v.score*100)).padStart(3)}  ${v.title}`)

  console.log('\n--- métricas ---')
  for (const id of ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index']) {
    const a = lh.audits[id]; if(a?.displayValue) console.log(`  ${a.displayValue.padStart(9)}  ${a.title}`)
  }

  console.log('\n--- o que falhou (ordenado por economia) ---')
  const fails = Object.values(lh.audits)
    .filter(a => a.score !== null && a.score < 0.9 && !['notApplicable','informative'].includes(a.scoreDisplayMode))
    .sort((a,b) => (b.details?.overallSavingsMs||0) - (a.details?.overallSavingsMs||0))
  for (const a of fails) {
    const ms = a.details?.overallSavingsMs ? ` ~${Math.round(a.details.overallSavingsMs)}ms` : ''
    const kb = a.details?.overallSavingsBytes ? ` ${(a.details.overallSavingsBytes/1024).toFixed(0)}kB` : ''
    console.log(`  [${String(Math.round(a.score*100)).padStart(3)}]${ms}${kb}  ${a.title}`)
  }

  const el = lh.audits['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet
  if (el) console.log('\n--- elemento LCP ---\n  ' + el.slice(0,180))
} finally { await chrome.kill() }
