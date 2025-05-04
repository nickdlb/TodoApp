'use client'

import { useTaskContext } from '@/contexts/TaskContext'
import { useTaskActions } from '@/utils/taskUtils'
import { ChevronDown, ChevronRight} from 'lucide-react'
import { isWithinInterval} from 'date-fns'
import TaskItem from './TaskItem'


const TaskListGrouped = () => {
  const {
    tasks, filter, sortCriteria, dateRange,
    expandedDates, setExpandedDates,
    groupBy
  } = useTaskContext()

  const {
    closeTask,
    uncloseTask,
    handleEditTask,
    handleSaveTask,
    handleDeleteTask,
    handleSaveTaskDate,
  } = useTaskActions()

  const getFilteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status.toLowerCase() === filter.toLowerCase()
  })

  const sortedTasks = [...getFilteredTasks].sort((a, b) => {
    if (sortCriteria === 'name-asc') return a.text.localeCompare(b.text)
    if (sortCriteria === 'name-desc') return b.text.localeCompare(a.text)
    const d1 = new Date(a.created_at).getTime()
    const d2 = new Date(b.created_at).getTime()
    return sortCriteria === 'date-asc' ? d1 - d2 : d2 - d1
  })

  const tasksInRange = dateRange?.from && dateRange?.to
    ? sortedTasks.filter(t =>
      isWithinInterval(new Date(t.date_task), { start: dateRange.from!, end: dateRange.to! })
    )
    : sortedTasks

  const grouped = groupBy === 'date'
    ? tasksInRange.reduce((acc, task) => {
      const key = new Date(task.date_task).toLocaleDateString('pt-BR')
      if (!acc[key]) acc[key] = []
      acc[key].push(task)
      return acc
    }, {} as Record<string, typeof tasks>)
    : { '': tasksInRange }

  const toggleDate = (date: string) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    )
  }

  return (
    <div className="scrollbarcss mt-2 px-4 pt-3 pb-5 max-h-[500px] overflow-y-auto bg-gray-800 rounded-xl min-w-[840px]">
      <ul className="flex flex-col gap-4">
        {Object.keys(grouped).length === 0 ? (
          <li className="text-center text-gray-400 font-semibold py-4">
            Nenhuma Tarefa {filter === 'all' ? '' : filter}
          </li>
        ) : (
          Object.entries(grouped)
            .sort(([dateA], [dateB]) => {
              const d1 = new Date(dateA.split('/').reverse().join('-')).getTime()
              const d2 = new Date(dateB.split('/').reverse().join('-')).getTime()
              return sortCriteria === 'date-asc' ? d1 - d2 : d2 - d1
            })
            .map(([date, group]) => (
              <li key={date}>
                {groupBy === 'date' && (
                  <button onClick={() => toggleDate(date)} className="flex gap-2 items-center text-white font-semibold w-full">
                    <span>{date}</span>
                    <span className="text-sm text-gray-400 font-normal">({group.length})</span>
                    {expandedDates.includes(date) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}

                {(groupBy !== 'date' || expandedDates.includes(date)) && (
                  <ul className="mt-2 space-y-2">
                    {group.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </ul>
                )}
              </li>
            ))
        )}
      </ul>
    </div>
  )
}

export default TaskListGrouped
