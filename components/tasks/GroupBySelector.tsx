'use client'

import { useTaskContext } from '@/contexts/TaskContext'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

export default function GroupBySelector() {
  const { groupBy, setGroupBy } = useTaskContext()

  return (
    <Select onValueChange={setGroupBy} defaultValue={groupBy}>
      <SelectTrigger className="w-auto !bg-gray-800 text-white">
        <SelectValue placeholder="Agrupar por..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date">Agrupar por Data</SelectItem>
        <SelectItem value="none">Sem Agrupamento</SelectItem>
      </SelectContent>
    </Select>
  )
}