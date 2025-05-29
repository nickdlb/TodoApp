'use client'

import { useTaskContext } from '@/contexts/TaskContext'
import { useTaskActions } from '@/utils/taskUtils'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

export default function TaskForm() {
  const [tags, setTags] = useState('')
  const {
    tarefa,
    setTarefa,
    tarefaData,
    setTarefaData,
  } = useTaskContext()

  const { enviarFormulario } = useTaskActions()
  const inputRef = useRef<HTMLInputElement>(null)
  const [datetimeInput, setDatetimeInput] = useState('')

  useEffect(() => {
    if (tarefaData) {
      const localISO = new Date(tarefaData.getTime() - tarefaData.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
      setDatetimeInput(localISO)
    }
  }, [tarefaData])

  const handleIconClick = () => {
    inputRef.current?.showPicker?.() || inputRef.current?.click()
  }

  const handleDatetimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDatetimeInput(value)

    if (value) {
      const [datePart, timePart] = value.split('T')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hour, minute] = timePart.split(':').map(Number)
      const localDate = new Date(year, month - 1, day, hour, minute)
      setTarefaData(localDate)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!tarefa.trim()) return

    const [datePart, timePart] = datetimeInput.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute] = timePart.split(':').map(Number)
    const localDate = new Date(year, month - 1, day, hour, minute)

    enviarFormulario(tarefa, localDate, tags)
  }

  return (
    <form suppressHydrationWarning onSubmit={handleSubmit} className="flex gap-2 w-full flex-wrap">
      <Input
        suppressHydrationWarning
        className="w-[60%] !bg-gray-800 text-white !ring-0"
        value={tarefa}
        onChange={(e) => setTarefa(e.target.value)}
        placeholder="Digite sua tarefa..."
      />
      <Input
        suppressHydrationWarning
        className="w-[60%] !bg-gray-800 text-white !ring-0"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Digite as tags (separadas por vírgula)..."
      />
      <div className="w-[25%] flex gap-4 items-center">
        <Button
          type="button"
          onClick={handleIconClick}
          variant="outline"
          className="bg-gray-800 text-white hover:bg-gray-700 p-2"
        >
          <CalendarIcon className="h-5 w-5" />
        </Button>
        <span className="text-sm dark:text-white text-gray-900 bg-gray-800 font-semibold rounded-md p-2 !min-w-fit">
          {tarefaData ? format(tarefaData, 'dd/MM/yyyy HH:mm') : 'Sem data'}
        </span>
        <input
          ref={inputRef}
          type="datetime-local"
          value={datetimeInput}
          onChange={handleDatetimeChange}
          className="sr-only"
        />
        <Button type="submit" disabled={!tarefa.trim()}>
          Adicionar Tarefa
        </Button>
      </div>
    </form>
  )
}
