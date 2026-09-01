"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  Membro, 
  formatarMoeda, 
  formatarPercentual,
  calcularReceitaDescontada,
  calcularReceitaLiquida,
  calcularComprometimento,
  calcularSobras
} from "@/lib/mock-data"
import { CreditCard, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, User, Building2, Filter } from "lucide-react"

interface PainelSCRProps {
  membros: Membro[]
  onToggleMembro: (id: string) => void
}

type FiltroRenda = {
  efetiva: boolean
  prevista: boolean
}

function calcularTotaisMembro(membro: Membro, filtroRenda: FiltroRenda) {
  const scr361_720Total = membro.scr.reduce((acc, s) => acc + s.vencimento361_720, 0)
  const scrTotal = membro.scr.reduce((acc, s) => acc + s.vencimentoTotal, 0)
  
  // Filtrar culturas conforme seleção
  const culturasFiltradas = membro.culturas.filter(c => {
    if (filtroRenda.efetiva && filtroRenda.prevista) return true
    if (filtroRenda.efetiva && c.tipo === "EFETIVA") return true
    if (filtroRenda.prevista && c.tipo === "PREVISTA") return true
    return false
  })
  
  const receitaBrutaTotal = culturasFiltradas.reduce((acc, c) => acc + c.receitaBruta, 0)
  
  const custoTotal = culturasFiltradas.reduce((acc, c) => {
    return acc + (c.receitaBruta * c.percentualCusto / 100)
  }, 0)
  
  const receitaDescontadaTotal = culturasFiltradas.reduce((acc, c) => {
    return acc + calcularReceitaDescontada(c.receitaBruta, c.percentualCusto)
  }, 0)
  
  const custoSubsistencia = receitaDescontadaTotal * (membro.percentualSubsistencia / 100)
  
  const receitaLiquidaTotal = culturasFiltradas.reduce((acc, c) => {
    const descontada = calcularReceitaDescontada(c.receitaBruta, c.percentualCusto)
    return acc + calcularReceitaLiquida(descontada, membro.percentualSubsistencia)
  }, 0)
  
  const comprometimento = calcularComprometimento(scr361_720Total, receitaLiquidaTotal)
  const sobras = calcularSobras(receitaLiquidaTotal, scr361_720Total)
  
  return {
    scr361_720Total,
    scrTotal,
    receitaBrutaTotal,
    custoTotal,
    receitaDescontadaTotal,
    custoSubsistencia,
    receitaLiquidaTotal,
    comprometimento,
    sobras
  }
}

function getComprometimentoStatus(comprometimento: number) {
  if (comprometimento <= 30) return { color: "text-emerald-600 bg-emerald-50", label: "Baixo", icon: CheckCircle2 }
  if (comprometimento <= 60) return { color: "text-amber-600 bg-amber-50", label: "Médio", icon: AlertTriangle }
  return { color: "text-red-600 bg-red-50", label: "Alto", icon: AlertTriangle }
}

