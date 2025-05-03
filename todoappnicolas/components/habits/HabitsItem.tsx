'use client'

import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Habito {
  id: string
  text: string
  frequency: string
  week_days?: string[]
  created_at: string
}

interface HabitsItemProps {
  habito: Habito
  abreviarDias: (dias: string[]) => string
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
}

export default function HabitsItem({
  habito,
  abreviarDias,
  onDelete,
  onEdit
}: HabitsItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(habito.text)

  const mostrarDias = Array.isArray(habito.week_days) && habito.week_days.length > 0

  const handleSave = () => {
    if (editText.trim() && editText !== habito.text) {
      onEdit(habito.id, editText.trim())
    }
    setIsEditing(false)
  }

  return (
    <li className="bg-gray-700 text-white px-4 py-2 rounded-md shadow-sm flex justify-between items-center">
      <div className="flex-grow">
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="bg-gray-200 text-black w-full"
            autoFocus
          />
        ) : (
          <>
            <div className="font-semibold">{habito.text}</div>
            <div className="text-sm text-gray-300">
              Frequência: {habito.frequency}
              {mostrarDias && (
                <span className="text-xs text-gray-400 ml-2">
                  • Dias: {abreviarDias(habito.week_days!)}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2 ml-4">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-800 rounded-sm h-7 w-7 flex items-center justify-center"
          >
            <Edit size={18} className="text-white hover:text-gray-300" />
          </button>
        )}
        <button
          onClick={() => onDelete(habito.id)}
          className="bg-gray-800 rounded-sm h-7 w-7 flex items-center justify-center"
        >
          <Trash2 size={18} className="text-white hover:text-gray-300" />
        </button>
      </div>
    </li>
  )
}
