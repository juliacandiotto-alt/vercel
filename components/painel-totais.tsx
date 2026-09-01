"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Membro, 
  formatarMoeda, 
  formatarPercentual,
  calcularReceitaDescontada,
  calcularReceitaLiquida,
  calcularComprometimento
} from "@/lib/mock-data"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet,
  PiggyBank,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PainelTotaisProps {
  membros: Membro[]
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  variant = "default"
}: { 
  title: string
  value: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  variant?: "default" | "success" | "danger" | "warning" | "info"
}) {
  const variantStyles = {
    default: "bg-card border",
    success: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200",
    danger: "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200",
    warning: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200",
    info: "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200"
  }
  
  const iconStyles = {
    default: "text-muted-foreground bg-slate-100",
    success: "text-emerald-600 bg-emerald-200/50",
    danger: "text-red-600 bg-red-200/50",
    warning: "text-amber-600 bg-amber-200/50",
    info: "text-blue-600 bg-blue-200/50"
  }
  
  const valueStyles = {
    default: "text-foreground",
    success: "text-emerald-700",
    danger: "text-red-700",
    warning: "text-amber-700",
    info: "text-blue-700"
  }

  return (
    <div className={`rounded-xl p-4 border ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${valueStyles[variant]}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && trendValue && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          ) : trend === "down" ? (
            <TrendingDown className="h-3 w-3 text-red-500" />
          ) : null}
          <span className={trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  )
}

export function PainelTotais({ membros }: PainelTotaisProps) {
  const membrosSelecionados = membros.filter(m => m.selecionado)
  
  // Calcular totais do grupo
  const totais = membrosSelecionados.reduce((acc, membro) => {
    const scr361_720 = membro.scr.reduce((s, item) => s + item.vencimento361_720, 0)
    const scrTotal = membro.scr.reduce((s, item) => s + item.vencimentoTotal, 0)
    
    let receitaBrutaEfetiva = 0
    let receitaBrutaPrevista = 0
    let receitaDescontadaEfetiva = 0
    let receitaDescontadaPrevista = 0
    let receitaLiquidaEfetiva = 0
    let receitaLiquidaPrevista = 0
    
    membro.culturas.forEach(c => {
      const descontada = calcularReceitaDescontada(c.receitaBruta, c.percentualCusto)
      const liquida = calcularReceitaLiquida(descontada, membro.percentualSubsistencia)
      
      if (c.tipo === "EFETIVA") {
        receitaBrutaEfetiva += c.receitaBruta
        receitaDescontadaEfetiva += descontada
        receitaLiquidaEfetiva += liquida
      } else {
        receitaBrutaPrevista += c.receitaBruta
        receitaDescontadaPrevista += descontada
        receitaLiquidaPrevista += liquida
      }
    })
    
    return {
      scr361_720: acc.scr361_720 + scr361_720,
      scrTotal: acc.scrTotal + scrTotal,
      receitaBrutaEfetiva: acc.receitaBrutaEfetiva + receitaBrutaEfetiva,
      receitaBrutaPrevista: acc.receitaBrutaPrevista + receitaBrutaPrevista,
      receitaDescontadaEfetiva: acc.receitaDescontadaEfetiva + receitaDescontadaEfetiva,
      receitaDescontadaPrevista: acc.receitaDescontadaPrevista + receitaDescontadaPrevista,
      receitaLiquidaEfetiva: acc.receitaLiquidaEfetiva + receitaLiquidaEfetiva,
      receitaLiquidaPrevista: acc.receitaLiquidaPrevista + receitaLiquidaPrevista
    }
  }, {
    scr361_720: 0,
    scrTotal: 0,
    receitaBrutaEfetiva: 0,
    receitaBrutaPrevista: 0,
    receitaDescontadaEfetiva: 0,
    receitaDescontadaPrevista: 0,
    receitaLiquidaEfetiva: 0,
    receitaLiquidaPrevista: 0
  })
  
  const receitaBrutaTotal = totais.receitaBrutaEfetiva + totais.receitaBrutaPrevista
  const receitaDescontadaTotal = totais.receitaDescontadaEfetiva + totais.receitaDescontadaPrevista
  const receitaLiquidaTotal = totais.receitaLiquidaEfetiva + totais.receitaLiquidaPrevista
  
  const comprometimentoEfetivo = calcularComprometimento(totais.scr361_720, totais.receitaLiquidaEfetiva)
  const comprometimentoPrevisto = calcularComprometimento(totais.scr361_720, receitaLiquidaTotal)
  
  const sobrasEfetivas = totais.receitaLiquidaEfetiva - totais.scr361_720
  const sobrasTotal = receitaLiquidaTotal - totais.scr361_720

  const comprometimentoPrevistaOnly = calcularComprometimento(totais.scr361_720, totais.receitaLiquidaPrevista)
  const comprometimentoTotal = comprometimentoPrevisto // já calculado acima com receitaLiquidaTotal

  const sobrasPrevistasOnly = totais.receitaLiquidaPrevista - totais.scr361_720

  const getComprometimentoStatus = (valor: number): "success" | "warning" | "danger" => 
    valor <= 30 ? "success" : valor <= 60 ? "warning" : "danger"

  const comprometimentoStatus = getComprometimentoStatus(comprometimentoTotal)

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold text-foreground">Painel de Totais do Grupo</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="SCR 361-720"
            value={formatarMoeda(totais.scr361_720)}
            subtitle="Endividamento de curto prazo"
            icon={CreditCard}
            variant="danger"
          />
          <StatCard
            title="SCR Total"
            value={formatarMoeda(totais.scrTotal)}
            subtitle="Endividamento total do grupo"
            icon={CreditCard}
            variant="info"
          />
          <StatCard
            title="Comprometimento"
            value={formatarPercentual(comprometimentoPrevisto)}
            subtitle="SCR 361-720 / Receita Líquida"
            icon={comprometimentoStatus === "success" ? CheckCircle2 : AlertCircle}
            variant={comprometimentoStatus}
          />
          <StatCard
            title="Sobras"
            value={formatarMoeda(sobrasTotal)}
            subtitle="Receita Líquida - SCR 361-720"
            icon={sobrasTotal >= 0 ? PiggyBank : AlertCircle}
            variant={sobrasTotal >= 0 ? "success" : "danger"}
            trend={sobrasTotal >= 0 ? "up" : "down"}
            trendValue={sobrasTotal >= 0 ? "Capacidade de pagamento positiva" : "Atenção: sobras negativas"}
          />
        </div>

        {/* Detalhamento de Receitas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receitas Efetivas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              Receitas Efetivas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Receita Bruta</span>
                <span className="font-medium">{formatarMoeda(totais.receitaBrutaEfetiva)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Receita Descontada</span>
                <span className="font-medium">{formatarMoeda(totais.receitaDescontadaEfetiva)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-sm font-medium text-emerald-700">Receita Líquida</span>
                <span className="font-bold text-emerald-700">{formatarMoeda(totais.receitaLiquidaEfetiva)}</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Comprometimento Efetivo</span>
                  <span className="font-medium">{formatarPercentual(comprometimentoEfetivo)}</span>
                </div>
                <Progress value={Math.min(comprometimentoEfetivo, 100)} className="h-2" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Sobras Efetivas</span>
                <span className={`font-bold ${sobrasEfetivas >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatarMoeda(sobrasEfetivas)}
                </span>
              </div>
            </div>
          </div>

          {/* Receitas Previstas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              Receitas Previstas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Receita Bruta</span>
                <span className="font-medium">{formatarMoeda(totais.receitaBrutaPrevista)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-muted-foreground">Receita Descontada</span>
                <span className="font-medium">{formatarMoeda(totais.receitaDescontadaPrevista)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm font-medium text-amber-700">Receita Líquida</span>
                <span className="font-bold text-amber-700">{formatarMoeda(totais.receitaLiquidaPrevista)}</span>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Projeção com Receitas Previstas</p>
                <p className="text-sm">
                  Ao considerar as receitas previstas, o comprometimento cairia de{" "}
                  <span className="font-semibold">{formatarPercentual(comprometimentoEfetivo)}</span> para{" "}
                  <span className="font-semibold text-emerald-600">{formatarPercentual(comprometimentoPrevisto)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Análise Comparativa de Comprometimento */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            Análise Comparativa de Comprometimento
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Cenário 1: Apenas Renda Efetiva */}
            <div className={`p-5 rounded-xl border-2 ${
              getComprometimentoStatus(comprometimentoEfetivo) === "success" 
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300" 
                : getComprometimentoStatus(comprometimentoEfetivo) === "warning"
                ? "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-300"
                : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-300"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h4 className="font-semibold text-sm">Apenas Renda Efetiva</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Receita Líquida Base</p>
                  <p className="text-lg font-bold">{formatarMoeda(totais.receitaLiquidaEfetiva)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Comprometimento</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-2xl font-bold ${
                      getComprometimentoStatus(comprometimentoEfetivo) === "success" 
                        ? "text-emerald-700" 
                        : getComprometimentoStatus(comprometimentoEfetivo) === "warning"
                        ? "text-amber-700"
                        : "text-red-700"
                    }`}>
                      {formatarPercentual(comprometimentoEfetivo)}
                    </p>
                    {getComprometimentoStatus(comprometimentoEfetivo) === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className={`h-5 w-5 ${
                        getComprometimentoStatus(comprometimentoEfetivo) === "warning" 
                          ? "text-amber-600" 
                          : "text-red-600"
                      }`} />
                    )}
                  </div>
                </div>
                <Progress 
                  value={Math.min(comprometimentoEfetivo, 100)} 
                  className="h-2.5" 
                />
                <div className="pt-2 border-t border-current/10">
                  <p className="text-xs text-muted-foreground mb-1">Sobras</p>
                  <p className={`font-bold ${sobrasEfetivas >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatarMoeda(sobrasEfetivas)}
                  </p>
                </div>
              </div>
            </div>

            {/* Cenário 2: Apenas Renda Prevista */}
            <div className={`p-5 rounded-xl border-2 ${
              getComprometimentoStatus(comprometimentoPrevistaOnly) === "success" 
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300" 
                : getComprometimentoStatus(comprometimentoPrevistaOnly) === "warning"
                ? "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-300"
                : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-300"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <h4 className="font-semibold text-sm">Apenas Renda Prevista</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Receita Líquida Base</p>
                  <p className="text-lg font-bold">{formatarMoeda(totais.receitaLiquidaPrevista)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Comprometimento</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-2xl font-bold ${
                      getComprometimentoStatus(comprometimentoPrevistaOnly) === "success" 
                        ? "text-emerald-700" 
                        : getComprometimentoStatus(comprometimentoPrevistaOnly) === "warning"
                        ? "text-amber-700"
                        : "text-red-700"
                    }`}>
                      {totais.receitaLiquidaPrevista > 0 ? formatarPercentual(comprometimentoPrevistaOnly) : "N/A"}
                    </p>
                    {totais.receitaLiquidaPrevista > 0 && (
                      getComprometimentoStatus(comprometimentoPrevistaOnly) === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className={`h-5 w-5 ${
                          getComprometimentoStatus(comprometimentoPrevistaOnly) === "warning" 
                            ? "text-amber-600" 
                            : "text-red-600"
                        }`} />
                      )
                    )}
                  </div>
                </div>
                <Progress 
                  value={totais.receitaLiquidaPrevista > 0 ? Math.min(comprometimentoPrevistaOnly, 100) : 0} 
                  className="h-2.5" 
                />
                <div className="pt-2 border-t border-current/10">
                  <p className="text-xs text-muted-foreground mb-1">Sobras</p>
                  <p className={`font-bold ${sobrasPrevistasOnly >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {totais.receitaLiquidaPrevista > 0 ? formatarMoeda(sobrasPrevistasOnly) : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Cenário 3: Renda Total (Efetiva + Prevista) */}
            <div className={`p-5 rounded-xl border-2 ${
              comprometimentoStatus === "success" 
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300" 
                : comprometimentoStatus === "warning"
                ? "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-300"
                : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-300"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h4 className="font-semibold text-sm">Renda Total (Efetiva + Prevista)</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Receita Líquida Base</p>
                  <p className="text-lg font-bold">{formatarMoeda(receitaLiquidaTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Comprometimento</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-2xl font-bold ${
                      comprometimentoStatus === "success" 
                        ? "text-emerald-700" 
                        : comprometimentoStatus === "warning"
                        ? "text-amber-700"
                        : "text-red-700"
                    }`}>
                      {formatarPercentual(comprometimentoTotal)}
                    </p>
                    {comprometimentoStatus === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className={`h-5 w-5 ${
                        comprometimentoStatus === "warning" 
                          ? "text-amber-600" 
                          : "text-red-600"
                      }`} />
                    )}
                  </div>
                </div>
                <Progress 
                  value={Math.min(comprometimentoTotal, 100)} 
                  className="h-2.5" 
                />
                <div className="pt-2 border-t border-current/10">
                  <p className="text-xs text-muted-foreground mb-1">Sobras</p>
                  <p className={`font-bold ${sobrasTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatarMoeda(sobrasTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nota explicativa */}
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Nota:</span> O comprometimento é calculado como a razão entre o SCR 361-720 (dívidas com vencimento entre 361 e 720 dias) 
              e a receita líquida do cenário analisado. Valores até 30% indicam baixo risco, entre 30% e 60% indicam risco moderado, e acima de 60% indicam alto risco.
            </p>
          </div>
        </div>

        {/* Resumo Consolidado */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            Resumo Consolidado do Grupo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Receita Bruta Total</p>
              <p className="text-lg font-bold">{formatarMoeda(receitaBrutaTotal)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Receita Descontada Total</p>
              <p className="text-lg font-bold">{formatarMoeda(receitaDescontadaTotal)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
              <p className="text-xs text-emerald-600 mb-1">Receita Líquida Total</p>
              <p className="text-lg font-bold text-emerald-700">{formatarMoeda(receitaLiquidaTotal)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-xs text-blue-600 mb-1">Membros Analisados</p>
              <p className="text-lg font-bold text-blue-700">{membrosSelecionados.length} de {membros.length}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
