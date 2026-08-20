import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'

declare global {
  interface Window {
    __hideSplash?: () => void
  }
}

createApp(App).mount('#app')

/**
 * Avisa a abertura declarada no index.html de que o app já pintou. Ela também
 * some sozinha por tempo limite, então nada aqui é capaz de reter a página.
 */
window.__hideSplash?.()
