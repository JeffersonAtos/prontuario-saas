'use client'

import { useState, useEffect } from 'react'
import { 
  createPatient, 
  createAppointment, 
  createAccessToken,
  getAppointmentsByClinic,
  getPatientsByClinic
} from '@/lib/supabase'

export default function RecepcaoPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pacientes, setPacientes] = useState<any[]>([])
  const [consultas, setConsultas] = useState<any[]>([])
  
  // Dados do formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [dataConsulta, setDataConsulta] = useState('')
  const [horaConsulta, setHoraConsulta] = useState('')

  // IDs fixos para o MVP (depois virá do contexto de autenticação)
  const CLINIC_ID = '00000000-0000-0000-0000-000000000001' // Simulado
  const ORG_ID = '00000000-0000-0000-0000-000000000001' // Simulado
  const PROFESSIONAL_ID = '00000000-0000-0000-0000-000000000001' // Simulado

  // Carregar dados ao iniciar
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [pacs, cons] = await Promise.all([
        getPatientsByClinic(CLINIC_ID),
        getAppointmentsByClinic(CLINIC_ID)
      ])
      setPacientes(pacs || [])
      setConsultas(cons || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleCadastrar = async () => {
    if (!nome || !telefone || !dataNascimento || !dataConsulta || !horaConsulta) {
      alert('Preencha todos os campos obrigatórios!')
      return
    }

    setLoading(true)
    try {
      // 1. Criar paciente
      const paciente = await createPatient({
        clinic_id: CLINIC_ID,
        org_id: ORG_ID,
        name: nome,
        birth_date: dataNascimento,
        contact_phone: telefone,
        contact_email: email || undefined
      })

      // 2. Criar consulta
      const datetime = `${dataConsulta}T${horaConsulta}:00`
      const consulta = await createAppointment({
        org_id: ORG_ID,
        clinic_id: CLINIC_ID,
        patient_id: paciente.id,
        professional_id: PROFESSIONAL_ID,
        datetime
      })

      // 3. Gerar token de acesso
      const { token } = await createAccessToken(consulta.id)
      
      // 4. Gerar link (por enquanto simples, depois integramos WhatsApp)
      const link = `${window.location.origin}/paciente?token=${token}`
      
      alert(`✅ Paciente cadastrado!\n\nLink de acesso:\n${link}\n\n(Copie e envie para o paciente)`)
      
      // Limpar formulário
      setNome('')
      setEmail('')
      setTelefone('')
      setDataNascimento('')
      setDataConsulta('')
      setHoraConsulta('')
      setMostrarFormulario(false)
      
      // Recarregar lista
      await carregarDados()
      
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error)
      alert('Erro ao cadastrar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatarData = (datetime: string) => {
    return new Date(datetime).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recepção</h1>
              <p className="text-sm text-gray-600">Gestão de pacientes e consultas</p>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Botão Novo Paciente */}
        <div className="mb-6">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            + Novo Paciente / Agendar Consulta
          </button>
        </div>

        {/* Formulário de Cadastro */}
        {mostrarFormulario && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Cadastrar Novo Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="João da Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="joao@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Consulta *
                </label>
                <input
                  type="date"
                  value={dataConsulta}
                  onChange={(e) => setDataConsulta(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário *
                </label>
                <input
                  type="time"
                  value={horaConsulta}
                  onChange={(e) => setHoraConsulta(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setMostrarFormulario(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleCadastrar}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar e Gerar Link'}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Consultas */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Consultas Agendadas ({consultas.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            {consultas.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Nenhuma consulta agendada ainda.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultas.map((consulta) => (
                    <tr key={consulta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {consulta.patients?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {consulta.patients?.contact_phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatarData(consulta.datetime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          consulta.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : consulta.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {consulta.status === 'scheduled' ? 'Agendado' : 
                           consulta.status === 'completed' ? 'Concluído' : 'Cancelado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
