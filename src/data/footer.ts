import type { NavItem } from './navigation'

export interface FooterColumn {
  readonly id: string
  readonly title: string
  readonly links: readonly NavItem[]
}

/**
 * Navegação secundária.
 *
 * Sendo uma página única, vários rótulos apontam para a mesma âncora — cada um
 * leva à seção que de fato responde por aquele assunto. Nenhum destino aponta
 * para uma rota inexistente.
 */
export const footerColumns: readonly FooterColumn[] = [
  {
    id: 'agencia',
    title: 'Agência',
    links: [
      { id: 'sobre', label: 'Sobre nós', href: '#servicos' },
      { id: 'metodologia', label: 'Metodologia', href: '#servicos' },
      { id: 'diferenciais', label: 'Diferenciais', href: '#servicos' },
      { id: 'depoimentos', label: 'Depoimentos', href: '#autoridade' },
    ],
  },
  {
    id: 'servicos',
    title: 'Serviços',
    links: [
      { id: 'sites', label: 'Sites institucionais', href: '#servicos' },
      { id: 'ecommerce', label: 'E-commerce', href: '#servicos' },
      { id: 'apps', label: 'Aplicativos', href: '#servicos' },
      { id: 'suporte', label: 'Manutenção e suporte', href: '#contato' },
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfólio',
    links: [
      { id: 'todos', label: 'Todos os projetos', href: '#projetos' },
      { id: 'cases', label: 'Cases de sucesso', href: '#projetos' },
      { id: 'marcas', label: 'Marcas atendidas', href: '#projetos' },
    ],
  },
]
