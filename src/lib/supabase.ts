import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Cliente público (usado no browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados (TypeScript)
export type Database = {
  orgs: {
    id: string
    nome: string
    status: string
    created_at: string
  }
  clinics: {
    id: string
    org_id: string
    nome: string
    logo_url: string | null
    palette_json: any
    terms_text: string
    status: string
    created_at: string
  }
  users: {
    id: string
    org_id: string
    email: string
    name: string
    password_hash: string
    mfa_enabled: boolean
    role: 'super_admin' | 'clinic_admin' | 'doctor' | 'receptionist'
    clinic_id: string | null
    last_login: string | null
  }
  patients: {
    id: string
    org_id: string
    clinic_id: string
    name: string
    birth_date: string
    doc_hash: string
    contact_phone: string
    contact_email: string | null
    status: string
    created_at: string
  }
  appointments: {
    id: string
    org_id: string
    clinic_id: string
    patient_id: string
    professional_id: string
    datetime: string
    status: 'scheduled' | 'completed' | 'cancelled'
    created_at: string
  }
  submissions: {
    id: string
    org_id: string
    clinic_id: string
    form_id: string
    form_version: string
    patient_id: string
    appointment_id: string
    answers_json: any
    scores_json: any
    status: 'draft' | 'submitted' | 'archived'
    submitted_at: string | null
    ip: string | null
    user_agent: string | null
    created_at: string
  }
  clinical_notes: {
    id: string
    org_id: string
    clinic_id: string
    patient_id: string
    appointment_id: string
    author_id: string
    content_text: string
    version: number
    created_at: string
  }
  access_tokens: {
    id: string
    appointment_id: string
    token_hash: string
    expires_at: string
    used_at: string | null
    revoked_at: string | null
  }
  alerts: {
    id: string
    submission_id: string
    domain: string
    severity: 'critical' | 'moderate'
    reason_text: string
    created_at: string
  }
  audit_logs: {
    id: string
    org_id: string
    clinic_id: string | null
    actor_id: string
    action: string
    entity_type: string
    entity_id: string
    ip: string | null
    user_agent: string | null
    created_at: string
  }
}

// Funções auxiliares
export async function getPatients(clinicId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getSubmission(submissionId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*, patients(*), appointments(*)')
    .eq('id', submissionId)
    .single()

  if (error) throw error
  return data
}

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
      version: 1,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

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
