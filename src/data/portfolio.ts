/**
 * Portfólio real da agência. As imagens são geradas por `npm run assets`
 * a partir das composições originais em /images (recorte acima do título gravado).
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

/** Proporção intrínseca dos recortes (2176 × 1300). */
export const PROJECT_ASPECT = '2176 / 1300'
export const PROJECT_WIDTH = 1400
export const PROJECT_HEIGHT = 836

const WIDTHS = [600, 900, 1400] as const

const files = import.meta.glob('../assets/portfolio/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function media(slug: string): Pick<PortfolioProject, 'src' | 'srcset' | 'full'> {
  return {
    src: files[`../assets/portfolio/${slug}-900.webp`],
    full: files[`../assets/portfolio/${slug}-1400.webp`],
    srcset: WIDTHS.map((w) => `${files[`../assets/portfolio/${slug}-${w}.webp`]} ${w}w`).join(', '),
  }
}

export const projects: readonly PortfolioProject[] = [
  {
    id: 'mrv',
    title: 'Projeto MRV',
    category: 'Site imobiliário',
    year: 2024,
    description: 'Uma plataforma imobiliária pensada para tornar a busca pelo imóvel ideal mais clara, rápida e envolvente.',
    alt: 'Notebook exibindo a plataforma de busca de imóveis do Projeto MRV.',
    ...media('mrv'),
  },
  {
    id: 'caetano',
    title: 'Caetano Hidráulica',
    category: 'Site institucional',
    year: 2024,
    description: 'Presença digital criada para transmitir confiança, agilidade e profissionalismo em cada ponto de contato.',
    alt: 'Notebook exibindo o site de serviços da Caetano Hidráulica, com orçamento e caça-vazamento.',
    ...media('caetano'),
  },
  {
    id: 'marcenaria',
    title: 'Projeto Marcenaria',
    category: 'Site institucional',
    year: 2024,
    description: 'Uma experiência institucional que transforma precisão, acabamento e cuidado artesanal em presença digital.',
    alt: 'Notebook exibindo o site institucional do Projeto Marcenaria.',
    ...media('marcenaria'),
  },
  {
    id: 'reza-vela',
    title: 'Reza Vela',
    category: 'E-commerce',
    year: 2024,
    description: 'E-commerce sensorial desenvolvido para valorizar o ritual, o aconchego e a delicadeza de cada criação.',
    alt: 'Notebook exibindo a loja virtual Reza Vela, de velas artesanais premium.',
    ...media('reza-vela'),
  },
  {
    id: 'petshop',
    title: 'Projeto Pet Shop',
    category: 'E-commerce',
    year: 2024,
    description: 'Uma loja virtual leve e acolhedora, desenhada para aproximar tutores dos melhores cuidados para seus pets.',
    alt: 'Notebook exibindo a loja virtual do Projeto Pet Shop.',
    ...media('petshop'),
  },
  {
    id: 'coffee',
    title: 'Coffee App',
    category: 'Aplicativo',
    year: 2024,
    description: 'Experiência mobile que une praticidade e desejo em um cardápio digital elegante, intuitivo e convidativo.',
    alt: 'Smartphone exibindo o cardápio do aplicativo The Coffee.',
    ...media('coffee'),
  },
]
