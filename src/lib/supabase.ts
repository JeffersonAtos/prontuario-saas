import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Cliente público (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para componentes React
export const createSupabaseClient = () => createClientComponentClient()

// ============================================
// AUTENTICAÇÃO
// ============================================

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// ============================================
// PACIENTES (CRUD)
// ============================================

export async function createPatient(patientData: {
  clinic_id: string
  org_id: string
  name: string
  birth_date: string
  contact_phone: string
  contact_email?: string
}) {
  const { data, error } = await supabase
    .from('patients')
    .insert(patientData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPatientsByClinic(clinicId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getPatientById(patientId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single()

  if (error) throw error
  return data
}

// ============================================
// CONSULTAS (APPOINTMENTS)
// ============================================

export async function createAppointment(appointmentData: {
  org_id: string
  clinic_id: string
  patient_id: string
  professional_id: string
  datetime: string
}) {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAppointmentsByClinic(clinicId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patients (*),
      users:professional_id (name)
    `)
    .eq('clinic_id', clinicId)
    .order('datetime', { ascending: false })

  if (error) throw error
  return data
}

// ============================================
// TOKENS DE ACESSO
// ============================================

export async function createAccessToken(appointmentId: string) {
  // Gerar token aleatório
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15)
  
  const tokenHash = btoa(token) // Simple hash para demo
  
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 4) // Expira em 4h

  const { data, error } = await supabase
    .from('access_tokens')
    .insert({
      appointment_id: appointmentId,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single()

  if (error) throw error
  
  return { token, tokenData: data }
}

export async function validateAccessToken(token: string) {
  const tokenHash = btoa(token)
  
  const { data, error } = await supabase
    .from('access_tokens')
    .select('*, appointments(*)')
    .eq('token_hash', tokenHash)
    .is('revoked_at', null)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error) return null
  return data
}

export async function revokeAccessToken(tokenId: string) {
  const { error } = await supabase
    .from('access_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', tokenId)

  if (error) throw error
}

// ============================================
// SUBMISSÕES (Respostas do questionário)
// ============================================

export async function createSubmission(submissionData: {
  org_id: string
  clinic_id: string
  form_id: string
  patient_id: string
  appointment_id: string
  answers_json: any
  scores_json?: any
}) {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      ...submissionData,
      status: 'draft'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSubmission(submissionId: string, updates: {
  answers_json?: any
  scores_json?: any
  status?: string
  submitted_at?: string
}) {
  const { data, error } = await supabase
    .from('submissions')
    .update(updates)
    .eq('id', submissionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSubmissionsByPatient(patientId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*, appointments(*)')
    .eq('patient_id', patientId)
    .eq('status', 'submitted')
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getSubmissionById(submissionId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      patients (*),
      appointments (*)
    `)
    .eq('id', submissionId)
    .single()

  if (error) throw error
  return data
}

// ============================================
// ALERTAS
// ============================================

export async function createAlert(alertData: {
  submission_id: string
  domain: string
  severity: 'critical' | 'moderate'
  reason_text: string
}) {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alertData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAlertsBySubmission(submissionId: string) {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('submission_id', submissionId)
    .order('severity', { ascending: false })

  if (error) throw error
  return data
}

// ============================================
// NOTAS CLÍNICAS
// ============================================

export async function createClinicalNote(noteData: {
  org_id: string
  clinic_id: string
  patient_id: string
  appointment_id: string
  author_id: string
  content_text: string
}) {
  const { data, error } = await supabase
    .from('clinical_notes')
    .insert({
      ...noteData,
      version: 1
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// LOGS DE AUDITORIA
// ============================================

export async function logAudit(auditData: {
  org_id: string
  clinic_id: string | null
  actor_id: string
  action: string
  entity_type: string
  entity_id: string
  ip?: string | null
  user_agent?: string | null
}) {
  const { error } = await supabase
    .from('audit_logs')
    .insert(auditData)

  if (error) console.error('Erro ao gravar log de auditoria:', error)
}
