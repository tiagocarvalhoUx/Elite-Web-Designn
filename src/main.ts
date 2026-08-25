import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'
import { initPixel } from './lib/metaPixel'

declare global {
  interface Window {
    __hideSplash?: () => void
  }
}

createApp(App).mount('#app')

initPixel()

/**
 * Avisa a abertura declarada no index.html de que o app já pintou. Ela também
 * some sozinha por tempo limite, então nada aqui é capaz de reter a página.
 */
window.__hideSplash?.()
