'use client'

import { useTaskContext } from '@/contexts/TaskContext'
import { useTaskActions } from '@/utils/taskUtils'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { isWithinInterval } from 'date-fns'

const TaskListGrouped = () => {
  const {
    tasks, filter, sortCriteria, dateRange,
    editingTaskId, editingTaskText,
    setEditingTaskId, setEditingTaskText,
    expandedDates, setExpandedDates,
    groupBy
  } = useTaskContext()

  const {
    closeTask,
    uncloseTask,
    handleEditTask,
    handleSaveTask,
    handleDeleteTask
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
    <div className="scrollbarcss mt-2 px-4 pt-3 pb-5 max-h-[500px] overflow-y-auto bg-gray-800  rounded-xl min-w-[840px]">
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
                  <button
                    onClick={() => toggleDate(date)}
                    className="flex gap-2 items-center text-white font-semibold"
                  >
                    <span>{date}</span>
                    <span className="text-sm text-gray-400 font-normal">({group.length})</span>
                    {expandedDates.includes(date) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}

                {(groupBy !== 'date' || expandedDates.includes(date)) && (
                  <ul className="mt-2 space-y-2">
                    {group.map(task => (
                      <li
                        key={task.id}
                        className="w-full flex items-center gap-4 py-2 px-4 rounded-xl text-white bg-gray-700"
                      >
                        <Checkbox
                          checked={task.status === 'Concluida'}
                          onCheckedChange={() =>
                            task.status === 'Ativa'
                              ? closeTask(task.id)
                              : uncloseTask(task.id)
                          }
                        />
                        <div className="flex flex-col flex-grow">
                          {editingTaskId === task.id ? (
                            <Input
                              value={editingTaskText}
                              onChange={(e) => setEditingTaskText(e.target.value)}
                              onBlur={() => handleSaveTask(task.id, editingTaskText)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTask(task.id, editingTaskText)
                              }}
                              className="text-white bg-gray-200 border-none ring-0 h-6 pl-0"
                            />
                          ) : (
                            <span>{task.text}</span>
                          )}
                          <div className="text-xs text-gray-400 font-semibold">
                            {new Date(task.date_task).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {editingTaskId !== task.id && (
                            <div className="bg-gray-800 rounded-sm h-7 w-7 flex items-center justify-center">
                              <Edit
                                size={18}
                                className="text-white cursor-pointer hover:text-gray-200"
                                onClick={() => handleEditTask(task.id, task.text)}
                              />
                            </div>
                          )}
                          <div className="bg-gray-800 rounded-sm h-7 w-7 flex items-center justify-center">
                            <Trash2
                              size={18}
                              className="text-white cursor-pointer hover:text-gray-200"
                              onClick={() => handleDeleteTask(task.id)}
                            />
                          </div>
                        </div>
                      </li>
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
