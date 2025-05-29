'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, CalendarIcon, Check } from 'lucide-react'
import { format } from 'date-fns'
import { useTaskContext } from '@/contexts/TaskContext'
import { useTaskActions } from '@/utils/taskUtils'
import type { Task } from '@/contexts/TaskContext'

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const {
    editingTaskId,
    setEditingTaskId
  } = useTaskContext()

  const {
    closeTask,
    uncloseTask,
    handleEditTask,
    handleSaveTask,
    handleSaveTaskDate,
    handleDeleteTask
  } = useTaskActions()

  const [localText, setLocalText] = useState(task.text)
  const [localDate, setLocalDate] = useState('')
  const dateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingTaskId === task.id) {
      setLocalText(task.text)
      const date = new Date(task.date_task)
      const iso = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
      setLocalDate(iso)
    }
  }, [editingTaskId, task])

  const openDatetimePicker = () => {
    dateInputRef.current?.showPicker?.()
  }

  const handleSaveAll = async () => {
    await handleSaveTask(task.id, localText)
    await handleSaveTaskDate(task.id, localDate)
    setEditingTaskId(null)
  }

  return (
    <li className="w-full flex items-center gap-4 py-2 px-4 rounded-xl text-white bg-gray-700">
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
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveAll()
            }}
            className="pl-1 text-white bg-gray-200 border-none !ring-0 h-5"
          />
        ) : (
          <>
            <span className='ml-1 text-sm h-5'>{task.text}</span>
            {task.tags && (
              <div className="ml-1 text-xs text-gray-400 font-semibold">
                Tags: {task.tags}
              </div>
            )}
          </>
        )}
        {editingTaskId === task.id ? (
          <div className="ml-1 mt-1 text-xs text-gray-400 font-semibold flex items-center gap-2">
            <Button
              type="button"
              onClick={openDatetimePicker}
              variant="ghost"
              size="icon"
              className="p-1 h-auto w-auto"
            >
              <CalendarIcon size={16} />
            </Button>
            <span className="bg-gray-800 rounded px-2 py-1 text-white">
              {localDate ? format(new Date(localDate), 'dd/MM/yyyy HH:mm') : 'Sem data'}
            </span>
            <input
              ref={dateInputRef}
              type="datetime-local"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
              className="sr-only"
            />
          </div>
        ) : (
          <div
            className="ml-1 text-xs text-gray-400 font-semibold cursor-pointer"
            onClick={() => handleEditTask(task.id, task.text)}
            title="Clique para editar"
          >
            {new Date(task.date_task).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {editingTaskId === task.id ? (
          <div className="bg-gray-800 rounded-sm h-7 w-7 flex items-center justify-center">
            <Check
              size={18}
              className="text-white cursor-pointer hover:text-green-300"
              onClick={handleSaveAll}
            />
          </div>
        ) : (
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
  )
}
