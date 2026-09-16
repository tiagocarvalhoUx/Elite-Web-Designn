/**
 * Conteúdo da seção "O Ecossistema Elite" — carrossel 360° de dispositivos
 * entre o Hero e os Serviços. Quatro estações (desktop, notebook, tablet,
 * smartphone), cada uma com uma pausa de leitura própria antes de girar
 * para a próxima.
 */
import type { DeviceId } from '@/components/ui/DeviceCutout.vue'

export interface EcosystemStation {
  readonly id: DeviceId
  readonly name: string
  readonly kicker: string
  readonly title: string
  readonly text: string
}

export const ecosystemStations: readonly EcosystemStation[] = [
  {
    id: 'desktop',
    name: 'Desktop',
    kicker: 'Direção visual',
    title: 'Presença que permanece.',
    text: 'Uma experiência digital construída com matéria, luz e intenção.',
  },
  {
    id: 'notebook',
    name: 'Notebook',
    kicker: 'O atelier',
    title: 'Forma que aproxima.',
    text: 'Interfaces sob medida para marcas que não aceitam o comum.',
  },
  {
    id: 'tablet',
    name: 'Tablet',
    kicker: 'Detalhe',
    title: 'Cada camada importa.',
    text: 'Uma linguagem visual consistente em todos os pontos de contato.',
  },
  {
    id: 'smartphone',
    name: 'Smartphone',
    kicker: 'Ecossistema Elite',
    title: 'Luxo em qualquer tela.',
    text: 'A mesma presença, do primeiro toque ao último detalhe.',
  },
] as const
