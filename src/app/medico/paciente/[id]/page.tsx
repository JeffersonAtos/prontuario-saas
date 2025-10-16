'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  getSubmissionsByPatient, 
  getPatientById,
  getAlertsBySubmission,
  createClinicalNote
} from '@/lib/supabase'

export default function PacienteDetalhePage({ params }: { params: { id: string } }) {
  const [paciente, setPaciente] = useState<any>(null)
  const [submissoes, setSubmissoes] = useState<any[]>([])
  const [submissaoAtual, setSubmissaoAtual] = useState<any>(null)
  const [alertas, setAlertas] = useState<any[]>([])
  const [notaClinica, setNotaClinica] = useState('')
  const [loading, setLoading] = useState(true)
  const [salvandoNota, setSalvandoNota] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [params.id])

  const carregarDados = async () => {
    try {
      // Carregar paciente
      const pac = await getPatientById(params.id)
      setPaciente(pac)

      // Carregar submissões
      const subs = await getSubmissionsByPatient(params.id)
      setSubmissoes(subs || [])

      if (subs && subs.length > 0) {
        // Carregar submissão mais recente
        const ultima = subs[0]
        setSubmissaoAtual(ultima)

        // Carregar alertas
        const alts = await getAlertsBySubmission(ultima.id)
        setAlertas(alts || [])
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados do paciente')
    } finally {
      setLoading(false)
    }
  }

  const salvarNota = async () => {
    if (!notaClinica.trim()) {
      alert('Digite uma nota clínica antes de salvar')
      return
    }

    setSalvandoNota(true)
    try {
      await createClinicalNote({
        org_id: submissaoAtual.org_id,
        clinic_id: submissaoAtual.clinic_id,
        patient_id: params.id,
        appointment_id: submissaoAtual.appointment_id,
        author_id: '00000000-0000-0000-0000-000000000001', // Simulado
        content_text: notaClinica
      })

      alert('✅ Nota clínica salva com sucesso!')
      setNotaClinica('')

    } catch (error: any) {
      console.error('Erro ao salvar nota:', error)
      alert('Erro ao salvar nota: ' + error.message)
    } finally {
      setSalvandoNota(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Carregando dados do paciente...</p>
        </div>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600">Paciente não encontrado</p>
        </div>
      </div>
    )
  }

  if (submissoes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Link href="/medico" className="text-blue-600 hover:text-blue-800">
                ← Voltar
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{paciente.name}</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-yellow-800 font-medium">
              Paciente ainda não preencheu o questionário de pré-consulta.
            </p>
          </div>
        </main>
      </div>
    )
  }

  const scores = submissaoAtual?.scores_json || {}
  const respostas = submissaoAtual?.answers_json || {}

  const calcularIdade = (birthDate: string) => {
    const hoje = new Date()
    const nascimento = new Date(birthDate)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/medico" className="text-blue-600 hover:text-blue-800">
                ← Voltar
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{paciente.name}</h1>
                <p className="text-sm text-gray-600">
                  {calcularIdade(paciente.birth_date)} anos • 
                  Última consulta: {new Date(submissaoAtual.submitted_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Resumo Executivo */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Resumo Executivo</h2>
          <div className="flex items-center space-x-8">
            <div>
              <span className="text-3xl font-bold text-red-600">
                {alertas.filter(a => a.severity === 'critical').length}
              </span>
              <p className="text-sm text-gray-600">Áreas Críticas</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-yellow-600">
                {alertas.filter(a => a.severity === 'moderate').length}
              </span>
              <p className="text-sm text-gray-600">Moderadas</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-green-600">
                {7 - alertas.length}
              </span>
              <p className="text-sm text-gray-600">Estáveis</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar dos 7 Pilares */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Radar - 7 Pilares</h2>
            <div className="space-y-3">
              {[
                { nome: '💤 Sono', valor: scores.sono || 0 },
                { nome: '😰 Estresse', valor: scores.estresse || 0 },
                { nome: '🏃 Atividade Física', valor: scores.atividadeFisica || 0 },
                { nome: '🥗 Alimentação', valor: scores.alimentacao || 0 },
                { nome: '🚽 Intestino', valor: scores.intestino || 0 },
                { nome: '⚡ Energia', valor: scores.energia || 0 },
                { nome: '🧬 Hormônios', valor: scores.hormonios || 0 },
              ].map((pilar) => {
                const cor = pilar.valor <= 3 ? 'bg-red-500' : pilar.valor <= 6 ? 'bg-yellow-500' : 'bg-green-500'
                return (
                  <div key={pilar.nome}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{pilar.nome}</span>
                      <span className="text-sm font-semibold text-gray-900">{pilar.valor.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${cor}`}
                        style={{ width: `${(pilar.valor / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Alertas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Top Alertas</h2>
            {alertas.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                ✅ Nenhum alerta crítico ou moderado
              </div>
            ) : (
              <div className="space-y-4">
                {alertas.slice(0, 5).map((alerta, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alerta.severity === 'critical' 
                        ? 'bg-red-50 border-red-500' 
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">
                        {alerta.severity === 'critical' ? '🔴' : '🟡'}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 capitalize">
                          {alerta.domain}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {alerta.reason_text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Respostas Detalhadas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Respostas do Questionário</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Motivo principal da consulta:</p>
              <p className="text-gray-900 mt-1">{respostas.motivo || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Qualidade do sono:</p>
              <p className="text-gray-900 mt-1">{respostas.sono_qualidade || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Horas de sono:</p>
              <p className="text-gray-900 mt-1">{respostas.sono_horas || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">O que atrapalha o sono:</p>
              <p className="text-gray-900 mt-1">{respostas.sono_atrapalha || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Nível de estresse:</p>
              <p className="text-gray-900 mt-1">{respostas.estresse_nivel || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Fatores de estresse:</p>
              <p className="text-gray-900 mt-1">{respostas.estresse_fatores || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Peso / Altura:</p>
              <p className="text-gray-900 mt-1">
                {respostas.peso || '-'} kg / {respostas.altura || '-'} m
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Medicações em uso:</p>
              <p className="text-gray-900 mt-1">{respostas.medicacoes || 'Nenhuma'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Observações:</p>
              <p className="text-gray-900 mt-1">{respostas.observacoes || 'Nenhuma'}</p>
            </div>
          </div>
        </div>

        {/* Nota Clínica */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nota Clínica</h2>
          <textarea
            value={notaClinica}
            onChange={(e) => setNotaClinica(e.target.value)}
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite sua avaliação clínica, conduta e orientações..."
          />
          <div className="flex justify-end space-x-3 mt-4">
            <button 
              onClick={salvarNota}
              disabled={salvandoNota}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {salvandoNota ? 'Salvando...' : 'Salvar Nota'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
