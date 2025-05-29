'use client'

import { useTaskContext } from '@/contexts/TaskContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TaskFilterBar() {
  const { filter, setFilter, tagFilter, setTagFilter } = useTaskContext()

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
      <Input
        type="text"
        placeholder="Filtrar por tag"
        value={tagFilter}
        onChange={(e) => setTagFilter(e.target.value)}
        className="bg-gray-800 text-white !ring-0"
      />
    </div>
  )
}
