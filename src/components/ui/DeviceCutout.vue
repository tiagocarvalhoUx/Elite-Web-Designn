<script setup lang="ts">
/**
 * Recorte de um dispositivo, via clip-path SVG.
 *
 * A silhueta é traçada por cima da foto (gerada com luz e reflexo já
 * embutidos), em vez de remover pixels claros globalmente — os realces
 * dourados e o vidro continuam intactos; só o fundo do estúdio é cortado.
 */
import desktop from '@/assets/editorial/device-desktop.webp'
import notebook from '@/assets/editorial/device-notebook.webp'
import tablet from '@/assets/editorial/device-tablet.webp'
import smartphone from '@/assets/editorial/device-smartphone.webp'

export type DeviceId = 'desktop' | 'notebook' | 'tablet' | 'smartphone'

const props = defineProps<{ device: DeviceId }>()

interface Silhouette {
  src: string
  width: number
  height: number
  viewBox: string
  path: string
}

const SILHOUETTES: Record<DeviceId, Silhouette> = {
  desktop: {
    src: desktop, width: 1509, height: 1042,
    viewBox: '250 32 1000 946',
    path: 'M 299 188 L 1209 43 Q 1233 40 1236 66 L 1237 766 Q 1236 790 1215 790 L 862 779 L 897 921 Q 901 933 885 940 L 806 962 L 457 940 Q 449 938 450 930 L 593 905 L 690 910 L 706 777 L 280 761 Q 262 760 263 740 L 283 213 Q 283 192 299 188 Z',
  },
  notebook: {
    src: notebook, width: 1672, height: 941,
    viewBox: '170 90 1380 766',
    path: 'M 198 99 Q 179 97 179 120 L 284 719 Q 286 735 304 741 L 953 847 Q 967 850 985 846 L 1541 739 L 1541 729 L 1046 660 L 944 184 Q 942 160 917 156 Z',
  },
  tablet: {
    src: tablet, width: 1145, height: 1374,
    viewBox: '230 68 670 1196',
    path: 'M 276 182 L 833 79 Q 886 70 891 122 L 891 1201 Q 890 1252 854 1253 L 278 1182 Q 243 1177 242 1138 L 242 229 Q 242 191 276 182 Z',
  },
  smartphone: {
    src: smartphone, width: 1024, height: 1536,
    viewBox: '232 86 552 1314',
    path: 'M 296 161 L 681 98 Q 743 88 768 148 Q 774 167 774 195 L 774 1320 Q 771 1387 718 1388 L 296 1361 Q 247 1359 244 1293 L 244 232 Q 244 177 296 161 Z',
  },
}

const silhouette = SILHOUETTES[props.device]
</script>

<template>
  <svg class="device-cutout" :viewBox="silhouette.viewBox" aria-hidden="true" focusable="false">
    <defs>
      <clipPath :id="`editorial-cutout-${device}`" clipPathUnits="userSpaceOnUse">
        <path :d="silhouette.path" />
      </clipPath>
    </defs>
    <image
      :href="silhouette.src"
      :width="silhouette.width"
      :height="silhouette.height"
      :clip-path="`url(#editorial-cutout-${device})`"
    />
  </svg>
</template>

<style scoped>
.device-cutout {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  filter: drop-shadow(0 24px 38px rgba(0, 0, 0, 0.62));
  user-select: none;
}
</style>
