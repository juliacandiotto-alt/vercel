"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Sprout, 
  Search, 
  Download, 
  Printer, 
  ChevronDown,
  RefreshCw,
  Users,
  Calendar
} from "lucide-react"

interface HeaderAnaliseProps {
  nomeGrupo: string
  totalMembros: number
}

export function HeaderAnalise({ nomeGrupo, totalMembros }: HeaderAnaliseProps) {
  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Análise de Rendas Agropecuárias</h1>
              <p className="text-sm text-muted-foreground">Sistema de Consulta e Comprometimento</p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Buscar Grupo</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exportar</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Info do Grupo */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1 px-3 py-1">
            <Users className="h-3 w-3" />
            {nomeGrupo}
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <Users className="h-3 w-3" />
            {totalMembros} {totalMembros === 1 ? 'membro' : 'membros'}
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <Calendar className="h-3 w-3" />
            {dataAtual}
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1 px-3 py-1">
            Dados sincronizados com Denodo
          </Badge>
        </div>
      </div>
    </header>
  )
}
