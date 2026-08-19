/** Opções do campo "Tipo de projeto" do formulário de contato. */
export const projectTypes = [
  'Site institucional',
  'E-commerce',
  'Aplicativo',
  'Redesign de site existente',
  'Manutenção e suporte',
  'Outro',
] as const

export type ProjectType = (typeof projectTypes)[number]
