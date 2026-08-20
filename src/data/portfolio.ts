/**
 * Formato de um projeto do portfólio.
 *
 * O conteúdo em si não mora aqui: vem inteiro do painel em /admin, via Supabase
 * (ver `publicProjects.ts` para a leitura pública e `adminProjects.ts` para a
 * gestão). Este arquivo guarda apenas o contrato e as medidas compartilhadas.
 */

export interface PortfolioProject {
  readonly id: string
  readonly title: string
  readonly category: string
  readonly year: number
  readonly description: string
  readonly src: string
  readonly srcset: string
  /** Maior variante disponível — usada na ampliação. */
  readonly full: string
  readonly alt: string
  /** Opcional: URL pública do projeto, quando houver. */
  readonly href?: string
}

/** Proporção das molduras de projeto, em cartão e em esqueleto de carregamento. */
export const PROJECT_ASPECT = '2176 / 1300'