export function PainelSCR({ membros, onToggleMembro }: PainelSCRProps) {
  const [filtroRenda, setFiltroRenda] = useState<FiltroRenda>({
    efetiva: true,
    prevista: true
  })

  const membrosSelecionados = membros.filter(m => m.selecionado)
  
  const totaisGrupo = membrosSelecionados.reduce((acc, membro) => {
    const totais = calcularTotaisMembro(membro, filtroRenda)
    return {
      scr361_720Total: acc.scr361_720Total + totais.scr361_720Total,
      scrTotal: acc.scrTotal + totais.scrTotal,
      receitaBrutaTotal: acc.receitaBrutaTotal + totais.receitaBrutaTotal,
      custoTotal: acc.custoTotal + totais.custoTotal,
      receitaDescontadaTotal: acc.receitaDescontadaTotal + totais.receitaDescontadaTotal,
      custoSubsistencia: acc.custoSubsistencia + totais.custoSubsistencia,
      receitaLiquidaTotal: acc.receitaLiquidaTotal + totais.receitaLiquidaTotal,
      sobras: 0
    }
  }, {
    scr361_720Total: 0,
    scrTotal: 0,
    receitaBrutaTotal: 0,
    custoTotal: 0,
    receitaDescontadaTotal: 0,
    custoSubsistencia: 0,
    receitaLiquidaTotal: 0,
    sobras: 0
  })
  
  totaisGrupo.sobras = totaisGrupo.receitaLiquidaTotal - totaisGrupo.scr361_720Total
  const comprometimentoGrupo = calcularComprometimento(totaisGrupo.scr361_720Total, totaisGrupo.receitaLiquidaTotal)

  const handleFiltroChange = (tipo: "efetiva" | "prevista") => {
    setFiltroRenda(prev => {
      const newState = { ...prev, [tipo]: !prev[tipo] }
      // Garantir que pelo menos um filtro esteja ativo
      if (!newState.efetiva && !newState.prevista) {
        return prev
      }
      return newState
    })
  }

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-foreground">SCR e Comprometimento Individual</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              {/* Filtro de Rendas */}
              <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border shadow-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span className="text-xs font-medium">Rendas a considerar:</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Checkbox 
                      id="filtro-efetiva"
                      checked={filtroRenda.efetiva}
                      onCheckedChange={() => handleFiltroChange("efetiva")}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label htmlFor="filtro-efetiva" className="text-xs font-medium cursor-pointer">
                      Renda efetiva
                    </Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Checkbox 
                      id="filtro-prevista"
                      checked={filtroRenda.prevista}
                      onCheckedChange={() => handleFiltroChange("prevista")}
                      className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    <Label htmlFor="filtro-prevista" className="text-xs font-medium cursor-pointer">
                      Renda prevista
                    </Label>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="font-medium">
                {membrosSelecionados.length} de {membros.length} selecionados
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/80">
                  <th className="text-left p-3 font-semibold text-muted-foreground w-10"></th>
                  <th className="text-left p-3 font-semibold text-muted-foreground min-w-[200px]">Membro</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground whitespace-nowrap">Receita Bruta</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground whitespace-nowrap">Custo Total (R$)</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground whitespace-nowrap">Receita Descontada</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground whitespace-nowrap">Custo Subsistência</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground whitespace-nowrap">Receita Líquida</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground whitespace-nowrap">SCR 361-720</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground whitespace-nowrap">SCR Total</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground whitespace-nowrap">Comprometimento (%)</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground whitespace-nowrap">Sobras (R$)</th>
                </tr>
              </thead>
              <tbody>
                {membros.map((membro) => {
                  const totais = calcularTotaisMembro(membro, filtroRenda)
                  const status = getComprometimentoStatus(totais.comprometimento)
                  const StatusIcon = status.icon
                  
                  return (
                    <tr 
                      key={membro.id} 
                      className={`border-b transition-colors hover:bg-slate-50/50 ${!membro.selecionado ? 'opacity-50 bg-slate-50/30' : ''}`}
                    >
                      <td className="p-3">
                        <Checkbox 
                          checked={membro.selecionado}
                          onCheckedChange={() => onToggleMembro(membro.id)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-start gap-2">
                          {membro.tipoPessoa === "PF" ? (
                            <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          ) : (
                            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{membro.nome}</p>
                            <p className="text-xs text-muted-foreground">{membro.enquadramento}</p>
                            <p className="text-xs font-mono text-muted-foreground/70">{membro.cpfCnpj}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">{formatarMoeda(totais.receitaBrutaTotal)}</td>
                      <td className="p-3 text-right text-red-600">{formatarMoeda(totais.custoTotal)}</td>
                      <td className="p-3 text-right">{formatarMoeda(totais.receitaDescontadaTotal)}</td>
                      <td className="p-3 text-right text-amber-600">{formatarMoeda(totais.custoSubsistencia)}</td>
                      <td className="p-3 text-right font-medium text-emerald-600">{formatarMoeda(totais.receitaLiquidaTotal)}</td>
                      <td className="p-3 text-right font-medium text-red-600">{formatarMoeda(totais.scr361_720Total)}</td>
                      <td className="p-3 text-right font-medium">{formatarMoeda(totais.scrTotal)}</td>
                      <td className="p-3">
                        <div className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {formatarPercentual(totais.comprometimento)}
                        </div>
                      </td>
                      <td className={`p-3 text-right font-semibold ${totais.sobras >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {totais.sobras >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {formatarMoeda(totais.sobras)}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-primary/5 to-primary/10 border-t-2 border-primary/20">
                  <td className="p-3" colSpan={2}>
                    <span className="font-bold text-primary">TOTAL DO GRUPO</span>
                  </td>
                  <td className="p-3 text-right font-bold">{formatarMoeda(totaisGrupo.receitaBrutaTotal)}</td>
                  <td className="p-3 text-right font-bold text-red-600">{formatarMoeda(totaisGrupo.custoTotal)}</td>
                  <td className="p-3 text-right font-bold">{formatarMoeda(totaisGrupo.receitaDescontadaTotal)}</td>
                  <td className="p-3 text-right font-bold text-amber-600">{formatarMoeda(totaisGrupo.custoSubsistencia)}</td>
                  <td className="p-3 text-right font-bold text-emerald-600">{formatarMoeda(totaisGrupo.receitaLiquidaTotal)}</td>
                  <td className="p-3 text-right font-bold text-red-600">{formatarMoeda(totaisGrupo.scr361_720Total)}</td>
                  <td className="p-3 text-right font-bold">{formatarMoeda(totaisGrupo.scrTotal)}</td>
                  <td className="p-3">
                    <div className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getComprometimentoStatus(comprometimentoGrupo).color}`}>
                      {formatarPercentual(comprometimentoGrupo)}
                    </div>
                  </td>
                  <td className={`p-3 text-right font-bold ${totaisGrupo.sobras >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatarMoeda(totaisGrupo.sobras)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
