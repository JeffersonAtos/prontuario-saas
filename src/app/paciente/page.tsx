'use client'

import { useState } from 'react'

export default function PacientePage() {
  const [etapa, setEtapa] = useState(0)
  const [respostas, setRespostas] = useState<any>({})

  const handleResposta = (campo: string, valor: any) => {
    setRespostas({ ...respostas, [campo]: valor })
  }

  const proximaEtapa = () => {
    setEtapa(etapa + 1)
  }

  const voltarEtapa = () => {
    setEtapa(etapa - 1)
  }

  const enviarFormulario = () => {
    alert('Formulário enviado com sucesso!')
    console.log('Respostas:', respostas)
    // TODO: Enviar para Supabase
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Questionário de Pré-Consulta</h1>
          <p className="text-gray-600 mt-2">Preencha com atenção para ajudar seu médico</p>
          
          {/* Barra de progresso */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso</span>
              <span>{Math.round((etapa / 7) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(etapa / 7) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Conteúdo das etapas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {etapa === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Bem-vindo!</h2>
              <p className="text-gray-600">
                Este questionário levará cerca de 15-20 minutos. Você pode salvar e voltar depois se precisar.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo principal da consulta
                  </label>
                  <textarea
                    value={respostas.motivo || ''}
                    onChange={(e) => handleResposta('motivo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Descreva brevemente o motivo da sua consulta..."
                  />
                </div>
              </div>
            </div>
          )}
