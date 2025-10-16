'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  validateAccessToken, 
  createSubmission, 
  updateSubmission,
  createAlert,
  revokeAccessToken
} from '@/lib/supabase'
import { calcularScores, gerarAlertas } from '@/lib/calculos'

export default function PacientePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [tokenValido, setTokenValido] = useState<boolean | null>(null)
  const [tokenData, setTokenData] = useState<any>(null)
  const [etapa, setEtapa] = useState(0)
  const [respostas, setRespostas] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  // Validar token ao carregar
  useEffect(() => {
    if (token) {
      validarToken()
    } else {
      setTokenValido(false)
    }
  }, [token])

  const validarToken = async () => {
    try {
      const data = await validateAccessToken(token!)
      if (data) {
        setTokenValido(true)
        setTokenData(data)
      } else {
        setTokenValido(false)
      }
    } catch (error) {
      setTokenValido(false)
    }
  }

  const handleResposta = (campo: string, valor: any) => {
    setRespostas({ ...respostas, [campo]: valor })
  }

  const proximaEtapa = () => {
    setEtapa(etapa + 1)
  }

  const voltarEtapa = () => {
    setEtapa(etapa - 1)
  }

  const enviarFormulario = async () => {
    if (!tokenData) {
      alert('Erro: Token inválido')
      return
    }

    setLoading(true)
    try {
      // 1. Calcular scores
      const scores = calcularScores(respostas)
      
      // 2. Salvar submissão no banco
      const submission = await createSubmission({
        org_id: tokenData.appointments.org_id,
        clinic_id: tokenData.appointments.clinic_id,
        form_id: '00000000-0000-0000-0000-000000000001', // ID do form padrão
        patient_id: tokenData.appointments.patient_id,
        appointment_id: tokenData.appointments.id,
        answers_json: respostas,
        scores_json: scores
      })

      // 3. Marcar como enviado
      await updateSubmission(submission.id, {
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })

      // 4. Gerar alertas
      const alertas = gerarAlertas(respostas, scores)
      for (const alerta of alertas) {
        await createAlert({
          submission_id: submission.id,
          domain: alerta.pilar.toLowerCase(),
          severity: alerta.severidade,
          reason_text: alerta.motivo
        })
      }

      // 5. Revogar token
      await revokeAccessToken(tokenData.id)

      alert('✅ Formulário enviado com sucesso!\n\nObrigado por preencher. O médico já pode visualizar suas respostas.')
      
      // Redirecionar para página de agradecimento
      setEtapa(5)
      
    } catch (error: any) {
      console.error('Erro ao enviar:', error)
      alert('Erro ao enviar formulário: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Token inválido ou expirado
  if (tokenValido === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Inválido</h1>
          <p className="text-gray-600 mb-6">
            Este link de acesso é inválido ou já foi utilizado. Entre em contato com a clínica para receber um novo link.
          </p>
        </div>
      </div>
    )
  }

  // Carregando validação
  if (tokenValido === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Validando acesso...</p>
        </div>
      </div>
    )
  }

  // Formulário enviado
  if (etapa === 5) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Formulário Enviado!</h1>
          <p className="text-gray-600 mb-6">
            Obrigado por preencher o questionário. Suas respostas foram enviadas com sucesso para o médico.
          </p>
          <p className="text-sm text-gray-500">
            Você pode fechar esta página agora.
          </p>
        </div>
      </div>
    )
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
              <span>{Math.round((etapa / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(etapa / 4) * 100}%` }}
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
                Este questionário levará cerca de 15-20 minutos.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo principal da consulta *
                  </label>
                  <textarea
                    value={respostas.motivo || ''}
                    onChange={(e) => handleResposta('motivo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Descreva brevemente o motivo da sua consulta..."
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {etapa === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">1. SONO</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Como você avalia a qualidade do seu sono? *
                </label>
                <div className="space-y-2">
                  {['Durmo muito bem sempre', 'Na maioria das vezes durmo bem', 'Na maioria das vezes durmo mal', 'Durmo muito mal sempre'].map((opcao) => (
                    <label key={opcao} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sono_qualidade"
                        value={opcao}
                        checked={respostas.sono_qualidade === opcao}
                        onChange={(e) => handleResposta('sono_qualidade', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-gray-700">{opcao}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantas horas dorme por noite? *
                </label>
                <div className="space-y-2">
                  {['Menos de 6h', '6-7h', '7-8h', 'Mais de 8h'].map((opcao) => (
                    <label key={opcao} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sono_horas"
                        value={opcao}
                        checked={respostas.sono_horas === opcao}
                        onChange={(e) => handleResposta('sono_horas', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-gray-700">{opcao}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acorda durante a noite? *
                </label>
                <div className="space-y-2">
                  {['Nunca', '1-2 vezes', '3-4 vezes', 'Mais de 4 vezes'].map((opcao) => (
                    <label key={opcao} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sono_acorda"
                        value={opcao}
                        checked={respostas.sono_acorda === opcao}
                        onChange={(e) => handleResposta('sono_acorda', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-gray-700">{opcao}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usa remédios para dormir? *
                </label>
                <div className="space-y-2">
                  {['Sim, regularmente', 'Às vezes', 'Nunca'].map((opcao) => (
                    <label key={opcao} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sono_remedio"
                        value={opcao}
                        checked={respostas.sono_remedio === opcao}
                        onChange={(e) => handleResposta('sono_remedio', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-gray-700">{opcao}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  O que mais atrapalha seu sono?
                </label>
                <textarea
                  value={respostas.sono_atrapalha || ''}
                  onChange={(e) => handleResposta('sono_atrapalha', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva..."
                />
              </div>
            </div>
          )}

          {etapa === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">2. ESTRESSE E ANSIEDADE</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu nível de estresse atual (0 a 10) *
                </label>
                <div className="space-y-2">
                  {['0-2 (muito baixo)', '3-4 (baixo)', '5-6 (moderado)', '7-8 (alto)', '9-10 (muito alto)'].map((opcao) => (
                    <label key={opcao} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="estresse_nivel"
                        value={opcao}
                        checked={respostas.estresse_nivel === opcao}
                        onChange={(e) => handleResposta('estresse_nivel', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-gray-700">{opcao}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principais fatores de estresse na sua vida
                </label>
                <textarea
                  value={respostas.estresse_fatores || ''}
                  onChange={(e) => handleResposta('estresse_fatores', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva..."
                />
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">3. DADOS COMPLEMENTARES</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    value={respostas.peso || ''}
                    onChange={(e) => handleResposta('peso', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="70"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (m) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={respostas.altura || ''}
                    onChange={(e) => handleResposta('altura', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1.75"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicações em uso
                </label>
                <textarea
                  value={respostas.medicacoes || ''}
                  onChange={(e) => handleResposta('medicacoes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Liste suas medicações..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações adicionais
                </label>
                <textarea
                  value={respostas.observacoes || ''}
                  onChange={(e) => handleResposta('observacoes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Algo mais que gostaria de compartilhar..."
                />
              </div>
            </div>
          )}

          {etapa === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Revisão Final</h2>
              <p className="text-gray-600">Revise suas respostas antes de enviar</p>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Motivo da consulta:</p>
                  <p className="text-gray-900">{respostas.motivo || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Qualidade do sono:</p>
                  <p className="text-gray-900">{respostas.sono_qualidade || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Nível de estresse:</p>
                  <p className="text-gray-900">{respostas.estresse_nivel || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Peso/Altura:</p>
                  <p className="text-gray-900">{respostas.peso || '-'} kg / {respostas.altura || '-'} m</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Após enviar, você não poderá mais editar suas respostas.
                </p>
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {etapa > 0 && etapa < 5 && (
              <button
                onClick={voltarEtapa}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Voltar
              </button>
            )}
            
            {etapa < 4 ? (
              <button
                onClick={proximaEtapa}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Próximo
              </button>
            ) : etapa === 4 ? (
              <button
                onClick={enviarFormulario}
                disabled={loading}
                className="ml-auto px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar Formulário'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
