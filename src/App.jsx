import { useState, useEffect, useRef, useCallback } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts"
import { PHASES, ALL_TESTS, WEEKLY_PLAN, PSY0_EXAM_ORDER, PSY2_QUESTIONS, CHECKLIST_ITEMS, EXAM_DATE, TARGET } from "./data.js"
import { fetchScores, addScore, deleteScore, fetchSessions, addSession, deleteSession, fetchTestNotes, upsertTestNote, fetchP2Notes, upsertP2Note } from "./db.js"

// ── HELPERS ───────────────────────────────────────────────────────────────────
const scoreColor = s => {
  if (s === null || s === undefined) return "#4b5563"
  if (s >= TARGET) return "#10b981"
  if (s >= 80) return "#f59e0b"
  return "#ef4444"
}
const fmt = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`

// ── COMPONENTS ────────────────────────────────────────────────────────────────
const ScoreBar = ({ value, height = 6 }) => (
  <div style={{ background:"#1e293b", borderRadius:4, height, width:"100%", overflow:"hidden", position:"relative" }}>
    <div style={{ width:`${Math.min(100,value||0)}%`, height:"100%", background:scoreColor(value), borderRadius:4, transition:"width .4s ease" }} />
    <div style={{ position:"absolute", left:`${TARGET}%`, top:0, bottom:0, width:1.5, background:"rgba(255,255,255,0.2)" }} />
  </div>
)

const MiniChart = ({ data, color }) => {
  if (!data || data.length < 2) return <div style={{color:"#4b5563",fontSize:11,padding:"8px 0"}}>Pas assez de données (min. 2 sessions)</div>
  const chartData = data.map((d,i) => ({ i:i+1, score:d.score }))
  return (
    <ResponsiveContainer width="100%" height={90}>
      <LineChart data={chartData} margin={{top:4,right:4,left:-30,bottom:0}}>
        <XAxis dataKey="i" tick={{fontSize:9,fill:"#4b5563"}} />
        <YAxis domain={[0,100]} tick={{fontSize:9,fill:"#4b5563"}} />
        <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:6,fontSize:11}} formatter={v=>[`${v}%`,"Score"]} labelFormatter={i=>`Session ${i}`} />
        <ReferenceLine y={TARGET} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1} />
        <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2} dot={{r:3,fill:color}} activeDot={{r:5}} />
      </LineChart>
    </ResponsiveContainer>
  )
}

const Ico = ({ n, s=16, c="currentColor" }) => {
  const icons = {
    plane:   <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.5L12 2 2 16.5l10-3 10 3z"/><path d="M12 13.5v5M9 17.5h6"/></svg>,
    list:    <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.5" fill={c}/><circle cx="3" cy="12" r="1.5" fill={c}/><circle cx="3" cy="18" r="1.5" fill={c}/></svg>,
    journal: <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    cal:     <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    q:       <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    exam:    <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    timer:   <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><polyline points="12 9 12 13 16 13"/><line x1="9" y1="2" x2="15" y2="2"/></svg>,
    chart:   <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
    note:    <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:   <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
    check:   <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    alert:   <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    sync:    <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    moon:    <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    sun:     <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
  }
  return icons[n] || null
}

// ── TEST CARD ─────────────────────────────────────────────────────────────────
function TestCard({ t, phase, latest, hist, delta, gap, ready, testNotes, handleTestNote, handleDeleteScore, scoreColor, card, card2, border, muted, inp }) {
  const [showChart, setShowChart] = useState(false)
  const [showNote, setShowNote]   = useState(false)
  return (
    <div style={{ background:card, border:`1px solid ${ready?"#10b981":border}`, borderRadius:8, padding:"10px 13px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:13 }}>{ready&&"✅ "}{t.name}</div>
          <div style={{ fontSize:11, color:muted }}>{t.desc}</div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {latest!==null&&(
            <>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:800, color:scoreColor(latest) }}>{latest}%</div>
                <div style={{ fontSize:9, color:muted }}>DERNIER</div>
              </div>
              {gap!==null&&gap>0&&<div style={{ textAlign:"center" }}><div style={{ fontSize:13, fontWeight:700, color:"#ef4444" }}>-{gap}%</div><div style={{ fontSize:9, color:muted }}>AU CIBLE</div></div>}
              {delta!==null&&<div style={{ textAlign:"center" }}><div style={{ fontSize:12, fontWeight:700, color:delta>=0?"#10b981":"#ef4444" }}>{delta>=0?`+${delta}`:delta}%</div><div style={{ fontSize:9, color:muted }}>DELTA</div></div>}
            </>
          )}
          {latest===null&&<div style={{ fontSize:12, color:muted }}>—</div>}
          <button onClick={()=>setShowChart(v=>!v)} style={{ background:"none", border:"none", cursor:"pointer" }}><Ico n="chart" s={14} c="#60a5fa" /></button>
          <button onClick={()=>setShowNote(v=>!v)} style={{ background:"none", border:"none", cursor:"pointer" }}><Ico n="note" s={14} c="#f59e0b" /></button>
        </div>
      </div>
      {latest!==null&&<div style={{ marginTop:7 }}><ScoreBar value={latest} height={7} /></div>}
      {hist.length>0&&(
        <div style={{ marginTop:5, display:"flex", gap:4, flexWrap:"wrap" }}>
          {hist.map((h,i) => (
            <span key={h.id||i} style={{ fontSize:10, background:card2, borderRadius:4, padding:"2px 7px", color:scoreColor(h.score), display:"flex", alignItems:"center", gap:4 }}>
              {h.date} · {h.score}%
              <button onClick={()=>handleDeleteScore(t.id, h.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:0, lineHeight:1 }}><Ico n="trash" s={10} c="#ef4444" /></button>
            </span>
          ))}
        </div>
      )}
      {showChart&&<div style={{ marginTop:10, borderTop:`1px solid ${border}`, paddingTop:10 }}><MiniChart data={hist} color={phase.color} /></div>}
      {showNote&&(
        <textarea
          placeholder="Notes, astuces, méthodes..."
          value={testNotes[t.id]||""}
          onChange={e=>handleTestNote(t.id, e.target.value)}
          rows={2}
          style={{ ...inp, width:"100%", resize:"vertical", boxSizing:"border-box", marginTop:8 }}
        />
      )}
    </div>
  )
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]           = useState(true)
  const [tab, setTab]             = useState("dashboard")
  const [scores, setScores]       = useState({})
  const [sessions, setSessions]   = useState([])
  const [testNotes, setTestNotes] = useState({})
  const [p2notes, setP2notes]     = useState({})
  const [loading, setLoading]     = useState(true)
  const [syncing, setSyncing]     = useState(false)

  // score entry
  const [scoreInput, setScoreInput] = useState({ testId:"", score:"", note:"" })
  // session entry
  const [newSess, setNewSess] = useState({ phase:"PSY0", testId:"", duration:"", score:"", note:"" })
  // chart selector
  const [chartTest, setChartTest] = useState("")
  // timer
  const [timer, setTimer]     = useState(0)
  const [timerOn, setTimerOn] = useState(false)
  const [timerLabel, setTimerLabel] = useState("")
  const timerRef = useRef(null)
  // exam blanc
  const [examStep, setExamStep]   = useState(0)
  const [examTimer, setExamTimer] = useState(5400)
  const [examOn, setExamOn]       = useState(false)
  const examRef = useRef(null)
  // debounce notes
  const noteTimers = useRef({})

  // ── LOAD ──
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const [s, se, tn, p2] = await Promise.all([fetchScores(), fetchSessions(), fetchTestNotes(), fetchP2Notes()])
      setScores(s)
      setSessions(se)
      setTestNotes(tn)
      setP2notes(p2)
      setLoading(false)
    })()
  }, [])

  // timers
  useEffect(() => {
    if (timerOn) timerRef.current = setInterval(() => setTimer(t => t+1), 1000)
    else clearInterval(timerRef.current)
    return () => clearInterval(timerRef.current)
  }, [timerOn])

  useEffect(() => {
    if (examOn) examRef.current = setInterval(() => setExamTimer(t => { if(t<=1){clearInterval(examRef.current);setExamOn(false);return 0} return t-1 }), 1000)
    else clearInterval(examRef.current)
    return () => clearInterval(examRef.current)
  }, [examOn])

  // ── COMPUTED ──
  const daysLeft    = Math.max(0, Math.ceil((EXAM_DATE - new Date()) / 86400000))
  const currentWeek = Math.min(8, Math.max(1, 9 - Math.ceil(daysLeft / 7)))
  const totalMins   = sessions.reduce((a,s) => a+(parseInt(s.duration)||0), 0)

  const getHistory  = id => scores[id] || []
  const getLatest   = id => { const h=getHistory(id); return h.length ? h[h.length-1].score : null }
  const getFirst    = id => { const h=getHistory(id); return h.length ? h[0].score : null }
  const getDelta    = id => { const l=getLatest(id),f=getFirst(id); return (l!==null&&f!==null&&getHistory(id).length>1)?l-f:null }
  const getGap      = id => { const l=getLatest(id); return l!==null ? TARGET-l : null }
  const getPhaseAvg = k  => { const vs=PHASES[k].tests.map(t=>getLatest(t.id)).filter(v=>v!==null); return vs.length?Math.round(vs.reduce((a,b)=>a+b,0)/vs.length):null }
  const getPhaseReady = k => PHASES[k].tests.filter(t=>{ const l=getLatest(t.id); return l!==null&&l>=TARGET }).length
  const readyCount  = ALL_TESTS.filter(t=>{ const l=getLatest(t.id); return l!==null&&l>=TARGET }).length

  const stagnating = Object.entries(scores).filter(([,arr]) => {
    if(arr.length<3) return false
    const last3=arr.slice(-3).map(a=>a.score)
    return (Math.max(...last3)-Math.min(...last3))<=3
  }).map(([id])=>ALL_TESTS.find(t=>t.id===id)?.name).filter(Boolean)

  const regressing = Object.entries(scores).filter(([,arr]) => {
    if(arr.length<2) return false
    return arr[arr.length-1].score < arr[arr.length-2].score
  }).map(([id])=>ALL_TESTS.find(t=>t.id===id)?.name).filter(Boolean)

  const todayFocus = (WEEKLY_PLAN[currentWeek-1]?.focus||[])
    .map(id=>ALL_TESTS.find(t=>t.id===id))
    .filter(t=>{ const l=getLatest(t?.id); return l===null||l<TARGET })
    .slice(0,3)

  const weakTests = ALL_TESTS
    .map(t=>({...t, score:getLatest(t.id)}))
    .filter(t=>t.score!==null)
    .sort((a,b)=>a.score-b.score)
    .slice(0,6)

  // ── ACTIONS ──
  const handleAddScore = async () => {
    if (!scoreInput.testId || !scoreInput.score) return
    setSyncing(true)
    const row = await addScore(scoreInput.testId, parseInt(scoreInput.score), scoreInput.note)
    if (row) {
      setScores(prev => ({
        ...prev,
        [scoreInput.testId]: [...(prev[scoreInput.testId]||[]), { id:row.id, score:row.score, note:row.note, date:row.date }]
      }))
    }
    setScoreInput(p => ({...p, score:"", note:""}))
    setSyncing(false)
  }

  const handleDeleteScore = async (testId, scoreId) => {
    await deleteScore(scoreId)
    setScores(prev => ({ ...prev, [testId]: prev[testId].filter(s=>s.id!==scoreId) }))
  }

  const handleAddSession = async () => {
    if (!newSess.testId || !newSess.duration) return
    setSyncing(true)
    const row = await addSession(newSess.phase, newSess.testId, parseInt(newSess.duration), parseInt(newSess.score)||null, newSess.note)
    if (row) setSessions(prev => [row, ...prev])
    setNewSess(p => ({...p, testId:"", duration:"", score:"", note:""}))
    setSyncing(false)
  }

  const handleDeleteSession = async id => {
    await deleteSession(id)
    setSessions(prev => prev.filter(s=>s.id!==id))
  }

  const handleTestNote = (testId, content) => {
    setTestNotes(prev => ({...prev, [testId]:content}))
    clearTimeout(noteTimers.current[testId])
    noteTimers.current[testId] = setTimeout(() => upsertTestNote(testId, content), 800)
  }

  const handleP2Note = (key, content) => {
    setP2notes(prev => ({...prev, [key]:content}))
    clearTimeout(noteTimers.current[key])
    noteTimers.current[key] = setTimeout(() => upsertP2Note(key, content), 800)
  }

  // ── THEME ──
  const bg     = dark ? "#060b18" : "#f0f4ff"
  const card   = dark ? "#0d1528" : "#ffffff"
  const card2  = dark ? "#111e35" : "#f4f7ff"
  const text   = dark ? "#e2e8f8" : "#0d1528"
  const muted  = dark ? "#5a6a8a" : "#7080a0"
  const border = dark ? "#1a2844" : "#dde5f5"
  const inp    = { background:card2, color:text, border:`1px solid ${border}`, borderRadius:6, padding:"7px 10px", fontSize:13 }
  const btn    = (bg2, c="#fff") => ({ background:bg2, color:c, border:"none", borderRadius:6, padding:"7px 14px", cursor:"pointer", fontWeight:700, fontSize:13 })

  const TABS = [
    { id:"dashboard", label:"Dashboard", icon:"plane"   },
    { id:"tracker",   label:"Épreuves",  icon:"list"    },
    { id:"journal",   label:"Journal",   icon:"journal" },
    { id:"planning",  label:"Planning",  icon:"cal"     },
    { id:"psy2",      label:"PSY2",      icon:"q"       },
    { id:"exam",      label:"Examen Blanc", icon:"exam" },
    { id:"timer",     label:"Timer",     icon:"timer"   },
  ]

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#060b18", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#e2e8f8" }}>
      <div style={{ fontSize:40, marginBottom:16 }}>✈️</div>
      <div style={{ fontSize:14, color:"#5a6a8a", letterSpacing:2 }}>CHARGEMENT DES DONNÉES...</div>
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", background:bg, color:text, fontFamily:"'Inter','Segoe UI',sans-serif", fontSize:14 }}>

      {/* HEADER */}
      <div style={{ background:dark?"#030813":"#0d1f6e", color:"#fff", padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Ico n="plane" s={22} c="#60a5fa" />
          <div>
            <div style={{ fontWeight:800, fontSize:15, letterSpacing:1.5 }}>CADET TRACKER</div>
            <div style={{ fontSize:9, color:"#60a5fa", letterSpacing:3 }}>AIR FRANCE · SÉLECTION PILOTE</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {syncing && <div style={{ display:"flex", alignItems:"center", gap:5, color:"#60a5fa", fontSize:11 }}><Ico n="sync" s={13} c="#60a5fa" />Sync...</div>}
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:9, color:"#60a5fa", letterSpacing:2 }}>OBJECTIF</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#10b981" }}>{TARGET}%</div>
          </div>
          <div style={{ width:1, height:36, background:"#1e3a5f" }} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:24, fontWeight:800, color:daysLeft<30?"#ef4444":"#60a5fa" }}>{daysLeft}J</div>
            <div style={{ fontSize:9, color:"#5a6a8a", letterSpacing:1 }}>AVANT LE JOUR J</div>
          </div>
          <button onClick={()=>setDark(d=>!d)} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <Ico n={dark?"sun":"moon"} s={17} c="#5a6a8a" />
          </button>
        </div>
      </div>

      {/* NAV */}
      <div style={{ display:"flex", overflowX:"auto", background:card, borderBottom:`1px solid ${border}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            display:"flex", alignItems:"center", gap:5, padding:"9px 13px", border:"none", background:"none",
            cursor:"pointer", color:tab===t.id?"#60a5fa":muted,
            borderBottom:tab===t.id?"2px solid #60a5fa":"2px solid transparent",
            fontWeight:tab===t.id?700:400, whiteSpace:"nowrap", fontSize:12,
          }}>
            <Ico n={t.icon} s={13} c={tab===t.id?"#60a5fa":muted} />{t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:"14px", maxWidth:920, margin:"0 auto" }}>

        {/* ALERTS */}
        {regressing.length>0 && (
          <div style={{ background:"#450a0a", border:"1px solid #ef4444", borderRadius:8, padding:"9px 13px", marginBottom:10, display:"flex", gap:8 }}>
            <Ico n="alert" s={15} c="#fca5a5" />
            <div><span style={{ fontWeight:700, color:"#fca5a5", fontSize:11 }}>RÉGRESSION · </span><span style={{ color:"#fcd4c4", fontSize:11 }}>{regressing.join(" · ")}</span></div>
          </div>
        )}
        {stagnating.length>0 && (
          <div style={{ background:"#451a03", border:"1px solid #f59e0b", borderRadius:8, padding:"9px 13px", marginBottom:10, display:"flex", gap:8 }}>
            <Ico n="alert" s={15} c="#fcd34d" />
            <div><span style={{ fontWeight:700, color:"#fcd34d", fontSize:11 }}>STAGNATION · </span><span style={{ color:"#fde68a", fontSize:11 }}>{stagnating.join(" · ")}</span></div>
          </div>
        )}

        {/* ══ DASHBOARD ══ */}
        {tab==="dashboard" && (
          <div>
            {/* Today */}
            {todayFocus.length>0 && (
              <div style={{ background:dark?"#0a1830":"#eef3ff", border:"1px solid #1e3a8a", borderRadius:10, padding:"12px 16px", marginBottom:14 }}>
                <div style={{ fontSize:11, color:"#60a5fa", fontWeight:700, letterSpacing:1, marginBottom:8 }}>⚡ À TRAVAILLER AUJOURD'HUI — S{currentWeek}</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {todayFocus.map(t => {
                    const l=getLatest(t.id)
                    return (
                      <span key={t.id} style={{ background:card, border:`1px solid ${border}`, borderRadius:7, padding:"6px 12px", fontSize:12 }}>
                        <span style={{ fontWeight:600 }}>{t.name}</span>
                        <span style={{ color:l!==null?scoreColor(l):muted, marginLeft:6 }}>{l!==null?`${l}%`:"—"}</span>
                        {l!==null&&l<TARGET&&<span style={{ color:muted, fontSize:10, marginLeft:4 }}>(-{TARGET-l}%)</span>}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Phase cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:10, marginBottom:12 }}>
              {Object.entries(PHASES).map(([key,phase]) => {
                const avg=getPhaseAvg(key), ready=getPhaseReady(key), total=phase.tests.length, gap=avg!==null?TARGET-avg:null
                return (
                  <div key={key} style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:14, borderTop:`3px solid ${phase.color}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div>
                        <div style={{ fontWeight:800, fontSize:16, color:phase.color }}>{phase.label}</div>
                        <div style={{ fontSize:10, color:muted }}>{phase.sublabel}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:26, fontWeight:800, color:avg!==null?scoreColor(avg):muted }}>{avg!==null?`${avg}%`:"—"}</div>
                        {gap!==null&&gap>0&&<div style={{ fontSize:10, color:"#ef4444" }}>-{gap}% du cible</div>}
                        {gap!==null&&gap<=0&&<div style={{ fontSize:10, color:"#10b981" }}>✓ Objectif atteint</div>}
                      </div>
                    </div>
                    <ScoreBar value={avg||0} />
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:muted }}>
                      <span>{ready}/{total} épreuves ≥{TARGET}%</span>
                      <span style={{ color:scoreColor((ready/total)*100) }}>{Math.round((ready/total)*100)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stats row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:8, marginBottom:12 }}>
              {[
                { label:"Prêtes", value:`${readyCount}/${ALL_TESTS.length}`, sub:"épreuves ≥95%" },
                { label:"Sessions", value:sessions.length, sub:"enregistrées" },
                { label:"Temps", value:`${Math.floor(totalMins/60)}h${totalMins%60?totalMins%60+"m":""}`, sub:"d'entraînement" },
                { label:"Semaine", value:`S${currentWeek}/8`, sub:"du programme" },
              ].map(s => (
                <div key={s.label} style={{ background:card, border:`1px solid ${border}`, borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:800, color:"#60a5fa" }}>{s.value}</div>
                  <div style={{ fontSize:9, color:muted, letterSpacing:0.5 }}>{s.label}</div>
                  <div style={{ fontSize:10, color:muted }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Weak tests */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:14, marginBottom:12 }}>
              <div style={{ fontWeight:700, fontSize:11, marginBottom:10, color:muted, letterSpacing:1 }}>PRIORITÉS — ÉCART AU CIBLE {TARGET}%</div>
              {weakTests.length===0&&<div style={{ color:muted, fontSize:12 }}>Aucun score encore. Commence par l'onglet Épreuves.</div>}
              {weakTests.map(t => (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                  <div style={{ width:150, fontSize:12, fontWeight:600, flexShrink:0 }}>{t.name}</div>
                  <div style={{ flex:1 }}><ScoreBar value={t.score} /></div>
                  <div style={{ fontSize:13, fontWeight:800, color:scoreColor(t.score), width:34, textAlign:"right" }}>{t.score}%</div>
                  <div style={{ fontSize:10, color:"#ef4444", width:40, textAlign:"right" }}>-{Math.max(0,TARGET-t.score)}%</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:14 }}>
              <div style={{ fontWeight:700, fontSize:11, marginBottom:10, color:muted, letterSpacing:1 }}>GRAPHIQUE DE PROGRESSION</div>
              <select value={chartTest} onChange={e=>setChartTest(e.target.value)} style={{ ...inp, width:"100%", marginBottom:10 }}>
                <option value="">-- Choisir une épreuve --</option>
                {Object.entries(PHASES).map(([key,phase]) => (
                  <optgroup key={key} label={`${phase.label} — ${phase.sublabel}`}>
                    {phase.tests.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                  </optgroup>
                ))}
              </select>
              {chartTest && (() => {
                const h=getHistory(chartTest), delta=getDelta(chartTest)
                const phaseColor=Object.values(PHASES).find(p=>p.tests.some(t=>t.id===chartTest))?.color||"#60a5fa"
                return (
                  <div>
                    <div style={{ display:"flex", gap:16, marginBottom:8 }}>
                      <div style={{ fontSize:11, color:muted }}>Premier : <span style={{ color:text, fontWeight:700 }}>{getFirst(chartTest)}%</span></div>
                      <div style={{ fontSize:11, color:muted }}>Dernier : <span style={{ color:scoreColor(getLatest(chartTest)), fontWeight:700 }}>{getLatest(chartTest)}%</span></div>
                      {delta!==null&&<div style={{ fontSize:11, color:delta>=0?"#10b981":"#ef4444", fontWeight:700 }}>{delta>=0?`▲ +${delta}%`:`▼ ${delta}%`}</div>}
                      <div style={{ fontSize:11, color:muted }}>Manque : <span style={{ color:"#ef4444", fontWeight:700 }}>{Math.max(0,TARGET-getLatest(chartTest))}%</span></div>
                    </div>
                    <MiniChart data={h} color={phaseColor} />
                    <div style={{ fontSize:9, color:muted, marginTop:4 }}>— Ligne verte = objectif {TARGET}%</div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* ══ TRACKER ══ */}
        {tab==="tracker" && (
          <div>
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:14, marginBottom:14 }}>
              <div style={{ fontWeight:700, marginBottom:10, fontSize:11, color:muted, letterSpacing:1 }}>ENREGISTRER UN SCORE</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <select value={scoreInput.testId} onChange={e=>setScoreInput(p=>({...p,testId:e.target.value}))} style={{ ...inp, flex:2, minWidth:160 }}>
                  <option value="">-- Choisir une épreuve --</option>
                  {Object.entries(PHASES).map(([key,phase]) => (
                    <optgroup key={key} label={`${phase.label} — ${phase.sublabel}`}>
                      {phase.tests.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                    </optgroup>
                  ))}
                </select>
                <input type="number" min="0" max="100" placeholder="Score %" value={scoreInput.score} onChange={e=>setScoreInput(p=>({...p,score:e.target.value}))} style={{ ...inp, width:90 }} />
                <input placeholder="Note (optionnel)" value={scoreInput.note} onChange={e=>setScoreInput(p=>({...p,note:e.target.value}))} style={{ ...inp, flex:3, minWidth:120 }} />
                <button onClick={handleAddScore} style={btn("#3b82f6")} disabled={syncing}>{syncing?"...":"Sauvegarder"}</button>
              </div>
            </div>

            {Object.entries(PHASES).map(([key,phase]) => (
              <div key={key} style={{ marginBottom:16 }}>
                <div style={{ fontWeight:800, fontSize:13, color:phase.color, marginBottom:8, paddingLeft:10, borderLeft:`3px solid ${phase.color}` }}>
                  {phase.label} — {phase.sublabel}
                  <span style={{ marginLeft:10, fontSize:11, color:muted, fontWeight:400 }}>{getPhaseReady(key)}/{phase.tests.length} ≥{TARGET}%</span>
                </div>
                <div style={{ display:"grid", gap:6 }}>
                  {phase.tests.map(t => {
                    const latest=getLatest(t.id), hist=getHistory(t.id), delta=getDelta(t.id), gap=getGap(t.id), ready=latest!==null&&latest>=TARGET
                    return (
                      <TestCard key={t.id} t={t} phase={phase} latest={latest} hist={hist} delta={delta} gap={gap} ready={ready}
                        testNotes={testNotes} handleTestNote={handleTestNote} handleDeleteScore={handleDeleteScore}
                        scoreColor={scoreColor} card={card} card2={card2} border={border} muted={muted} inp={inp} />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ JOURNAL ══ */}
        {tab==="journal" && (
          <div>
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:14, marginBottom:14 }}>
              <div style={{ fontWeight:700, marginBottom:10, fontSize:11, color:muted, letterSpacing:1 }}>NOUVELLE SESSION</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <select value={newSess.phase} onChange={e=>setNewSess(p=>({...p,phase:e.target.value,testId:""}))} style={inp}>
                  {Object.entries(PHASES).map(([k,ph])=><option key={k} value={k}>{ph.label}</option>)}
                </select>
                <select value={newSess.testId} onChange={e=>setNewSess(p=>({...p,testId:e.target.value}))} style={{ ...inp, flex:2, minWidth:150 }}>
                  <option value="">-- Épreuve --</option>
                  {PHASES[newSess.phase].tests.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <input type="number" placeholder="Durée (min)" value={newSess.duration} onChange={e=>setNewSess(p=>({...p,duration:e.target.value}))} style={{ ...inp, width:110 }} />
                <input type="number" min="0" max="100" placeholder="Score %" value={newSess.score} onChange={e=>setNewSess(p=>({...p,score:e.target.value}))} style={{ ...inp, width:90 }} />
                <input placeholder="Note" value={newSess.note} onChange={e=>setNewSess(p=>({...p,note:e.target.value}))} style={{ ...inp, flex:3, minWidth:120 }} />
                <button onClick={handleAddSession} style={btn("#10b981")} disabled={syncing}>{syncing?"...":"Ajouter"}</button>
              </div>
            </div>
            {sessions.length===0&&<div style={{ color:muted, textAlign:"center", padding:40, fontSize:13 }}>Aucune session. Lance ton premier entraînement !</div>}
            {sessions.map(s => {
              const test=ALL_TESTS.find(t=>t.id===s.test_id), phase=PHASES[s.phase]
              return (
                <div key={s.id} style={{ background:card, border:`1px solid ${border}`, borderRadius:8, padding:"11px 13px", marginBottom:7, display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:3, height:40, borderRadius:2, background:phase?.color||"#60a5fa", flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:13 }}>{test?.name||s.test_id}</div>
                    <div style={{ fontSize:11, color:muted }}>{s.date} · {s.duration}min{s.note?` · ${s.note}`:""}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {s.score&&<div style={{ fontSize:17, fontWeight:800, color:scoreColor(s.score) }}>{s.score}%</div>}
                    <span style={{ background:card2, borderRadius:5, padding:"2px 8px", fontSize:10, color:phase?.color }}>{s.phase}</span>
                    <button onClick={()=>handleDeleteSession(s.id)} style={{ background:"none", border:"none", cursor:"pointer" }}><Ico n="trash" s={13} c="#ef4444" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ══ PLANNING ══ */}
        {tab==="planning" && (
          <div>
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:14, marginBottom:14, display:"flex", gap:20, alignItems:"center" }}>
              <div><div style={{ fontSize:9, color:muted, letterSpacing:2 }}>SEMAINE EN COURS</div><div style={{ fontSize:36, fontWeight:800, color:"#60a5fa" }}>S{currentWeek}</div></div>
              <div style={{ width:1, height:40, background:border }} />
              <div><div style={{ fontSize:9, color:muted, letterSpacing:2 }}>THÈME</div><div style={{ fontSize:15, fontWeight:700 }}>{WEEKLY_PLAN[currentWeek-1]?.theme}</div></div>
              <div style={{ marginLeft:"auto", textAlign:"right" }}><div style={{ fontSize:9, color:muted }}>ÉPREUVES PRÊTES</div><div style={{ fontSize:22, fontWeight:800, color:"#10b981" }}>{readyCount}/{ALL_TESTS.length}</div></div>
            </div>
            <div style={{ display:"grid", gap:8 }}>
              {WEEKLY_PLAN.map(w => {
                const isCurrent=w.week===currentWeek, isPast=w.week<currentWeek
                return (
                  <div key={w.week} style={{ background:isCurrent?(dark?"#0a1a35":"#e8f0ff"):card, border:`1px solid ${isCurrent?"#3b82f6":border}`, borderRadius:8, padding:"11px 13px", opacity:isPast?0.55:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                      <span style={{ fontWeight:800, fontSize:12, color:isCurrent?"#60a5fa":muted, width:22 }}>S{w.week}</span>
                      <span style={{ fontWeight:700 }}>{w.theme}</span>
                      {isCurrent&&<span style={{ background:"#3b82f6", color:"#fff", fontSize:9, padding:"2px 8px", borderRadius:10, fontWeight:700 }}>EN COURS</span>}
                      {isPast&&<span>✅</span>}
                    </div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {w.focus.map(id => {
                        const test=ALL_TESTS.find(t=>t.id===id), score=getLatest(id), ready=score!==null&&score>=TARGET
                        return (
                          <span key={id} style={{ background:card2, borderRadius:6, padding:"4px 10px", fontSize:11, border:`1px solid ${ready?"#10b981":border}`, color:score!==null?scoreColor(score):text }}>
                            {ready&&"✓ "}{test?.name} {score!==null?`(${score}%)`:""}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══ PSY2 ══ */}
        {tab==="psy2" && (
          <div>
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:13, marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:11, color:muted, letterSpacing:1, marginBottom:4 }}>PRÉPARATION COMMISSION PSY2</div>
              <div style={{ fontSize:12, color:muted }}>Tes réponses sont sauvegardées automatiquement dans Supabase.</div>
            </div>
            {PSY2_QUESTIONS.map((q,i) => (
              <div key={i} style={{ background:card, border:`1px solid ${border}`, borderRadius:8, padding:13, marginBottom:10 }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:8, display:"flex", gap:8, alignItems:"flex-start" }}>
                  <span style={{ background:"#3b82f6", color:"#fff", borderRadius:5, padding:"2px 8px", fontSize:10, flexShrink:0 }}>Q{i+1}</span>{q}
                </div>
                <textarea
                  placeholder="Ta réponse préparée..."
                  value={p2notes[`q_${i}`]||""}
                  onChange={e=>handleP2Note(`q_${i}`, e.target.value)}
                  rows={3}
                  style={{ ...inp, width:"100%", resize:"vertical", boxSizing:"border-box" }}
                />
              </div>
            ))}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:13 }}>
              <div style={{ fontWeight:700, fontSize:11, color:muted, letterSpacing:1, marginBottom:10 }}>CHECKLIST JOUR J</div>
              {CHECKLIST_ITEMS.map((item,i) => {
                const key=`cl_${i}`, checked=p2notes[key]==="1"
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <button onClick={()=>handleP2Note(key, checked?"0":"1")} style={{ width:22, height:22, borderRadius:5, border:`2px solid ${checked?"#10b981":border}`, background:checked?"#10b981":"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {checked&&<Ico n="check" s={12} c="#fff" />}
                    </button>
                    <span style={{ fontSize:13, color:checked?muted:text, textDecoration:checked?"line-through":"none" }}>{item}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══ EXAMEN BLANC ══ */}
        {tab==="exam" && (
          <div>
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:14, marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:11, color:muted, letterSpacing:1, marginBottom:6 }}>MODE EXAMEN BLANC — PSY0 (1H30)</div>
              <div style={{ fontSize:12, color:muted, marginBottom:14 }}>Simule les conditions réelles du PSY0 dans l'ordre officiel.</div>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
                <div style={{ background:dark?"#0a1020":"#e8f0ff", border:`2px solid ${examOn?"#10b981":border}`, borderRadius:16, padding:"28px 50px", textAlign:"center", minWidth:260 }}>
                  <div style={{ fontSize:10, color:muted, letterSpacing:3, marginBottom:6 }}>TEMPS RESTANT</div>
                  <div style={{ fontSize:56, fontWeight:800, fontFamily:"monospace", color:examTimer<600?"#ef4444":examOn?"#10b981":text, letterSpacing:3 }}>{fmt(examTimer)}</div>
                  <div style={{ fontSize:12, color:muted, marginTop:6 }}>
                    Épreuve {examStep+1}/{PSY0_EXAM_ORDER.length} · {ALL_TESTS.find(t=>t.id===PSY0_EXAM_ORDER[examStep])?.name}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={()=>setExamOn(v=>!v)} style={btn(examOn?"#f59e0b":"#10b981")}>{examOn?"⏸ Pause":"▶ Démarrer"}</button>
                <button onClick={()=>{ if(examStep<PSY0_EXAM_ORDER.length-1) setExamStep(s=>s+1) }} style={btn("#3b82f6")}>Épreuve suivante →</button>
                <button onClick={()=>{ setExamTimer(5400); setExamStep(0); setExamOn(false) }} style={btn(card2,text)}>Reset</button>
              </div>
            </div>
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:10, padding:14 }}>
              <div style={{ fontWeight:700, fontSize:11, color:muted, letterSpacing:1, marginBottom:10 }}>ORDRE DES ÉPREUVES PSY0</div>
              <div style={{ display:"grid", gap:5 }}>
                {PSY0_EXAM_ORDER.map((id,i) => {
                  const test=ALL_TESTS.find(t=>t.id===id), score=getLatest(id), isCurrent=i===examStep
                  return (
                    <div key={id} style={{ display:"flex", alignItems:"center", gap:10, background:isCurrent?(dark?"#0a1a35":"#e8f0ff"):card2, border:`1px solid ${isCurrent?"#3b82f6":border}`, borderRadius:7, padding:"8px 12px" }}>
                      <span style={{ fontWeight:800, fontSize:12, color:isCurrent?"#60a5fa":muted, width:22 }}>{i+1}</span>
                      <span style={{ flex:1, fontSize:13, fontWeight:isCurrent?700:400 }}>{test?.name}</span>
                      {score!==null&&<span style={{ fontSize:13, fontWeight:700, color:scoreColor(score) }}>{score}%</span>}
                      {score===null&&<span style={{ fontSize:11, color:muted }}>—</span>}
                      {isCurrent&&<span style={{ background:"#3b82f6", color:"#fff", fontSize:9, padding:"2px 8px", borderRadius:10 }}>EN COURS</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ TIMER ══ */}
        {tab==="timer" && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 0" }}>
            <div style={{ background:card, border:`2px solid ${timerOn?"#10b981":border}`, borderRadius:16, padding:"36px 56px", textAlign:"center", marginBottom:20, minWidth:260 }}>
              <div style={{ fontSize:9, color:muted, letterSpacing:3, marginBottom:8 }}>SESSION EN COURS</div>
              <div style={{ fontSize:60, fontWeight:800, fontFamily:"monospace", color:timerOn?"#60a5fa":text, letterSpacing:3 }}>{fmt(timer)}</div>
              {timerLabel&&<div style={{ fontSize:13, color:"#60a5fa", marginTop:8 }}>{timerLabel}</div>}
            </div>
            <input placeholder="Épreuve travaillée..." value={timerLabel} onChange={e=>setTimerLabel(e.target.value)} style={{ ...inp, width:260, textAlign:"center", marginBottom:14 }} />
            <div style={{ display:"flex", gap:10, marginBottom:24 }}>
              <button onClick={()=>setTimerOn(v=>!v)} style={btn(timerOn?"#f59e0b":"#3b82f6")}>{timerOn?"⏸ Pause":"▶ Démarrer"}</button>
              <button onClick={()=>{setTimer(0);setTimerOn(false)}} style={btn(card2,text)}>Reset</button>
            </div>
            <div style={{ color:muted, fontSize:12, marginBottom:10 }}>Presets</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
              {[["PSY0 complet",90],["PSY1 session",60],["PSY2 prépa",30],["Focus court",20]].map(([label,min]) => (
                <button key={label} onClick={()=>{setTimer(min*60);setTimerLabel(label);setTimerOn(false)}} style={{ background:card2, border:`1px solid ${border}`, borderRadius:7, padding:"7px 14px", cursor:"pointer", color:text, fontSize:12 }}>
                  {label} · {min}min
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
      <div style={{ textAlign:"center", padding:"16px 0 24px", color:muted, fontSize:10, letterSpacing:2 }}>CADET AF TRACKER · OBJECTIF {TARGET}% · FIN AOÛT 2026</div>
    </div>
  )
}
