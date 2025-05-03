'use client'

import { useTaskContext } from '@/contexts/TaskContext'
import { Button } from '@/components/ui/button'

export default function TaskFilterBar() {
  const { filter, setFilter } = useTaskContext()

  const filters = ['Ativa', 'Concluida', 'all']

  return (
    <div className="flex gap-2">
      {filters.map(status => (
        <Button
          key={status}
          className={`bg-gray-700 text-white ${
            filter === status
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-700'
              : ''
          }`}
          onClick={() => setFilter(status)}
        >
          {status === 'all' ? 'Todas' : status}
        </Button>
      ))}
    </div>
  )
}
