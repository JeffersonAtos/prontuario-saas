// Cálculo dos scores dos 7 pilares (1-10)
// Baseado nas respostas do questionário

export interface Respostas {
  // Sono
  sono_qualidade?: string
  sono_horario?: string
  sono_horas?: string
  sono_acorda?: string
  sono_remedio?: string
  sono_despertar?: string
  sono_telas?: string
  sono_atrapalha?: string

  // Estresse
  estresse_nivel?: string
  estresse_irritabilidade?: string
  estresse_humor?: string
  estresse_ruidos?: string
  estresse_tristeza?: string
  estresse_decisao?: string
  estresse_medicacao?: string
  estresse_psicoterapia?: string
  estresse_trabalho?: string
  estresse_fatores?: string

  // Outras seções...
  [key: string]: any
}

export interface Scores {
  sono: number
  estresse: number
  atividadeFisica: number
  alimentacao: number
  intestino: number
  energia: number
  hormonios: number
}

// Função principal de cálculo
export function calcularScores(respostas: Respostas): Scores {
  return {
    sono: calcularSono(respostas),
    estresse: calcularEstresse(respostas),
    atividadeFisica: calcularAtividadeFisica(respostas),
    alimentacao: calcularAlimentacao(respostas),
    intestino: calcularIntestino(respostas),
    energia: calcularEnergia(respostas),
    hormonios: calcularHormonios(respostas),
  }
}

// ============================================
// SONO (1-10)
// ============================================
function calcularSono(r: Respostas): number {
  let pontos = 10 // começa com nota máxima

  // Qualidade do sono (-4 a 0 pts)
  if (r.sono_qualidade === 'Durmo muito mal sempre') pontos -= 4
  else if (r.sono_qualidade === 'Na maioria das vezes durmo mal') pontos -= 2
  else if (r.sono_qualidade === 'Na maioria das vezes durmo bem') pontos -= 0.5

  // Horas de sono (-3 a 0 pts)
  if (r.sono_horas === 'Menos de 6h') pontos -= 3
  else if (r.sono_horas === '6-7h') pontos -= 1
  else if (r.sono_horas === 'Mais de 8h') pontos -= 0.5 // excesso também não é ideal

  // Acorda durante a noite (-2 a 0 pts)
  if (r.sono_acorda === 'Mais de 4 vezes') pontos -= 2
  else if (r.sono_acorda === '3-4 vezes') pontos -= 1.5
  else if (r.sono_acorda === '1-2 vezes') pontos -= 0.5

  // Remédio para dormir (-1.5 pts)
  if (r.sono_remedio === 'Sim, regularmente') pontos -= 1.5
  else if (r.sono_remedio === 'Às vezes') pontos -= 0.5

  // Despertar (-1 a 0 pts)
  if (r.sono_despertar === 'Exausto, como se não tivesse dormido') pontos -= 1
  else if (r.sono_despertar === 'Cansado, sinto que precisava de mais horas') pontos -= 0.5

  // Telas antes de dormir (-1 pt)
  if (r.sono_telas === 'Durmo com TV/celular ligado') pontos -= 1
  else if (r.sono_telas === 'Uso até a hora de dormir') pontos -= 0.5

  return Math.max(1, Math.min(10, Math.round(pontos * 10) / 10))
}

// ============================================
// ESTRESSE (1-10)
// ============================================
function calcularEstresse(r: Respostas): number {
  let pontos = 10

  // Nível de estresse (peso maior)
  if (r.estresse_nivel === '9-10 (muito alto)') pontos -= 5
  else if (r.estresse_nivel === '7-8 (alto)') pontos -= 3
  else if (r.estresse_nivel === '5-6 (moderado)') pontos -= 1.5
  else if (r.estresse_nivel === '3-4 (baixo)') pontos -= 0.5

  // Irritabilidade
  if (r.estresse_irritabilidade === 'Diariamente') pontos -= 1.5
  else if (r.estresse_irritabilidade === 'Frequentemente') pontos -= 1

  // Mudanças de humor
  if (r.estresse_humor === 'Frequentemente') pontos -= 1

  // Tristeza sem causa
  if (r.estresse_tristeza === 'Frequentemente') pontos -= 1

  // Poder de decisão
  if (r.estresse_decisao === 'Sim, significativamente') pontos -= 1.5
  else if (r.estresse_decisao === 'Parcialmente') pontos -= 0.5

  // Medicação psiquiátrica (não penaliza, mas indica gravidade)
  if (r.estresse_medicacao === 'Sim') pontos -= 0.5

  return Math.max(1, Math.min(10, Math.round(pontos * 10) / 10))
}

