'use client'

interface Alerta {
  pilar: string
  severidade: 'critical' | 'moderate'
  score: number
  motivo: string
}

interface AlertasProps {
  alertas: Alerta[]
  maxAlertas?: number
  showTitle?: boolean
}

export default function Alertas({ alertas, maxAlertas = 5, showTitle = true }: AlertasProps) {
  const alertasExibir = alertas.slice(0, maxAlertas)

  if (alertasExibir.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <p className="text-green-800 font-medium">Nenhum alerta crítico ou moderado</p>
        <p className="text-green-600 text-sm mt-1">Todos os pilares estão em bom estado</p>
      </div>
    )
  }

  return (
    <div>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top {alertasExibir.length} Alertas
        </h3>
      )}
      
      <div className="space-y-4">
        {alertasExibir.map((alerta, index) => (
          <AlertaCard key={index} alerta={alerta} />
        ))}
      </div>

      {alertas.length > maxAlertas && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver mais {alertas.length - maxAlertas} alerta(s) →
          </button>
        </div>
      )}
    </div>
  )
}

// Card individual de alerta
function AlertaCard({ alerta }: { alerta: Alerta }) {
  const isCritical = alerta.severidade === 'critical'
  
  const corBorda = isCritical ? 'border-red-500' : 'border-yellow-500'
  const corFundo = isCritical ? 'bg-red-50' : 'bg-yellow-50'
  const corTexto = isCritical ? 'text-red-900' : 'text-yellow-900'
  const emoji = isCritical ? '🔴' : '🟡'

  return (
    <div className={`${corFundo} rounded-lg border-l-4 ${corBorda} p-4`}>
      <div className="flex items-start">
        <span className="text-2xl mr-3 flex-shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className={`font-semibold ${corTexto}`}>
              {alerta.pilar} ({alerta.score}/10)
            </p>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              isCritical ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isCritical ? 'CRÍTICO' : 'MODERADO'}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {alerta.motivo}
          </p>
        </div>
      </div>
    </div>
  )
}

// Componente de resumo de alertas (para dashboard)
export function ResumoAlertas({ alertas }: { alertas: Alerta[] }) {
  const criticos = alertas.filter(a => a.severidade === 'critical').length
  const moderados = alertas.filter(a => a.severidade === 'moderate').length
  const estaveis = 7 - alertas.length // assume 7 pilares

  return (
    <div className="flex items-center space-x-8">
      <div>
        <span className="text-3xl font-bold text-red-600">{criticos}</span>
        <p className="text-sm text-gray-600">Áreas Críticas</p>
      </div>
      <div>
        <span className="text-3xl font-bold text-yellow-600">{moderados}</span>
        <p className="text-sm text-gray-600">Moderadas</p>
      </div>
      <div>
        <span className="text-3xl font-bold text-green-600">{estaveis}</span>
        <p className="text-sm text-gray-600">Estáveis</p>
      </div>
    </div>
  )
}

// Badge simples de alerta
export function AlertaBadge({ severidade }: { severidade: 'critical' | 'moderate' | 'info' }) {
  if (severidade === 'critical') {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        🔴 Crítico
      </span>
    )
  }
  
  if (severidade === 'moderate') {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        🟡 Moderado
      </span>
    )
  }
  
  return (
    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
      🟢 Estável
    </span>
  )
}
