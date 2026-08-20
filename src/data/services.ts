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
    description: 'Websites profissionais que representam sua marca com excelência e credibilidade.',
  },
  {
    id: 'ecommerce',
    roman: 'II',
    title: 'E-commerce',
    description: 'Lojas virtuais completas para vender seus produtos 24 horas por dia.',
  },
  {
    id: 'apps',
    roman: 'III',
    title: 'Aplicativos mobile',
    description: 'Apps nativos e híbridos para iOS e Android que engajam seus usuários.',
  },
  {
    id: 'sistemas',
    roman: 'IV',
    title: 'Sistemas web',
    description: 'Sistemas customizados para automatizar e otimizar seus processos.',
  },
  {
    id: 'landing',
    roman: 'V',
    title: 'Landing pages',
    description: 'Páginas de alta conversão para campanhas e lançamentos.',
  },
  {
    id: 'seo',
    roman: 'VI',
    title: 'SEO e marketing',
    description: 'Estratégias digitais para aumentar sua visibilidade online.',
  },
]