// ============================================
// ATIVIDADE FÍSICA (1-10)
// ============================================
function calcularAtividadeFisica(r: Respostas): number {
  let pontos = 10

  // Frequência de exercícios
  if (r.atividade_frequencia === 'Não me exercito') pontos -= 5
  else if (r.atividade_frequencia === '1-2x por semana') pontos -= 2
  else if (r.atividade_frequencia === '3-4x por semana') pontos -= 0
  else if (r.atividade_frequencia === '5-6x por semana' || r.atividade_frequencia === 'Diariamente') pontos += 0 // ideal

  // Energia durante exercícios
  if (r.atividade_energia === 'Sem energia') pontos -= 2
  else if (r.atividade_energia === 'Pouca energia') pontos -= 1

  // Performance física
  if (r.atividade_performance === 'Piorou significativamente') pontos -= 2
  else if (r.atividade_performance === 'Piorou') pontos -= 1
  else if (r.atividade_performance === 'Melhorou') pontos += 0.5

  // Intolerância ao esforço
  if (r.atividade_intolerancia === 'Frequentemente') pontos -= 1.5
  else if (r.atividade_intolerancia === 'Às vezes') pontos -= 0.5

  return Math.max(1, Math.min(10, Math.round(pontos * 10) / 10))
}

// ============================================
// ALIMENTAÇÃO (1-10)
// ============================================
function calcularAlimentacao(r: Respostas): number {
  let pontos = 10

  // Auto-avaliação (peso maior)
  if (r.alimentacao_avaliacao === '0-3 (muito ruim)') pontos -= 4
  else if (r.alimentacao_avaliacao === '4-6 (regular)') pontos -= 2
  else if (r.alimentacao_avaliacao === '7-8 (boa)') pontos -= 0
  else if (r.alimentacao_avaliacao === '9-10 (excelente)') pontos += 0

  // Consome alimentos prejudiciais (marcar múltiplos)
  const prejudiciais = r.alimentacao_consome || []
  if (prejudiciais.includes('Açúcar refinado')) pontos -= 0.5
  if (prejudiciais.includes('Alimentos processados')) pontos -= 0.5
  if (prejudiciais.includes('Refrigerantes')) pontos -= 0.5
  if (prejudiciais.includes('Álcool')) pontos -= 0.3

  // Frequência de carboidratos
  if (r.alimentacao_carboidratos === 'Em todas as refeições') pontos -= 1
  else if (r.alimentacao_carboidratos === '2-3 refeições por dia') pontos -= 0.3

  // Desejos intensos
  if (r.alimentacao_desejos === 'Doces') pontos -= 0.5
  else if (r.alimentacao_desejos === 'Gordurosos') pontos -= 0.3

  return Math.max(1, Math.min(10, Math.round(pontos * 10) / 10))
}

// ============================================
// INTESTINO (1-10)
// ============================================
function calcularIntestino(r: Respostas): number {
  let pontos = 10

  // Funcionamento
  if (r.intestino_funcionamento === 'Tenho diarreia frequente') pontos -= 3
  else if (r.intestino_funcionamento === 'Sou obstipado na maioria das vezes') pontos -= 2
  else if (r.intestino_funcionamento === 'Vou em dias alternados') pontos -= 0.5

  // Formato (Bristol)
  if (r.intestino_bristol === 'Tipo 1-2 (ressecadas/duras)') pontos -= 2
  else if (r.intestino_bristol === 'Tipo 5-6 (amolecidas)') pontos -= 1
  else if (r.intestino_bristol === 'Tipo 7 (líquidas)') pontos -= 2

  // Sintomas pós-refeição
  const sintomas = r.intestino_sintomas || []
  if (sintomas.includes('Distensão abdominal')) pontos -= 0.5
  if (sintomas.includes('Gases excessivos')) pontos -= 0.5
  if (sintomas.includes('Dor abdominal')) pontos -= 1
  if (sintomas.includes('Azia/queimação')) pontos -= 0.5
  if (sintomas.includes('Refluxo')) pontos -= 0.8

  // Medicamentos (impacto no intestino)
  const meds = r.intestino_medicamentos || []
  if (meds.includes('Antibióticos')) pontos -= 1
  if (meds.includes('Inibidores de bomba de prótons')) pontos -= 0.5
  if (meds.includes('Anti-inflamatórios')) pontos -= 0.3

  return Math.max(1, Math.min(10, Math.round(pontos * 10) / 10))
}

// ============================================
// ENERGIA (MITOCÔNDRIA) (1-10)
// ============================================
function calcularEnergia(r: Respostas): number {
  let pontos = 10

  // Fadiga crônica
  if (r.energia_fadiga === 'Sempre') pontos -= 4
  else if (r.energia_fadiga === 'Frequentemente') pontos -= 2
  else if (r.energia_fadiga === 'Raramente') pontos -= 0.5

  // Fraqueza muscular
  if (r.energia_fraqueza === 'Frequentemente') pontos -= 1.5
  else if (r.energia_fraqueza === 'Às vezes') pontos -= 0.5

  // Cansaço ao longo do dia
  if (r.energia_cansaco === 'Fico exausto') pontos -= 2
  else if (r.energia_cansaco === 'Significativamente') pontos -= 1
  else if (r.energia_cansaco === 'Levemente') pontos -= 0.3

  // Dores musculares
  if (r.energia_dores === 'Frequentemente') pontos -= 1
  else if (r.energia_dores === 'Ocasionalmente') pontos -= 0.3

  // Tolerância ao frio
  if (r.energia_frio === 'Mãos e pés sempre frios') pontos -= 1
  else if (r.energia_frio === 'Sinto mais frio que outros') pontos -= 0.5

  return Math.max(1, Math.min(10, Math.round(pontos * 10) / 10))
}

