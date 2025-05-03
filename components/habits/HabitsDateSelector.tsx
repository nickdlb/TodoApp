'use client'

interface Dia {
  label: string
  value: string
}

interface HabitsDateSelectorProps {
  diasSelecionados: string[]
  toggleDia: (dia: string) => void
  diasDaSemana: Dia[]
}

export default function HabitsDateSelector({
  diasSelecionados,
  toggleDia,
  diasDaSemana
}: HabitsDateSelectorProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {diasDaSemana.map((dia) => (
        <button
          key={dia.value}
          type="button"
          onClick={() => toggleDia(dia.value)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            diasSelecionados.includes(dia.value)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {dia.label}
        </button>
      ))}
    </div>
  )
}
