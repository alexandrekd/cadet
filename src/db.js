import { supabase } from './supabase.js'

// ── SCORES ────────────────────────────────────────────────────────────────────

export async function fetchScores() {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) { console.error(error); return {} }
  // group by test_id => { test_id: [{score, note, date}] }
  return data.reduce((acc, row) => {
    if (!acc[row.test_id]) acc[row.test_id] = []
    acc[row.test_id].push({ id: row.id, score: row.score, note: row.note, date: row.date })
    return acc
  }, {})
}

export async function addScore(test_id, score, note) {
  const { data, error } = await supabase
    .from('scores')
    .insert({ test_id, score, note, date: new Date().toLocaleDateString('fr-FR') })
    .select()
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function deleteScore(id) {
  const { error } = await supabase.from('scores').delete().eq('id', id)
  if (error) console.error(error)
}

// ── SESSIONS ──────────────────────────────────────────────────────────────────

export async function fetchSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data
}

export async function addSession(phase, test_id, duration, score, note) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ phase, test_id, duration, score, note, date: new Date().toLocaleDateString('fr-FR') })
    .select()
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function deleteSession(id) {
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) console.error(error)
}

// ── TEST NOTES ────────────────────────────────────────────────────────────────

export async function fetchTestNotes() {
  const { data, error } = await supabase.from('test_notes').select('*')
  if (error) { console.error(error); return {} }
  return data.reduce((acc, row) => { acc[row.test_id] = row.content; return acc }, {})
}

export async function upsertTestNote(test_id, content) {
  const { error } = await supabase
    .from('test_notes')
    .upsert({ test_id, content, updated_at: new Date().toISOString() }, { onConflict: 'test_id' })
  if (error) console.error(error)
}

// ── P2 NOTES ─────────────────────────────────────────────────────────────────

export async function fetchP2Notes() {
  const { data, error } = await supabase.from('p2notes').select('*')
  if (error) { console.error(error); return {} }
  return data.reduce((acc, row) => { acc[row.key] = row.content; return acc }, {})
}

export async function upsertP2Note(key, content) {
  const { error } = await supabase
    .from('p2notes')
    .upsert({ key, content, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) console.error(error)
}
