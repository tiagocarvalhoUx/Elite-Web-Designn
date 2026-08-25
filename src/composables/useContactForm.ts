import { computed, reactive, ref } from 'vue'
import { site } from '@/data/site'
import { identify, track } from '@/lib/metaPixel'

export interface ContactFields {
  name: string
  email: string
  whatsapp: string
  projectType: string
  message: string
  /** Honeypot: preenchido apenas por bots. */
  company: string
}

export type FieldName = Exclude<keyof ContactFields, 'company'>
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
const MIN_PHONE_DIGITS = 10

/**
 * Endpoint opcional. Quando `VITE_CONTACT_ENDPOINT` não está definido, a solicitação
 * é entregue pelo cliente de e-mail do usuário — sem inventar uma API inexistente.
 */
const ENDPOINT = import.meta.env['VITE_CONTACT_ENDPOINT'] as string | undefined

export function digitsOf(value: string): string {
  return value.replace(/\D/g, '')
}

/** Máscara progressiva no formato brasileiro corrente: (18) 98114-2927 */
export function maskPhone(value: string): string {
  const d = digitsOf(value).slice(0, 11)
  if (d.length <= 2) return d
  const ddd = `(${d.slice(0, 2)})`
  if (d.length <= 6) return `${ddd} ${d.slice(2)}`
  if (d.length <= 10) return `${ddd} ${d.slice(2, 6)}-${d.slice(6)}`
  return `${ddd} ${d.slice(2, 7)}-${d.slice(7)}`
}

export function useContactForm() {
  const fields = reactive<ContactFields>({
    name: '',
    email: '',
    whatsapp: '',
    projectType: '',
    message: '',
    company: '',
  })

  const touched = reactive<Record<FieldName, boolean>>({
    name: false,
    email: false,
    whatsapp: false,
    projectType: false,
    message: false,
  })

  const status = ref<FormStatus>('idle')
  const submitAttempted = ref(false)

  const errors = computed<Partial<Record<FieldName, string>>>(() => {
    const next: Partial<Record<FieldName, string>> = {}

    if (fields.name.trim().length < 2) next.name = 'Informe seu nome completo.'
    if (!EMAIL_RE.test(fields.email.trim())) next.email = 'Informe um e-mail válido.'
    if (digitsOf(fields.whatsapp).length < MIN_PHONE_DIGITS)
      next.whatsapp = 'Informe o WhatsApp com DDD.'
    if (!fields.projectType) next.projectType = 'Selecione o tipo de projeto.'
    if (fields.message.trim().length < 10) next.message = 'Conte um pouco mais sobre o projeto.'

    return next
  })

  const isValid = computed(() => Object.keys(errors.value).length === 0)

  /** Um erro só aparece depois que o campo foi visitado ou o envio foi tentado. */
  function errorFor(field: FieldName): string | undefined {
    return touched[field] || submitAttempted.value ? errors.value[field] : undefined
  }

  function touch(field: FieldName): void {
    touched[field] = true
  }

  function onWhatsappInput(value: string): void {
    fields.whatsapp = maskPhone(value)
  }

  function buildBody(): string {
    return [
      `Nome: ${fields.name.trim()}`,
      `E-mail: ${fields.email.trim()}`,
      `WhatsApp: ${fields.whatsapp.trim()}`,
      `Tipo de projeto: ${fields.projectType}`,
      '',
      fields.message.trim(),
    ].join('\n')
  }

  function reset(): void {
    Object.assign(fields, {
      name: '',
      email: '',
      whatsapp: '',
      projectType: '',
      message: '',
      company: '',
    })
    ;(Object.keys(touched) as FieldName[]).forEach((key) => (touched[key] = false))
    submitAttempted.value = false
  }

  async function submit(): Promise<void> {
    if (status.value === 'submitting') return
    submitAttempted.value = true

    if (fields.company) {
      // Honeypot preenchido: encerra silenciosamente.
      status.value = 'success'
      return
    }
    if (!isValid.value) {
      status.value = 'idle'
      return
    }

    status.value = 'submitting'

    try {
      if (ENDPOINT) {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fields.name.trim(),
            email: fields.email.trim(),
            whatsapp: fields.whatsapp.trim(),
            projectType: fields.projectType,
            message: fields.message.trim(),
          }),
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
      } else {
        const subject = `Nova solicitação — ${fields.projectType}`
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(buildBody())}`
      }

      // A correspondência avançada usa o que a pessoa acabou de digitar; é o
      // que mais pesa na nota de qualidade do Meta. Precisa vir antes do
      // evento, senão o Lead sai sem esses dados.
      identify({ email: fields.email, phone: fields.whatsapp })
      track('Lead', {
        content_name: fields.projectType || 'Solicitação de proposta',
        content_category: 'Contato',
      })

      status.value = 'success'
      reset()
    } catch {
      status.value = 'error'
    }
  }

  return { fields, status, errorFor, touch, onWhatsappInput, submit }
}
