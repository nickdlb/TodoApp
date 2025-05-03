'use client'

import { useTaskContext } from '@/contexts/TaskContext'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import GroupBySelector from './GroupBySelector'

export default function TaskSortAndDate() {
  const { sortCriteria, setSortCriteria, dateRange, setDateRange } = useTaskContext()
  return (
    <div className="flex gap-2">
      <div className="flex justify-end mb-4 ">
        <GroupBySelector />
      </div>
      <Select onValueChange={setSortCriteria} defaultValue={sortCriteria}>
        <SelectTrigger className="w-[180px] !bg-gray-800 text-white">
          <SelectValue placeholder="Ordenar por..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Data (Mais Recente)</SelectItem>
          <SelectItem value="date-asc">Data (Mais Antiga)</SelectItem>
          <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
          <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-auto justify-start text-left font-normal bg-gray-800 text-white hover:bg-gray-700"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                `${format(dateRange.from, 'dd/MM/yyyy')} – ${format(dateRange.to, 'dd/MM/yyyy')}`
              ) : (
                format(dateRange.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>Selecionar intervalo</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex gap-4 w-auto p-4 bg-white text-black">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
          <div className="flex flex-col justify-center gap-2 min-w-[150px]">
            <span className="text-md font-semibold pl-4">Atalhos</span>
            <Button variant="ghost" className="justify-start text-left text-sm"
              onClick={() => {
                const today = new Date()
                setDateRange({ from: today, to: today })
              }}
            >
              Hoje
            </Button>
            <Button variant="ghost" className="justify-start text-left text-sm"
              onClick={() => {
                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                setDateRange({ from: yesterday, to: yesterday })
              }}
            >
              Ontem
            </Button>
            <Button variant="ghost" className="justify-start text-left text-sm"
              onClick={() => {
                const end = new Date()
                const start = new Date()
                start.setDate(end.getDate() - 6)
                setDateRange({ from: start, to: end })
              }}
            >
              Últimos 7 dias
            </Button>
            <Button variant="ghost" className="justify-start text-left text-sm"
              onClick={() => {
                const end = new Date()
                const start = new Date()
                start.setDate(end.getDate() - 13)
                setDateRange({ from: start, to: end })
              }}
            >
              Últimos 14 dias
            </Button>
            <Button variant="ghost" className="justify-start text-left text-sm text-red-600"
              onClick={() => setDateRange(undefined)}
            >
              Limpar filtro
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
