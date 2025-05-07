'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createSupabaseClient } from '@/utils/supabaseclient'
import HabitsForm from './HabitsForm'
import HabitsDateSelector from './HabitsDateSelector'
import HabitsItem from './HabitsItem'
import WeeklyCarousel from './WeeklyCarousel'

export interface Habito {
  id: string
  text: string
  frequency: string
  week_days?: string[]
  created_at: string
}

const diasDaSemana = [
  { label: 'Dom', value: 'domingo', short: 'Dom' },
  { label: 'Seg', value: 'segunda', short: 'Seg' },
  { label: 'Ter', value: 'terca', short: 'Ter' },
  { label: 'Qua', value: 'quarta', short: 'Qua' },
  { label: 'Qui', value: 'quinta', short: 'Qui' },
  { label: 'Sex', value: 'sexta', short: 'Sex' },
  { label: 'Sáb', value: 'sabado', short: 'Sáb' },
]

const abreviarDias = (dias: string[]): string => {
  return dias.map((d) => diasDaSemana.find((ds) => ds.value === d)?.short || d).join(', ')
}

export default function HabitosPage() {
  const supabase = createSupabaseClient
  const [habitos, setHabitos] = useState<Habito[]>([])
  const [novoHabito, setNovoHabito] = useState('')
  const [frequenciaTipo, setFrequenciaTipo] = useState<'diariamente' | 'semanalmente' | 'x' | 'semana'>()
  const [frequenciaX, setFrequenciaX] = useState('')
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchHabitos()
  }, [])

  const fetchHabitos = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar hábitos:', error)
      toast.error('Erro ao buscar hábitos.')
    } else {
      setHabitos(data || [])
    }

    setIsLoading(false)
  }

  const toggleDia = (dia: string) => {
    if (frequenciaTipo === 'semanalmente') {
      setDiasSelecionados([dia])
    } else {
      setDiasSelecionados((prev) =>
        prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
      )
    }
  }

  const adicionarHabito = async () => {
    if (!novoHabito.trim() || !frequenciaTipo) {
      toast.error('Preencha o hábito e a frequência corretamente.')
      return
    }

    let frequency = ''
    let week_days: string[] | undefined

    if (frequenciaTipo === 'diariamente') {
      frequency = 'Diariamente'
    } else if (frequenciaTipo === 'semanalmente') {
      if (diasSelecionados.length !== 1) {
        toast.error('Selecione exatamente 1 dia da semana.')
        return
      }
      frequency = 'Semanalmente'
      week_days = diasSelecionados
    } else if (frequenciaTipo === 'x') {
      if (!frequenciaX.trim()) {
        toast.error('Informe quantas vezes por semana.')
        return
      }
      frequency = `${frequenciaX.trim()} por Semana`
    } else if (frequenciaTipo === 'semana') {
      if (diasSelecionados.length === 0) {
        toast.error('Selecione ao menos um dia da semana.')
        return
      }
      frequency = `${diasSelecionados.length} dias por Semana`
      week_days = diasSelecionados
    }

    const { data, error } = await supabase
      .from('habits')
      .insert({ text: novoHabito.trim(), frequency, week_days })
      .select()

    if (error) {
      console.error('Erro ao adicionar hábito:', error)
      toast.error('Erro ao adicionar hábito.')
      return
    }

    if (data && data.length > 0) {
      setHabitos((prev) => [data[0], ...prev])
      toast.success('Hábito adicionado!')
      setNovoHabito('')
      setDiasSelecionados([])
    }
  }

  const handleDeleteHabito = async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id)
    if (error) {
      toast.error('Erro ao excluir hábito.')
      return
    }
    setHabitos((prev) => prev.filter((h) => h.id !== id))
    toast.success('Hábito excluído.')
  }

  const handleEditHabito = async (id: string, newText: string) => {
    const { error } = await supabase.from('habits').update({ text: newText }).eq('id', id)
    if (error) {
      toast.error('Erro ao editar hábito.')
      return
    }
    setHabitos((prev) =>
      prev.map((h) => (h.id === id ? { ...h, text: newText } : h))
    )
    toast.success('Hábito atualizado.')
  }

  return (
    <div className="px-6 w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Hábitos</h1>

      <HabitsForm
        novoHabito={novoHabito}
        setNovoHabito={setNovoHabito}
        frequenciaTipo={frequenciaTipo}
        setFrequenciaTipo={setFrequenciaTipo}
        frequenciaX={frequenciaX}
        setFrequenciaX={setFrequenciaX}
        onAdicionar={adicionarHabito}
      />

      {(frequenciaTipo === 'semana' || frequenciaTipo === 'semanalmente') && (
        <HabitsDateSelector
          diasSelecionados={diasSelecionados}
          toggleDia={toggleDia}
          diasDaSemana={diasDaSemana}
        />
      )}

      <ul className="space-y-3">
        {isLoading ? (
          <li className="text-gray-400 text-center">Carregando hábitos...</li>
        ) : habitos.length === 0 ? (
          <li className="text-gray-400 text-center">Nenhum hábito adicionado ainda.</li>
        ) : (
          habitos.map((habito) => (
            <HabitsItem
              key={habito.id}
              habito={habito}
              abreviarDias={abreviarDias}
              onDelete={handleDeleteHabito}
              onEdit={handleEditHabito}
            />
          ))
        )}
      </ul>

      <WeeklyCarousel habitos={habitos} />
    </div>
  )
}
