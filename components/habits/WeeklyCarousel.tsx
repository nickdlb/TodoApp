'use client'

import { useEffect, useState } from 'react'
import { format, addWeeks, subWeeks, startOfWeek, addDays, differenceInCalendarDays, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { createSupabaseClient } from '@/utils/supabaseclient'

const supabase = createSupabaseClient

interface Habito {
  id: string
  text: string
}

const diasAbreviados = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

interface Props {
  habitos: Habito[]
}

interface CheckinMap {
  [key: string]: boolean // `${habit_id}-${yyyy-MM-dd}`
}

export default function WeeklyCarousel({ habitos }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [checkins, setCheckins] = useState<CheckinMap>({})
  const start = startOfWeek(currentDate, { weekStartsOn: 0 })
  const diasSemana = Array.from({ length: 7 }).map((_, i) => addDays(start, i))

  const getKey = (habitId: string, date: Date) =>
    `${habitId}-${format(date, 'yyyy-MM-dd')}`

  const isToday = (date: Date) =>
    isSameDay(date, new Date())

  useEffect(() => {
    const fetchCheckins = async () => {
      const startDate = format(diasSemana[0], 'yyyy-MM-dd')
      const endDate = format(diasSemana[6], 'yyyy-MM-dd')

      const { data, error } = await supabase
        .from('habit_checkins')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)

      if (error) {
        console.error('Erro ao buscar check-ins:', error)
        return
      }

      const map: CheckinMap = {}
      data?.forEach((item: { habit_id: string; date: string; checked: boolean }) => {
        const key = `${item.habit_id}-${item.date}`
        map[key] = item.checked
      })
      setCheckins(map)
    }

    fetchCheckins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate])

  const marcarHabito = async (habitId: string, date: Date, checked: boolean) => {
    const formattedDate = format(date, 'yyyy-MM-dd')
    const key = getKey(habitId, date)

    setCheckins((prev) => ({ ...prev, [key]: checked }))

    if (checked) {
      const { error } = await supabase
        .from('habit_checkins')
        .upsert(
          [{ habit_id: habitId, date: formattedDate, checked: true }],
          { onConflict: 'habit_id,date' }
        )
      if (error) {
        console.error('Erro ao salvar check-in:', error)
      }
    } else {
      const { error } = await supabase
        .from('habit_checkins')
        .delete()
        .match({ habit_id: habitId, date: formattedDate })

      if (error) {
        console.error('Erro ao remover check-in:', error)
      }
    }
  }

  const contarDiasSeguidos = (habitId: string): number => {
    let dias = 0
    for (let i = 0; i < 30; i++) {
      const date = addDays(new Date(), -i)
      const key = getKey(habitId, date)
      if (checkins[key]) {
        dias++
      } else {
        break
      }
    }
    return dias
  }

  return (
    <div className="text-white mt-4 rounded-2xl">
      <div className='bg-gray-700 p-4 rounded-2xl'>
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setCurrentDate((prev) => subWeeks(prev, 1))}>←</button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentDate(new Date())} className="text-sm underline">
              Hoje
            </button>
            <button onClick={() => setCurrentDate((prev) => addWeeks(prev, 1))}>→</button>
          </div>
        </div>
        <div className="grid grid-cols-[150px_repeat(7,minmax(50px,1fr))_80px] bg-gray-700 rounded-t-md overflow-hidden">
          <div className="bg-gray-800 p-2 text-sm font-bold text-center">Hábitos</div>
          {diasSemana.map((date, index) => (
            <div key={index} className={`p-2 text-center border-l border-gray-600 ${ isToday(date) ? 'bg-green-700 font-bold text-white' : ''}`}>
              <div className="text-sm">{diasAbreviados[date.getDay()]}</div>
              <div className="text-lg font-bold">{format(date, 'd')}</div>
            </div>
          ))}
          <div className="bg-gray-800 p-2 text-sm font-bold text-center">Total</div>
        </div>
        {habitos.map((habito) => {
        const checksSemana = diasSemana.filter((date) => checkins[getKey(habito.id, date)]).length

        return (
          <div key={habito.id} className="grid grid-cols-[150px_repeat(7,minmax(50px,1fr))_80px] border-t border-gray-600">
            <div className="bg-gray-800 p-2 text-sm">{habito.text}</div>
            {diasSemana.map((date) => {
              const key = getKey(habito.id, date)
              const checked = checkins[key] || false
              return (
                <div key={key} className="p-2 flex items-center justify-center border-l border-gray-700">
                  <input type="checkbox" checked={checked} onChange={(e) => marcarHabito(habito.id, date, e.target.checked)}/>
                </div>
              )
            })}
            <div className="p-2 text-center bg-gray-900">{checksSemana}</div>
          </div>
        )
      })}
      </div>
      <div className="bg-gray-700 p-4 rounded-2xl mt-6">
        <h3 className="text-lg font-semibold mb-2">Sequência de check-ins</h3>
        <ul className="space-y-1 text-sm">
          {habitos.map((habito) => {
            const diasSeguidos = contarDiasSeguidos(habito.id)
            return (
              <li key={habito.id} className="flex justify-between border-b border-gray-700 py-1" >
                <span>{habito.text}</span>
                <span>{diasSeguidos} dia(s)</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
