import type { ProjectType } from './projectTypes'

export interface Plan {
  readonly id: string
  readonly name: string
  /** Uma linha dizendo para quem é o plano — evita que a escolha vire só preço. */
  readonly tagline: string
  /** Só o número: o "R$" é renderizado à parte, num corpo bem menor. */
  readonly price: string
  readonly features: readonly string[]
  /**
   * Opção do campo "Tipo de projeto" que o plano preenche sozinho no
   * formulário. Tipado contra a lista real: mudar uma opção lá quebra a
   * compilação aqui, em vez de deixar um `select` sem valor correspondente.
   */
  readonly projectType: ProjectType
  /**
   * Recomendação da casa. No máximo um plano deve ter — dois destaques não
   * destacam nada, e a seção perde justamente o que a torna decidível.
   */
  readonly featured?: boolean
  /** Selo do plano em destaque. */
  readonly badge?: string
}

export const plans: readonly Plan[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    tagline: 'Ideal para profissionais autônomos',
    price: '1.497',
    projectType: 'Site institucional',
    features: [
      'Site one page',
      'Design responsivo',
      'Formulário de contato',
      'Integração WhatsApp',
      'Hospedagem 1 ano',
      'Entrega em 7 dias',
    ],
  },
  {
    id: 'profissional',
    name: 'Profissional',
    tagline: 'Para empresas que querem crescer',
    price: '2.997',
    projectType: 'Site institucional',
    featured: true,
    badge: 'Mais escolhido',
    features: [
      'Até 5 páginas',
      'Design exclusivo',
      'SEO completo',
      'Blog integrado',
      'Painel administrativo',
      'Google Analytics 4',
      'Suporte 60 dias',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Soluções avançadas e e-commerce',
    price: '4.997',
    projectType: 'E-commerce',
    features: [
      'Páginas ilimitadas',
      'E-commerce ou SaaS',
      'Identidade visual',
      'Copywriting profissional',
      'Integração Pix e cartão',
      'Suporte 6 meses',
    ],
  },
]
