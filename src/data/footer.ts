import type { NavItem } from './navigation'

export interface FooterColumn {
  readonly id: string
  readonly title: string
  readonly links: readonly NavItem[]
}

/**
 * Navegação secundária. Todos os destinos são âncoras existentes nesta página —
 * nenhum link aponta para uma rota que ainda não existe.
 */
export const footerColumns: readonly FooterColumn[] = [
  {
    id: 'agencia',
    title: 'Agência',
    links: [
      { id: 'sobre', label: 'Sobre nós', href: '#servicos' },
      { id: 'metodologia', label: 'Metodologia', href: '#servicos' },
      { id: 'autoridade', label: 'Números', href: '#autoridade' },
    ],
  },
  {
    id: 'servicos',
    title: 'Serviços',
    links: [
      { id: 'sites', label: 'Sites institucionais', href: '#servicos' },
      { id: 'ecommerce', label: 'E-commerce de luxo', href: '#servicos' },
      { id: 'apps', label: 'Aplicativos', href: '#servicos' },
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfólio',
    links: [
      { id: 'todos', label: 'Todos os projetos', href: '#projetos' },
      { id: 'orcamento', label: 'Pedir orçamento', href: '#contato' },
    ],
  },
]
