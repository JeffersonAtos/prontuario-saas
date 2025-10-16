'use client'

import { useState } from 'react'

export default function SuperAdminPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Dados simulados
  const statusSistema = {
    status: 'operacional',
    latenciaMedia: 120,
    latenciaP95: 180,
    erros24h: 3,
    taxaErro: 0.01,
    submissoesHoje: 47,
  }

  const clientes = [
    {
      orgNome: 'Grupo Saúde ABC',
      clinicas: [
        { nome: 'Clínica Centro', pacientes: 20, submissoes: 15 },
        { nome: 'Clínica Zona Sul', pacientes: 12, submissoes: 8 },
      ],
    },
    {
      orgNome: 'Clínica XYZ',
      clinicas: [
        { nome: 'Clínica Única', pacientes: 35, submissoes: 28 },
      ],
    },
  ]

  const metricas = {
    totalPacientes: 67,
    totalSubmissoes: 51,
    taxaConclusao: 76,
    tempoMedioPreenchimento: 12,
    picoUso: '14h-16h',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-purple-600">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">⚙️ Super Admin - Centro de Comando</h1>
              <p className="text-sm text-gray-600">Gestão do SaaS | Acesso apenas metadados</p>
            </div>
            <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard Global */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">📊 Status do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl">
                  {statusSistema.status === 'operacional' ? '🟢' : '🔴'}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {statusSistema.status === 'operacional' ? 'Operacional' : 'Falha'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Latência Média</p>
              <p className="text-2xl font-semibold text-gray-900">{statusSistema.latenciaMedia}ms</p>
              <p className="text-xs text-gray-500">p95: {statusSistema.latenciaP95}ms</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Erros (24h)</p>
              <p className="text-2xl font-semibold text-gray-900">{statusSistema.erros24h}</p>
              <p className="text-xs text-gray-500">Taxa: {statusSistema.taxaErro}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Submissões Hoje</p>
              <p className="text-2xl font-semibold text-gray-900">{statusSistema.submissoesHoje}</p>
            </div>
            <div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                Ver Logs Detalhados
              </button>
            </div>
          </div>
        </div>

        {/* Botão Novo Cliente */}
        <div className="mb-6">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
          >
            + Criar Novo Cliente
          </button>
        </div>

        {/* Formulário Criar Cliente */}
        {mostrarFormulario && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Criar Novo Cliente</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Organização *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Clínica Exemplo Ltda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Primeira Clínica *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Unidade Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email do Admin da Clínica *
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="admin@clinica.com"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Será gerada uma senha provisória e enviada por email para o admin.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setMostrarFormulario(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Criar Cliente
              </button>
            </div>
          </div>
        )}

        {/* Lista de Clientes */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Clientes (Orgs)</h2>
          </div>
          <div className="p-6 space-y-6">
            {clientes.map((org, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{org.orgNome}</h3>
                <div className="space-y-2">
                  {org.clinicas.map((clinica, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 rounded p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">📍 {clinica.nome}</p>
                        <p className="text-xs text-gray-600">
                          {clinica.pacientes} pacientes • {clinica.submissoes} submissões
                        </p>
                      </div>
                      <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100">
                        Configurar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas Globais */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">📈 Métricas Globais (só números agregados)</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Pacientes Cadastrados</p>
              <p className="text-2xl font-semibold text-gray-900">{metricas.totalPacientes}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Submissões Totais</p>
              <p className="text-2xl font-semibold text-gray-900">{metricas.totalSubmissoes}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
              <p className="text-2xl font-semibold text-gray-900">{metricas.taxaConclusao}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio Preenchimento</p>
              <p className="text-2xl font-semibold text-gray-900">{metricas.tempoMedioPreenchimento} min</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pico de Uso</p>
              <p className="text-2xl font-semibold text-gray-900">{metricas.picoUso}</p>
            </div>
          </div>
        </div>

        {/* Aviso de Privacidade */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 font-medium">
            🔒 IMPORTANTE: Este painel mostra apenas metadados agregados. Você NÃO tem acesso a:
          </p>
          <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
            <li>Respostas de pacientes</li>
            <li>Scores individuais</li>
            <li>Alertas clínicos</li>
            <li>Notas médicas</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
