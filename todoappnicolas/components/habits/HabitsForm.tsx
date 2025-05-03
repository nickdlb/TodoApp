'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export interface HabitsFormProps {
  novoHabito: string
  setNovoHabito: (val: string) => void
  frequenciaTipo?: 'diariamente' | 'semanalmente' | 'x' | 'semana'
  setFrequenciaTipo: (val: 'diariamente' | 'semanalmente' | 'x' | 'semana') => void
  frequenciaX: string
  setFrequenciaX: (val: string) => void
  onAdicionar: () => void
}

export default function HabitsForm({
  novoHabito,
  setNovoHabito,
  frequenciaTipo,
  setFrequenciaTipo,
  frequenciaX,
  setFrequenciaX,
  onAdicionar
}: HabitsFormProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap items-center">
      <Input
        value={novoHabito}
        onChange={(e) => setNovoHabito(e.target.value)}
        placeholder="Novo hábito..."
        className="bg-gray-800 text-white w-full sm:w-[45%]"
      />

      <div className="w-full sm:w-[35%]">
        <Select onValueChange={(val) => setFrequenciaTipo(val as any)} value={frequenciaTipo}>
          <SelectTrigger className="bg-gray-800 text-white">
            <SelectValue placeholder="Frequência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diariamente">Diariamente</SelectItem>
            <SelectItem value="semanalmente">Semanalmente</SelectItem>
            <SelectItem value="x">X por Semana</SelectItem>
            <SelectItem value="semana">Escolher dias da semana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frequenciaTipo === 'x' && (
        <Input
          type="number"
          min={1}
          value={frequenciaX}
          onChange={(e) => setFrequenciaX(e.target.value)}
          placeholder="Quantas vezes?"
          className="bg-gray-800 text-white w-full sm:w-[20%]"
        />
      )}

      <Button
        onClick={onAdicionar}
        className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
      >
        <PlusCircle size={18} />
        Adicionar
      </Button>
    </div>
  )
}
