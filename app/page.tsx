"use client"

import { useState } from "react"
import { grupoEconomico, Membro } from "@/lib/mock-data"
import { HeaderAnalise } from "@/components/header-analise"
import { PainelSCR } from "@/components/painel-scr"
import { PainelReceitas } from "@/components/painel-receitas"
import { PainelTotais } from "@/components/painel-totais"

export default function Home() {
  const [membros, setMembros] = useState<Membro[]>(grupoEconomico.membros)

  const handleToggleMembro = (id: string) => {
    setMembros(prev => 
      prev.map(m => 
        m.id === id ? { ...m, selecionado: !m.selecionado } : m
      )
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderAnalise 
        nomeGrupo={grupoEconomico.nome} 
        totalMembros={membros.length} 
      />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Seção 1: SCR e Comprometimento Individual */}
        <section>
          <PainelSCR 
            membros={membros} 
            onToggleMembro={handleToggleMembro} 
          />
        </section>

        {/* Seção 2: Receitas por Cultura */}
        <section>
          <PainelReceitas membros={membros} />
        </section>

        {/* Seção 3: Painel de Totais do Grupo */}
        <section>
          <PainelTotais membros={membros} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>Sistema de Análise de Rendas Agropecuárias • Dados do Denodo</p>
            <p>Atualizado em {new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
