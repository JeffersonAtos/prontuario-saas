import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Prontuário Pré-Consulta
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Sistema de pré-consulta e evolução clínica multi-clínica
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/login" 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Entrar no Sistema
          </Link>
          
          <Link 
            href="/paciente" 
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Acessar como Paciente
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>MVP - Fase 1 | Português</p>
        </div>
      </div>
    </div>
  )
}
