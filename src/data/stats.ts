export interface Stat {
  readonly id: string
  readonly value: string
  readonly label: string
}

export const stats: readonly Stat[] = [
  { id: 'projetos', value: '150+', label: 'Projetos concluídos' },
  { id: 'satisfacao', value: '98%', label: 'Taxa de satisfação' },
  { id: 'experiencia', value: '5+', label: 'Anos de experiência' },
  { id: 'suporte', value: '24/7', label: 'Suporte e atendimento' },
]
