'use client'

import { ListTodo, Repeat } from 'lucide-react'

interface FloatingMenuProps {
  current: 'tarefas' | 'habitos'
  onChange: (view: 'tarefas' | 'habitos') => void
}

export default function FloatingMenu({ current, onChange }: FloatingMenuProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-3 bg-gray-900 p-3 rounded-full shadow-2xl">
      <button
        onClick={() => onChange('tarefas')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${current === 'tarefas' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
        `}
      >
        <ListTodo size={18} />
        Tarefas
      </button>

      <button
        onClick={() => onChange('habitos')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${current === 'habitos' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
        `}
      >
        <Repeat size={18} />
        Hábitos
      </button>
    </div>
  )
}
