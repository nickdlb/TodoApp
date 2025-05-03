export const diasDaSemana = [
  { label: 'Dom', value: 'domingo', short: 'Dom' },
  { label: 'Seg', value: 'segunda', short: 'Seg' },
  { label: 'Ter', value: 'terca', short: 'Ter' },
  { label: 'Qua', value: 'quarta', short: 'Qua' },
  { label: 'Qui', value: 'quinta', short: 'Qui' },
  { label: 'Sex', value: 'sexta', short: 'Sex' },
  { label: 'Sáb', value: 'sabado', short: 'Sáb' },
]

export const abreviarDias = (dias: string[]): string => {
  return dias
    .map((d) => diasDaSemana.find((ds) => ds.value === d)?.short || d)
    .join(', ')
}
