'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PacienteDetalhePage({ params }: { params: { id: string } }) {
  const [notaClinica, setNotaClinica] = useState('')
  const [modoComparacao, setModoComparacao] = useState(false)

  // Dados simulados (depois virá do Supabase)
  const paciente = {
    id: params.id,
    nome: 'João Silva',
    idade: 42,
    peso: 85,
    altura: 1.75,
    dataConsulta: '15/10/2025',
  }

  const scores = {
    sono: 3,
    estresse: 9,
    atividadeFisica: 7,
    alimentacao: 8,
    intestino: 4,
    energia: 5,
    hormonios: 6,
  }

  const alertas = [
    {
      tipo: 'critical',
      pilar: 'Sono',
      score: 3,
      motivo: 'Sono crítico: dorme <6h + acorda 3-4x/noite + usa medicação',
    },
    {
      tipo: 'critical',
      pilar: 'Estresse',
      score: 9,
      motivo: 'Estresse muito alto (9/10): trabalho + problemas financeiros',
    },
    {
      tipo: 'moderate',
      pilar: 'Intestino',
      score: 4,
      motivo: 'Intestino irregular: fezes ressecadas (Bristol 1-2) + dor abdominal',
    },
  ]

  const respostas = {
    motivo: 'Cansaço extremo e dificuldade para dormir',
    sono_qualidade: 'Durmo muito mal sempre',
    sono_horas: 'Menos de 6h',
    sono_atrapalha: 'Ansiedade e preocupações com trabalho',
    estresse_nivel: '9-10 (muito alto)',
    estresse_fatores: 'Pressão no trabalho, dívidas financeiras',
    medicacoes: 'Rivotril 2mg (para dormir)',
    observacoes: 'Sinto que estou no limite',
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
                <h1 className="text-2xl font-bold text-gray-900">{paciente.nome}</h1>
                <p className="text-sm text-gray-600">
                  {paciente.idade} anos • {paciente.peso}kg • {paciente.altura}m • Consulta: {paciente.dataConsulta}
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
              <span className="text-3xl font-bold text-red-600">2</span>
              <p className="text-sm text-gray-600">Áreas Críticas</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-yellow-600">1</span>
              <p className="text-sm text-gray-600">Moderadas</p>
            </div>
            <div>
              <span className="text-3xl font-bold text-green-600">4</span>
              <p className="text-sm text-gray-600">Estáveis</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar dos 7 Pilares */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Radar - 7 Pilares</h2>
            <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center" style={{ minHeight: '300px' }}>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">🎯 Gráfico Radar (será implementado)</p>
                <div className="text-xs text-left space-y-1 mt-4">
                  <p>💤 Sono: <span className="font-semibold text-red-600">{scores.sono}/10</span></p>
                  <p>😰 Estresse: <span className="font-semibold text-red-600">{scores.estresse}/10</span></p>
                  <p>🏃 Atividade Física: <span className="font-semibold text-green-600">{scores.atividadeFisica}/10</span></p>
                  <p>🥗 Alimentação: <span className="font-semibold text-green-600">{scores.alimentacao}/10</span></p>
                  <p>🚽 Intestino: <span className="font-semibold text-yellow-600">{scores.intestino}/10</span></p>
                  <p>⚡ Energia: <span className="font-semibold text-yellow-600">{scores.energia}/10</span></p>
                  <p>🧬 Hormônios: <span className="font-semibold text-green-600">{scores.hormonios}/10</span></p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setModoComparacao(!modoComparacao)}
              className="mt-4 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              {modoComparacao ? 'Fechar Comparação' : 'Comparar com Consulta Anterior'}
            </button>
          </div>

          {/* Top Alertas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Top Alertas</h2>
            <div className="space-y-4">
              {alertas.map((alerta, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    alerta.tipo === 'critical' 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-yellow-50 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">
                      {alerta.tipo === 'critical' ? '🔴' : '🟡'}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {alerta.pilar} ({alerta.score}/10)
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {alerta.motivo}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparação (se ativado) */}
        {modoComparacao && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Comparação (Últimas 2 Consultas)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Pilar</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-600">15/08/2025</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-600">15/10/2025</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-600">Variação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-sm">💤 Sono</td>
                    <td className="py-3 px-4 text-center text-sm">5</td>
                    <td className="py-3 px-4 text-center text-sm font-semibold text-red-600">3</td>
                    <td className="py-3 px-4 text-center text-sm text-red-600">📉 -2</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-sm">😰 Estresse</td>
                    <td className="py-3 px-4 text-center text-sm">6</td>
                    <td className="py-3 px-4 text-center text-sm font-semibold text-red-600">9</td>
                    <td className="py-3 px-4 text-center text-sm text-red-600">📈 +3</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-sm">🏃 Atividade Física</td>
                    <td className="py-3 px-4 text-center text-sm">8</td>
                    <td className="py-3 px-4 text-center text-sm">7</td>
                    <td className="py-3 px-4 text-center text-sm text-yellow-600">📉 -1</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-sm">🥗 Alimentação</td>
                    <td className="py-3 px-4 text-center text-sm">7</td>
                    <td className="py-3 px-4 text-center text-sm">8</td>
                    <td className="py-3 px-4 text-center text-sm text-green-600">📈 +1</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>🔴 Piora crítica:</strong> Sono (-2), Estresse (+3) • 
                <strong className="ml-2">🟢 Melhora:</strong> Alimentação (+1)
              </p>
            </div>
          </div>
        )}

        {/* Respostas Detalhadas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Respostas do Questionário</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Motivo principal da consulta:</p>
              <p className="text-gray-900 mt-1">{respostas.motivo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Qualidade do sono:</p>
              <p className="text-gray-900 mt-1">{respostas.sono_qualidade}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">O que mais atrapalha o sono:</p>
              <p className="text-gray-900 mt-1">{respostas.sono_atrapalha}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Nível de estresse:</p>
              <p className="text-gray-900 mt-1">{respostas.estresse_nivel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Fatores de estresse:</p>
              <p className="text-gray-900 mt-1">{respostas.estresse_fatores}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Medicações em uso:</p>
              <p className="text-gray-900 mt-1">{respostas.medicacoes}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Observações:</p>
              <p className="text-gray-900 mt-1">{respostas.observacoes}</p>
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
            <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Salvar Rascunho
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Finalizar Nota
            </button>
            <button className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Arquivar Submissão
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
