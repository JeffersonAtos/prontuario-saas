'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts'

interface RadarProps {
  scores: {
    sono: number
    estresse: number
    atividadeFisica: number
    alimentacao: number
    intestino: number
    energia: number
    hormonios: number
  }
  title?: string
  showLegend?: boolean
}

export default function RadarComponent({ scores, title, showLegend = true }: RadarProps) {
  // Transformar os scores em formato para o gráfico
  const data = [
    { pilar: 'Sono', valor: scores.sono, fullMark: 10 },
    { pilar: 'Estresse', valor: scores.estresse, fullMark: 10 },
    { pilar: 'Ativ. Física', valor: scores.atividadeFisica, fullMark: 10 },
    { pilar: 'Alimentação', valor: scores.alimentacao, fullMark: 10 },
    { pilar: 'Intestino', valor: scores.intestino, fullMark: 10 },
    { pilar: 'Energia', valor: scores.energia, fullMark: 10 },
    { pilar: 'Hormônios', valor: scores.hormonios, fullMark: 10 },
  ]

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="pilar" 
            tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]} 
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <Radar
            name="Score"
            dataKey="valor"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          {showLegend && (
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
          )}
        </RadarChart>
      </ResponsiveContainer>

      {/* Legenda de cores */}
      <div className="flex justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Crítico (≤3)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">Moderado (4-6)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Bom (≥7)</span>
        </div>
      </div>
    </div>
  )
}

// Componente alternativo simples (se recharts não funcionar)
export function RadarSimples({ scores }: RadarProps) {
  const pilares = [
    { nome: '💤 Sono', valor: scores.sono },
    { nome: '😰 Estresse', valor: scores.estresse },
    { nome: '🏃 Atividade Física', valor: scores.atividadeFisica },
    { nome: '🥗 Alimentação', valor: scores.alimentacao },
    { nome: '🚽 Intestino', valor: scores.intestino },
    { nome: '⚡ Energia', valor: scores.energia },
    { nome: '🧬 Hormônios', valor: scores.hormonios },
  ]

  const getCor = (valor: number) => {
    if (valor <= 3) return 'bg-red-500'
    if (valor <= 6) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-4">
      {pilares.map((pilar) => (
        <div key={pilar.nome}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{pilar.nome}</span>
            <span className="text-sm font-semibold text-gray-900">{pilar.valor}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getCor(pilar.valor)}`}
              style={{ width: `${(pilar.valor / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
