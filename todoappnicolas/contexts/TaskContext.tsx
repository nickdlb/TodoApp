'use client'

import { createContext, useContext, useState } from 'react'
import { DateRange } from 'react-day-picker'

export interface Task {
  id: string
  text: string
  created_at: string
  status: string
  closed_at: string | null
  date_task: string
}

interface TaskContextProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  filter: string
  setFilter: (filter: string) => void
  sortCriteria: string
  setSortCriteria: (sort: string) => void
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
  tarefa: string
  setTarefa: (text: string) => void
  tarefaData: Date | undefined
  setTarefaData: (date: Date | undefined) => void
  expandedDates: string[]
  setExpandedDates: React.Dispatch<React.SetStateAction<string[]>>
  editingTaskId: string | null
  setEditingTaskId: (id: string | null) => void
  editingTaskText: string
  setEditingTaskText: (text: string) => void
  groupBy: string
  setGroupBy: (group: string) => void
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined)

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [sortCriteria, setSortCriteria] = useState<string>('date-desc')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [tarefa, setTarefa] = useState<string>('')
  const [tarefaData, setTarefaData] = useState<Date | undefined>(new Date())
  const [expandedDates, setExpandedDates] = useState<string[]>([])
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskText, setEditingTaskText] = useState<string>('')
  const [groupBy, setGroupBy] = useState<string>('date')

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        filter,
        setFilter,
        sortCriteria,
        setSortCriteria,
        dateRange,
        setDateRange,
        tarefa,
        setTarefa,
        tarefaData,
        setTarefaData,
        expandedDates,
        setExpandedDates,
        editingTaskId,
        setEditingTaskId,
        editingTaskText,
        setEditingTaskText,
        groupBy,
        setGroupBy
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}