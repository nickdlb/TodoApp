'use client'

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
}

export default function HabitsItem({ habito, abreviarDias }: HabitsItemProps) {
  const mostrarDias = Array.isArray(habito.week_days) && habito.week_days.length > 0

  return (
    <li className="bg-gray-700 text-white px-4 py-2 rounded-md shadow-sm flex justify-between items-center">
      <div>
        <div className="font-semibold">{habito.text}</div>
        <div className="text-sm text-gray-300">
          Frequência: {habito.frequency}
          {mostrarDias && (
            <span className="text-xs text-gray-400 ml-2">
              • Dias: {abreviarDias(habito.week_days!)}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}