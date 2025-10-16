'use client'

export default function Error() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro</h1>
        <p className="text-gray-600">Ocorreu um erro ao carregar a página.</p>
      </div>
    </div>
  )
}
