import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createSupabaseClient } from '@/utils/supabaseclient'

interface Habito {
  id: string
  text: string
  frequency: string
  week_days?: string[]
  created_at: string
}

type FrequenciaTipo = 'diariamente' | 'semanalmente' | 'x' | 'semana'

export const useHabits = () => {
  const [habitos, setHabitos] = useState<Habito[]>([])
  const [novoHabito, setNovoHabito] = useState('')
  const [frequenciaTipo, setFrequenciaTipo] = useState<FrequenciaTipo>()
  const [frequenciaX, setFrequenciaX] = useState('')
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchHabitos()
  }, [])

  const fetchHabitos = async () => {
    setIsLoading(true)
    const { data, error } = await createSupabaseClient
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) toast.error('Erro ao buscar hábitos.')
    setHabitos(data || [])
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

    const { data, error } = await createSupabaseClient
      .from('habits')
      .insert({ text: novoHabito.trim(), frequency, week_days })
      .select()

    if (error) {
      toast.error('Erro ao adicionar hábito.')
      return
    }

    if (data && data.length > 0) {
      setHabitos((prev) => [data[0], ...prev])
      toast.success('Hábito adicionado!')
      setNovoHabito('')
      setFrequenciaTipo(undefined)
      setFrequenciaX('')
      setDiasSelecionados([])
    }
  }

  return {
    habitos,
    novoHabito,
    setNovoHabito,
    frequenciaTipo,
    setFrequenciaTipo,
    frequenciaX,
    setFrequenciaX,
    diasSelecionados,
    toggleDia,
    adicionarHabito,
    isLoading
  }
}
