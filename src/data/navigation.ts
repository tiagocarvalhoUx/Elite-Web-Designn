export interface NavItem {
  readonly id: string
  readonly label: string
  readonly href: string
}

/** Âncoras da página única. `id` casa com o id da <section> correspondente. */
export const primaryNav: readonly NavItem[] = [
  { id: 'inicio', label: 'Início', href: '#inicio' },
  { id: 'servicos', label: 'Serviços', href: '#servicos' },
  { id: 'projetos', label: 'Projetos', href: '#projetos' },
  { id: 'contato', label: 'Contato', href: '#contato' },
]
