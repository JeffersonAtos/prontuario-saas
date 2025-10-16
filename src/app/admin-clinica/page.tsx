'use client'

import { useState } from 'react'

export default function AdminClinicaPage() {
  const [periodo, setPeriodo] = useState('30d')

  // Dados simulados
  const resumo = {
    pacientesAvaliados: 47,
    comAreasCriticas: 15, // 32%
    topProblemas: ['Sono', 'Estresse', 'Intestino'],
    tendencia: 'melhora', // +0.8 pts
  }

  const radarAgregado = {
    sono: 5.2,
    estresse: 4.8,
    atividadeFisica: 6.8,
    alimentacao: 7.1,
    intestino: 5.9,
    energia: 5.5,
    hormonios: 6.1,
  }

  const topProblemas = [
    { ranking: 1, problema: 'Sono fragmentado', prevalencia: 42, severidade: 3.1, tipo: 'critical' },
    { ranking: 2, problema: 'Estresse alto', prevalencia: 38, severidade: 8.2, tipo: 'critical' },
    { ranking: 3, problema: 'Intestino irregular', prevalencia: 28, severidade: 4.5, tipo: 'moderate' },
    { ranking: 4, problema: 'Fadiga crônica', prevalencia: 25, severidade: 5.8, tipo: 'moderate' },
    { ranking: 5, problema: 'Dificuldade concentração', prevalencia: 22, severidade: 5.2, tipo: 'moderate' },
    { ranking: 6, problema: 'Libido baixa', prevalencia: 18, severidade: 4.1, tipo: 'info' },
    { ranking: 7, problema: 'Ganho de peso', prevalencia: 15, severidade: 3.8, tipo: 'info' },
  ]

  const coocorrencias = [
    { combo: 'Estresse alto + Sono ruim', frequencia: 68 },
    { combo: 'Fadiga + Intestino irregular', frequencia: 45 },
    { combo: 'Libido baixa + Ganho de peso', frequencia: 38 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inteligência da Clínica</h1>
              <p className="text-sm text-gray-600">Visão agregada da saúde dos pacientes</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
              </select>
              <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Resumo Executivo */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Resumo Executivo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">{resumo.pacientesAvaliados}</p>
              <p className="text-sm text-gray-600">Pacientes Avaliados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">{Math.round((resumo.comAreasCriticas / resumo.pacientesAvaliados) * 100)}%</p>
              <p className="text-sm text-gray-600">Com Áreas Críticas</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{resumo.topProblemas.join(', ')}</p>
              <p className="text-sm text-gray-600">Top 3 Pilares Críticos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">↗︎ +0.8</p>
              <p className="text-sm text-gray-600">Tendência (últimos 3 meses)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar Agregado */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Radar Agregado (Média da Clínica)</h2>
            <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center" style={{ minHeight: '300px' }}>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">🎯 Gráfico Radar (será implementado)</p>
                <div className="text-sm text-left space-y-2 mt-4">
                  {Object.entries(radarAgregado).map(([pilar, score]) => {
                    const emoji = {
                      sono: '💤',
                      estresse: '😰',
                      atividadeFisica: '🏃',
                      alimentacao: '🥗',
                      intestino: '🚽',
                      energia: '⚡',
                      hormonios: '🧬',
                    }[pilar]
                    const cor = score >= 7 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-600'
                    return (
                      <p key={pilar}>
                        {emoji} {pilar.charAt(0).toUpperCase() + pilar.slice(1)}: 
                        <span className={`font-semibold ml-2 ${cor}`}>{score.toFixed(1)}/10</span>
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>
            <button className="mt-4 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
              Comparar Segmentos (Homens vs Mulheres)
            </button>
          </div>

          {/* Co-ocorrências */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Co-ocorrências (Problemas Combinados)</h2>
            <div className="space-y-4">
              {coocorrencias.map((item, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">{item.combo}</p>
                    <span className="text-lg font-bold text-blue-600">{item.frequencia}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">dos casos com esses problemas</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Sugestão:</strong> Considere criar campanha sobre "Gestão do Estresse e Higiene do Sono"
              </p>
            </div>
          </div>
        </div>

        {/* Top 10 Problemas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Top 10 Problemas (Ranking por Prevalência × Severidade)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">#</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Problema</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Prevalência</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Severidade Média</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {topProblemas.map((item) => (
                  <tr key={item.ranking} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-semibold">{item.ranking}</td>
                    <td className="py-3 px-4 text-sm">{item.problema}</td>
                    <td className="py-3 px-4 text-center text-sm font-semibold">{item.prevalencia}%</td>
                    <td className="py-3 px-4 text-center text-sm">{item.severidade}/10</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.tipo === 'critical' 
                          ? 'bg-red-100 text-red-800' 
                          : item.tipo === 'moderate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.tipo === 'critical' ? '🔴 Crítico' : item.tipo === 'moderate' ? '🟡 Moderado' : '🟢 Estável'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ações Recomendadas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Ações Recomendadas</h2>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <p className="font-medium text-gray-900">📢 Campanha: Higiene do Sono</p>
              <p className="text-sm text-gray-700 mt-1">
                42% dos pacientes têm sono fragmentado. Considere palestras ou grupos educativos.
              </p>
              <button className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700">
                Criar Campanha
              </button>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <p className="font-medium text-gray-900">📢 Campanha: Gestão do Estresse</p>
              <p className="text-sm text-gray-700 mt-1">
                38% dos pacientes relatam estresse alto. Técnicas de mindfulness podem ajudar.
              </p>
              <button className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700">
                Criar Campanha
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
