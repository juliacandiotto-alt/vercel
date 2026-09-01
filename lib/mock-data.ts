// Dados mockados para o sistema de análise de rendas agropecuárias

export interface Cultura {
  id: string
  nome: string
  quantidade: number
  unidade: string
  estimativaProducao: string
  produtividade: number
  empreendimento: string
  valor: number
  receitaBruta: number
  percentualCusto: number
  custo: number
  receitaLiquida: number
  tipo: "EFETIVA" | "PREVISTA"
  perguntasRelatorio?: string
}

export interface SCR {
  modalidade: string
  valor: number
  vencimento361_720: number
  vencimentoTotal: number
}

export interface Membro {
  id: string
  cpfCnpj: string
  nome: string
  tipoPessoa: "PF" | "PJ"
  enquadramento: string
  percentualSubsistencia: number
  selecionado: boolean
  culturas: Cultura[]
  scr: SCR[]
}

export interface GrupoEconomico {
  id: string
  nome: string
  membros: Membro[]
}

// Mock de culturas
const culturasJoao: Cultura[] = [
  {
    id: "1",
    nome: "NOVILHOS 25 A 36 MESES - PASTO",
    quantidade: 100,
    unidade: "Cabeças",
    estimativaProducao: "Sem preenchimento",
    produtividade: 1,
    empreendimento: "13161300000002",
    valor: 2800.00,
    receitaBruta: 280000.00,
    percentualCusto: 40,
    custo: 112000.00,
    receitaLiquida: 168000.00,
    tipo: "EFETIVA",
    perguntasRelatorio: "Tipo de trato: PASTO; Média de arrobas: 14; Idade média: 36 meses"
  },
  {
    id: "2",
    nome: "SOJA - GRÃO",
    quantidade: 150,
    unidade: "Hectares",
    estimativaProducao: "60 sacas/ha",
    produtividade: 60,
    empreendimento: "13161300000002",
    valor: 130.00,
    receitaBruta: 1170000.00,
    percentualCusto: 45,
    custo: 526500.00,
    receitaLiquida: 643500.00,
    tipo: "EFETIVA"
  },
  {
    id: "3",
    nome: "MILHO - GRÃO",
    quantidade: 80,
    unidade: "Hectares",
    estimativaProducao: "120 sacas/ha",
    produtividade: 120,
    empreendimento: "13161300000002",
    valor: 55.00,
    receitaBruta: 528000.00,
    percentualCusto: 42,
    custo: 221760.00,
    receitaLiquida: 306240.00,
    tipo: "PREVISTA"
  }
]

const culturasMaria: Cultura[] = [
  {
    id: "4",
    nome: "CAFÉ ARÁBICA",
    quantidade: 45,
    unidade: "Hectares",
    estimativaProducao: "35 sacas/ha",
    produtividade: 35,
    empreendimento: "98765432000199",
    valor: 1200.00,
    receitaBruta: 1890000.00,
    percentualCusto: 38,
    custo: 718200.00,
    receitaLiquida: 1171800.00,
    tipo: "EFETIVA"
  },
  {
    id: "5",
    nome: "LEITE",
    quantidade: 50,
    unidade: "Cabeças",
    estimativaProducao: "15L/dia",
    produtividade: 15,
    empreendimento: "98765432000199",
    valor: 2.50,
    receitaBruta: 684375.00,
    percentualCusto: 55,
    custo: 376406.25,
    receitaLiquida: 307968.75,
    tipo: "EFETIVA"
  }
]

const culturasEmpresa: Cultura[] = [
  {
    id: "6",
    nome: "ALGODÃO - PLUMA",
    quantidade: 500,
    unidade: "Hectares",
    estimativaProducao: "280 @/ha",
    produtividade: 280,
    empreendimento: "12345678000190",
    valor: 150.00,
    receitaBruta: 21000000.00,
    percentualCusto: 48,
    custo: 10080000.00,
    receitaLiquida: 10920000.00,
    tipo: "EFETIVA"
  },
  {
    id: "7",
    nome: "SOJA - GRÃO",
    quantidade: 1200,
    unidade: "Hectares",
    estimativaProducao: "65 sacas/ha",
    produtividade: 65,
    empreendimento: "12345678000190",
    valor: 130.00,
    receitaBruta: 10140000.00,
    percentualCusto: 45,
    custo: 4563000.00,
    receitaLiquida: 5577000.00,
    tipo: "PREVISTA"
  }
]

// Mock de SCR
const scrJoao: SCR[] = [
  { modalidade: "Custeio Agrícola", valor: 450000.00, vencimento361_720: 180000.00, vencimentoTotal: 450000.00 },
  { modalidade: "Investimento Rural", valor: 320000.00, vencimento361_720: 85000.00, vencimentoTotal: 320000.00 },
  { modalidade: "Comercialização", valor: 150000.00, vencimento361_720: 45000.00, vencimentoTotal: 150000.00 }
]

const scrMaria: SCR[] = [
  { modalidade: "Custeio Pecuário", valor: 280000.00, vencimento361_720: 95000.00, vencimentoTotal: 280000.00 },
  { modalidade: "Investimento Rural", valor: 520000.00, vencimento361_720: 210000.00, vencimentoTotal: 520000.00 }
]

const scrEmpresa: SCR[] = [
  { modalidade: "Custeio Agrícola", valor: 8500000.00, vencimento361_720: 2800000.00, vencimentoTotal: 8500000.00 },
  { modalidade: "Investimento Rural", valor: 4200000.00, vencimento361_720: 1200000.00, vencimentoTotal: 4200000.00 },
  { modalidade: "Comercialização", valor: 2100000.00, vencimento361_720: 680000.00, vencimentoTotal: 2100000.00 }
]

export const grupoEconomico: GrupoEconomico = {
  id: "grupo-001",
  nome: "Grupo Fazenda Esperança",
  membros: [
    {
      id: "m1",
      cpfCnpj: "123.456.789-00",
      nome: "João Silva Santos",
      tipoPessoa: "PF",
      enquadramento: "Médio Produtor",
      percentualSubsistencia: 15,
      selecionado: true,
      culturas: culturasJoao,
      scr: scrJoao
    },
    {
      id: "m2",
      cpfCnpj: "987.654.321-00",
      nome: "Maria Oliveira Costa",
      tipoPessoa: "PF",
      enquadramento: "Pequeno Produtor",
      percentualSubsistencia: 20,
      selecionado: true,
      culturas: culturasMaria,
      scr: scrMaria
    },
    {
      id: "m3",
      cpfCnpj: "12.345.678/0001-90",
      nome: "Agropecuária Esperança Ltda",
      tipoPessoa: "PJ",
      enquadramento: "Grande Produtor",
      percentualSubsistencia: 10,
      selecionado: true,
      culturas: culturasEmpresa,
      scr: scrEmpresa
    }
  ]
}

// Funções auxiliares para cálculos
export function calcularReceitaDescontada(receitaBruta: number, percentualCusto: number): number {
  return receitaBruta - (receitaBruta * percentualCusto / 100)
}

export function calcularReceitaLiquida(receitaDescontada: number, percentualSubsistencia: number): number {
  return receitaDescontada - (receitaDescontada * percentualSubsistencia / 100)
}

export function calcularComprometimento(scr361_720: number, receitaLiquida: number): number {
  if (receitaLiquida === 0) return 0
  return (scr361_720 / receitaLiquida) * 100
}

export function calcularSobras(receitaLiquida: number, scr361_720: number): number {
  return receitaLiquida - scr361_720
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarPercentual(valor: number): string {
  return valor.toFixed(2) + '%'
}
