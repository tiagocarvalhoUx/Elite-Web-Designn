import { ref, type Ref } from 'vue'
import type { Plan } from '@/data/plans'

/**
 * Ponte entre a seção de planos e o formulário de contato.
 *
 * O estado vive no módulo, não dentro de um componente: quem escolhe o plano
 * (PlansSection) e quem preenche o formulário (ContactSection) são irmãos na
 * árvore, e passar isso por props obrigaria a levantar o estado até o App só
 * para atravessar duas seções que nada mais compartilham.
 */

export interface PlanIntent {
  readonly plan: Plan
  /**
   * Cresce a cada clique. Sem ele, escolher o mesmo plano duas vezes não mudaria
   * a referência e o formulário ignoraria o segundo clique — justamente o caso
   * de quem voltou para conferir e clicou de novo.
   */
  readonly token: number
}

const intent = ref<PlanIntent | null>(null)
let counter = 0

/** Texto que o campo "Mensagem" recebe: o plano inteiro, item por item. */
export function planMessage(plan: Plan): string {
  return [
    `Olá! Tenho interesse no plano ${plan.name} — R$ ${plan.price}.`,
    '',
    'Itens incluídos neste plano:',
    ...plan.features.map((feature) => `• ${feature}`),
    '',
    'Gostaria de confirmar o prazo de entrega e os próximos passos.',
  ].join('\n')
}

export function choosePlan(plan: Plan): void {
  counter += 1
  intent.value = { plan, token: counter }
}

export function usePlanIntent(): Ref<PlanIntent | null> {
  return intent
}
