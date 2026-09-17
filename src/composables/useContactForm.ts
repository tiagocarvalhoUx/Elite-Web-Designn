import { computed, reactive, ref, watch } from 'vue'
import { site } from '@/data/site'
import { identify, track } from '@/lib/metaPixel'
import { canStoreLeads, submitLead } from '@/data/leads'
import { usePlanIntent } from '@/composables/usePlanIntent'

export interface ContactFields {
  name: string
  whatsapp: string
  projectType: string
  /** Opcional e visível no formulário. */
  company: string
  /** Honeypot: preenchido apenas por bots. */
  website: string
}

export type FieldName = 'name' | 'whatsapp' | 'projectType'
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const MIN_PHONE_DIGITS = 10

/**
 * Endpoint externo opcional, para quem quiser mandar o lead para um CRM ou
 * automação própria. Tem precedência sobre o Supabase quando definido.
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
    whatsapp: '',
    projectType: '',
    company: '',
    website: '',
  })

  const touched = reactive<Record<FieldName, boolean>>({
    name: false,
    whatsapp: false,
    projectType: false,
  })

  const status = ref<FormStatus>('idle')
  const submitAttempted = ref(false)

  let autoType = ''

  const planIntent = usePlanIntent()

  function chosenPlan(): string | undefined {
    return planIntent.value?.plan.name
  }

  watch(planIntent, (intent) => {
    if (!intent) return
    const { plan } = intent

    if (!fields.projectType || fields.projectType === autoType) {
      autoType = plan.projectType
      fields.projectType = autoType
    }

    // Quem já enviou uma vez e volta para escolher um plano precisa do
    // formulário de volta — não do cartão de "solicitação registrada".
    if (status.value === 'success' || status.value === 'error') status.value = 'idle'
  })

  const errors = computed<Partial<Record<FieldName, string>>>(() => {
    const next: Partial<Record<FieldName, string>> = {}

    if (fields.name.trim().length < 2) next.name = 'Informe seu nome completo.'
    if (digitsOf(fields.whatsapp).length < MIN_PHONE_DIGITS)
      next.whatsapp = 'Informe o WhatsApp com DDD.'
    if (!fields.projectType) next.projectType = 'Selecione o tipo de projeto.'

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
      `WhatsApp: ${fields.whatsapp.trim()}`,
      `Tipo de projeto: ${fields.projectType}`,
      ...(fields.company.trim() ? [`Empresa: ${fields.company.trim()}`] : []),
      ...(chosenPlan() ? [`Plano de interesse: ${chosenPlan()}`] : []),
    ].join('\n')
  }

  /** Resumo interno para manter o lead legível no painel, sem pedir texto livre. */
  function leadSummary(): string {
    return [
      `Solicitação enviada pelo formulário rápido.`,
      `Tipo de projeto: ${fields.projectType}`,
      ...(fields.company.trim() ? [`Empresa: ${fields.company.trim()}`] : []),
      ...(chosenPlan() ? [`Plano de interesse: ${chosenPlan()}`] : []),
    ].join('\n')
  }

  function reset(): void {
    Object.assign(fields, {
      name: '',
      whatsapp: '',
      projectType: '',
      company: '',
      website: '',
    })
    ;(Object.keys(touched) as FieldName[]).forEach((key) => (touched[key] = false))
    submitAttempted.value = false
    autoType = ''
  }

  async function submit(): Promise<void> {
    if (status.value === 'submitting') return
    submitAttempted.value = true

    if (fields.website) {
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
      /*
       * Ordem deliberada. Antes, sem VITE_CONTACT_ENDPOINT, o formulário abria
       * um `mailto:` e declarava sucesso na sequência — mas `mailto:` não
       * confirma nada: no celular muitas vezes não abre app nenhum, e mesmo
       * abrindo a pessoa ainda precisa apertar "enviar". A tela dizia
       * "Solicitação registrada" com o lead perdido no caminho.
       *
       * Agora o Supabase é o destino padrão e o sucesso só aparece quando a
       * gravação confirma. O `mailto:` fica como último recurso, para o caso de
       * o projeto rodar sem banco configurado.
       */
      if (ENDPOINT) {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fields.name.trim(),
            whatsapp: fields.whatsapp.trim(),
            projectType: fields.projectType,
            company: fields.company.trim(),
            message: leadSummary(),
            plan: chosenPlan(),
          }),
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
      } else if (canStoreLeads) {
        await submitLead({
          name: fields.name,
          whatsapp: fields.whatsapp,
          projectType: fields.projectType,
          company: fields.company,
          message: leadSummary(),
          ...(chosenPlan() ? { plan: chosenPlan() as string } : {}),
        })
      } else {
        const subject = `Nova solicitação — ${fields.projectType}`
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(buildBody())}`
      }

      // A correspondência avançada usa o que a pessoa acabou de digitar; é o
      // que mais pesa na nota de qualidade do Meta. Precisa vir antes do
      // evento, senão o Lead sai sem esses dados.
      identify({ phone: fields.whatsapp })
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
