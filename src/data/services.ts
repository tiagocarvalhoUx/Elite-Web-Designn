export interface Service {
  readonly id: string
  readonly roman: string
  readonly title: string
  readonly description: string
}

export const services: readonly Service[] = [
  {
    id: 'sites',
    roman: 'I',
    title: 'Sites institucionais',
    description:
      'Sites profissionais que comunicam autoridade, credibilidade e geram valor para a sua marca.',
  },
  {
    id: 'ecommerce',
    roman: 'II',
    title: 'E-commerce de luxo',
    description:
      'Lojas virtuais sofisticadas, seguras e otimizadas para proporcionar experiências de compra inesquecíveis.',
  },
  {
    id: 'apps',
    roman: 'III',
    title: 'Aplicativos',
    description:
      'Aplicações sob medida para iOS, Android e web que elevam sua operação a um novo patamar.',
  },
]