// ============================================
// HORMÔNIOS (1-10)
// ============================================
function calcularHormonios(r: Respostas): number {
  let pontos = 10

  // Disposição ao acordar
  if (r.hormonios_disposicao === 'Acordo cansado') pontos -= 2
  else if (r.hormonios_disposicao === 'Pouca disposição') pontos -= 1

  // Oscilação de humor
  if (r.hormonios_humor === 'Oscilações intensas') pontos -= 2
  else if (r.hormonios_humor === 'Oscilações frequentes') pontos -= 1
  else if (r.hormonios_humor === 'Pequenas oscilações') pontos -= 0.3

  // Poder de decisão
  if (r.hormonios_decisao === 'Muito prejudicado') pontos -= 1.5
  else if (r.hormonios_decisao === 'Reduzido') pontos -= 0.8

  // Libido
  if (r.hormonios_libido === 'Ausente') pontos -= 2
  else if (r.hormonios_libido === 'Muito baixa') pontos -= 1.5
  else if (r.hormonios_libido === 'Reduzida') pontos -= 0.8

  // Ciclo menstrual (mulheres)
  if (r.hormonios_ciclo === 'Irregular') pontos -= 1

  // Queda de cabelo
  if (r.hormonios_cabelo === 'Intensa') pontos -= 1.5
  else if (r.hormonios_cabelo === 'Moderada') pontos -= 1
  else if (r.hormonios_cabelo === 'Leve') pontos -= 0.3

  // Ganho de peso
  if (r.hormonios_peso === 'Significativo (+5kg)') pontos -= 1.5
  else if (r.hormonios_peso === 'Moderado (3-5kg)') pontos -= 1
  else if (r.hormonios_peso === 'Leve (1-3kg)') pontos -= 0.3

  return Math.max(1, Math.min(10, Math.round(pontos * 10) / 10))
}

// ============================================
// GERAÇÃO DE ALERTAS
// ============================================
export interface Alerta {
  pilar: string
  severidade: 'critical' | 'moderate'
  score: number
  motivo: string
}

export function gerarAlertas(respostas: Respostas, scores: Scores): Alerta[] {
  const alertas: Alerta[] = []

  // Sono crítico
  if (scores.sono <= 3) {
    const motivos = []
    if (respostas.sono_horas === 'Menos de 6h') motivos.push('dorme <6h')
    if (respostas.sono_acorda === '3-4 vezes' || respostas.sono_acorda === 'Mais de 4 vezes') 
      motivos.push('acorda 3-4x/noite')
    if (respostas.sono_remedio === 'Sim, regularmente') motivos.push('usa medicação')
    
    alertas.push({
      pilar: 'Sono',
      severidade: 'critical',
      score: scores.sono,
      motivo: `Sono crítico (${scores.sono}/10): ${motivos.join(' + ')}`
    })
  }

  // Estresse crítico
  if (scores.estresse <= 3 || respostas.estresse_nivel === '9-10 (muito alto)') {
    alertas.push({
      pilar: 'Estresse',
      severidade: 'critical',
      score: scores.estresse,
      motivo: `Estresse muito alto (${scores.estresse}/10): ${respostas.estresse_fatores || 'múltiplos fatores identificados'}`
    })
  }

  // Intestino irregular
  if (scores.intestino <= 4) {
    const motivos = []
    if (respostas.intestino_bristol === 'Tipo 1-2 (ressecadas/duras)') motivos.push('fezes ressecadas (Bristol 1-2)')
    if (respostas.intestino_sintomas?.includes('Dor abdominal')) motivos.push('dor abdominal')
    
    alertas.push({
      pilar: 'Intestino',
      severidade: 'moderate',
      score: scores.intestino,
      motivo: `Intestino irregular: ${motivos.join(' + ')}`
    })
  }

  // Energia baixa
  if (scores.energia <= 4) {
    alertas.push({
      pilar: 'Energia',
      severidade: 'moderate',
      score: scores.energia,
      motivo: `Fadiga persistente (${scores.energia}/10): energia celular comprometida`
    })
  }

  return alertas.sort((a, b) => {
    // Ordenar por severidade (critical primeiro) e depois por score (menor primeiro)
    if (a.severidade !== b.severidade) return a.severidade === 'critical' ? -1 : 1
    return a.score - b.score
  })
}
