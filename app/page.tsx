'use client'
import { TaskProvider } from '@/contexts/TaskContext'
import HomeContent from '@/components/tasks/TasksPage'

export default function Home() {
  return (
    <TaskProvider>
      <HomeContent />
    </TaskProvider>
  )
}