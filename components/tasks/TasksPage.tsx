'use client'

import { useState, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import TaskForm from '@/components/tasks/TaskForm'
import TaskFilterBar from '@/components/tasks/TaskFilterBar'
import TaskSortAndDate from '@/components/tasks/TaskSortandDate'
import TaskListGrouped from '@/components/tasks/TaskListGrouped'
import FloatingMenu from '@/components/FloatingMenu'
import HabitosPage from '@/components/habits/HabitsPage'
import { useTaskActions } from '@/utils/taskUtils'

export default function HomeContent() {
  const [activeScreen, setActiveScreen] = useState<'tarefas' | 'habitos'>('tarefas')
  const { fetchAllTasks } = useTaskActions()

  useEffect(() => {
    fetchAllTasks()
  }, [fetchAllTasks])

  return (
    <div className="flex items-center justify-center">
      <main className="py-20 w-full px-6 max-w-5xl">
        <FloatingMenu current={activeScreen} onChange={setActiveScreen} />
        {activeScreen === 'tarefas' && (
          <>
            <h1 className="mt-8 mb-8 text-center text-3xl font-semibold dark:text-white text-gray-700">TodoApp</h1>
            <TaskForm />
            <div className="flex mt-6 gap-4 justify-between">
              <TaskFilterBar />
              <TaskSortAndDate />
            </div>
            <TaskListGrouped />
          </>
        )}

        {activeScreen === 'habitos' && (
          <HabitosPage />
        )}
        <Toaster />
      </main>
    </div>
  )
}
