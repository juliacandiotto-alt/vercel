"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Membro, 
  Cultura,
  formatarMoeda, 
  formatarPercentual,
  calcularReceitaDescontada,
  calcularReceitaLiquida
} from "@/lib/mock-data"
import { Wheat, ChevronDown, ChevronRight, User, Building2, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface PainelReceitasProps {
  membros: Membro[]
}

function CulturaRow({ cultura, percentualSubsistencia }: { cultura: Cultura; percentualSubsistencia: number }) {
  const receitaDescontada = calcularReceitaDescontada(cultura.receitaBruta, cultura.percentualCusto)
  const receitaLiquida = calcularReceitaLiquida(receitaDescontada, percentualSubsistencia)
  
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <tr className="border-b border-dashed border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors">
          <td className="py-2 px-3 pl-12">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/40"></div>
              <span className="text-sm text-foreground">{cultura.nome}</span>
              <Info className="h-3 w-3 text-muted-foreground" />
            </div>
          </td>
          <td className="py-2 px-3 text-center">
            <Badge 
              variant={cultura.tipo === "EFETIVA" ? "default" : "secondary"}
              className={cultura.tipo === "EFETIVA" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}
            >
              {cultura.tipo}
            </Badge>
          </td>
          <td className="py-2 px-3 text-right text-sm font-mono">
            {cultura.quantidade} {cultura.unidade}
          </td>
          <td className="py-2 px-3 text-right text-sm">{formatarMoeda(cultura.receitaBruta)}</td>
          <td className="py-2 px-3 text-center text-sm text-muted-foreground">
            {formatarPercentual(cultura.percentualCusto)}
          </td>
          <td className="py-2 px-3 text-right text-sm">{formatarMoeda(receitaDescontada)}</td>
          <td className="py-2 px-3 text-center text-sm text-muted-foreground">
            {formatarPercentual(percentualSubsistencia)}
          </td>
          <td className="py-2 px-3 text-right text-sm font-medium text-emerald-600">{formatarMoeda(receitaLiquida)}</td>
        </tr>
      </HoverCardTrigger>
      <HoverCardContent className="w-96" side="right">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wheat className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-foreground">{cultura.nome}</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-muted-foreground">Quantidade:</span>
              <p className="font-medium">{cultura.quantidade} {cultura.unidade}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-muted-foreground">Produtividade:</span>
              <p className="font-medium">{cultura.produtividade}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-muted-foreground">Estimativa:</span>
              <p className="font-medium">{cultura.estimativaProducao}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-muted-foreground">Valor Unitário:</span>
              <p className="font-medium">{formatarMoeda(cultura.valor)}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded col-span-2">
              <span className="text-muted-foreground">Empreendimento:</span>
              <p className="font-mono text-xs">{cultura.empreendimento}</p>
            </div>
          </div>
          {cultura.perguntasRelatorio && (
            <div className="border-t pt-2">
              <span className="text-xs text-muted-foreground">Informações do Relatório:</span>
              <p className="text-xs mt-1">{cultura.perguntasRelatorio}</p>
            </div>
          )}
          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Receita Bruta:</span>
              <span className="font-medium">{formatarMoeda(cultura.receitaBruta)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Custo ({formatarPercentual(cultura.percentualCusto)}):</span>
              <span className="text-red-500">- {formatarMoeda(cultura.custo)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Receita Descontada:</span>
              <span className="font-medium">{formatarMoeda(receitaDescontada)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subsistência ({formatarPercentual(percentualSubsistencia)}):</span>
              <span className="text-red-500">- {formatarMoeda(receitaDescontada * percentualSubsistencia / 100)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-emerald-600 pt-1 border-t">
              <span>Receita Líquida:</span>
              <span>{formatarMoeda(receitaLiquida)}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function MembroSection({ membro }: { membro: Membro }) {
  const [expanded, setExpanded] = useState(true)
  
  const culturasEfetivas = membro.culturas.filter(c => c.tipo === "EFETIVA")
  const culturasPrevistas = membro.culturas.filter(c => c.tipo === "PREVISTA")
  
  const totaisPorTipo = (culturas: Cultura[]) => {
    return culturas.reduce((acc, c) => {
      const descontada = calcularReceitaDescontada(c.receitaBruta, c.percentualCusto)
      const liquida = calcularReceitaLiquida(descontada, membro.percentualSubsistencia)
      return {
        bruta: acc.bruta + c.receitaBruta,
        descontada: acc.descontada + descontada,
        liquida: acc.liquida + liquida
      }
    }, { bruta: 0, descontada: 0, liquida: 0 })
  }
  
  const totaisEfetivos = totaisPorTipo(culturasEfetivas)
  const totaisPrevistos = totaisPorTipo(culturasPrevistas)
  const totaisGeral = {
    bruta: totaisEfetivos.bruta + totaisPrevistos.bruta,
    descontada: totaisEfetivos.descontada + totaisPrevistos.descontada,
    liquida: totaisEfetivos.liquida + totaisPrevistos.liquida
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          {membro.tipoPessoa === "PF" ? (
            <User className="h-5 w-5 text-primary" />
          ) : (
            <Building2 className="h-5 w-5 text-primary" />
          )}
          <div className="text-left">
            <h3 className="font-semibold text-foreground">{membro.nome}</h3>
            <p className="text-xs text-muted-foreground">{membro.cpfCnpj} • {membro.enquadramento}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Receita Líquida Total</p>
                  <p className="font-bold text-emerald-600">{formatarMoeda(totaisGeral.liquida)}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Soma de todas as receitas líquidas (efetivas + previstas)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Badge variant="outline" className="text-xs">
            {membro.culturas.length} {membro.culturas.length === 1 ? 'cultura' : 'culturas'}
          </Badge>
        </div>
      </button>
      
      {expanded && (
        <div className="border-t">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b">
                <th className="text-left p-3 font-semibold text-muted-foreground">Cultura</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Tipo</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Quantidade</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Receita Bruta</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">% Custo</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Receita Descontada</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">% Subsist.</th>
                <th className="text-right p-3 font-semibold text-muted-foreground">Receita Líquida</th>
              </tr>
            </thead>
            <tbody>
              {culturasEfetivas.length > 0 && (
                <>
                  <tr className="bg-emerald-50/50">
                    <td colSpan={8} className="p-2 pl-6 font-semibold text-emerald-700 text-xs uppercase tracking-wide">
                      Receitas Efetivas
                    </td>
                  </tr>
                  {culturasEfetivas.map((cultura) => (
                    <CulturaRow key={cultura.id} cultura={cultura} percentualSubsistencia={membro.percentualSubsistencia} />
                  ))}
                  <tr className="bg-emerald-50/30 border-t">
                    <td colSpan={3} className="p-2 pl-12 text-sm font-medium text-emerald-700">Subtotal Efetivas</td>
                    <td className="p-2 text-right text-sm font-medium">{formatarMoeda(totaisEfetivos.bruta)}</td>
                    <td></td>
                    <td className="p-2 text-right text-sm font-medium">{formatarMoeda(totaisEfetivos.descontada)}</td>
                    <td></td>
                    <td className="p-2 text-right text-sm font-bold text-emerald-600">{formatarMoeda(totaisEfetivos.liquida)}</td>
                  </tr>
                </>
              )}
              
              {culturasPrevistas.length > 0 && (
                <>
                  <tr className="bg-amber-50/50">
                    <td colSpan={8} className="p-2 pl-6 font-semibold text-amber-700 text-xs uppercase tracking-wide">
                      Receitas Previstas
                    </td>
                  </tr>
                  {culturasPrevistas.map((cultura) => (
                    <CulturaRow key={cultura.id} cultura={cultura} percentualSubsistencia={membro.percentualSubsistencia} />
                  ))}
                  <tr className="bg-amber-50/30 border-t">
                    <td colSpan={3} className="p-2 pl-12 text-sm font-medium text-amber-700">Subtotal Previstas</td>
                    <td className="p-2 text-right text-sm font-medium">{formatarMoeda(totaisPrevistos.bruta)}</td>
                    <td></td>
                    <td className="p-2 text-right text-sm font-medium">{formatarMoeda(totaisPrevistos.descontada)}</td>
                    <td></td>
                    <td className="p-2 text-right text-sm font-bold text-amber-600">{formatarMoeda(totaisPrevistos.liquida)}</td>
                  </tr>
                </>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-t-2">
                <td colSpan={3} className="p-3 pl-6 font-bold text-foreground">Total do Membro</td>
                <td className="p-3 text-right font-bold">{formatarMoeda(totaisGeral.bruta)}</td>
                <td></td>
                <td className="p-3 text-right font-bold">{formatarMoeda(totaisGeral.descontada)}</td>
                <td></td>
                <td className="p-3 text-right font-bold text-emerald-600">{formatarMoeda(totaisGeral.liquida)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}

export function PainelReceitas({ membros }: PainelReceitasProps) {
  const membrosSelecionados = membros.filter(m => m.selecionado)

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wheat className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold text-foreground">Receitas por Cultura</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Passe o mouse sobre uma cultura para ver detalhes
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {membrosSelecionados.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Selecione ao menos um membro para visualizar as receitas
          </div>
        ) : (
          membrosSelecionados.map((membro) => (
            <MembroSection key={membro.id} membro={membro} />
          ))
        )}
      </CardContent>
    </Card>
  )
}
