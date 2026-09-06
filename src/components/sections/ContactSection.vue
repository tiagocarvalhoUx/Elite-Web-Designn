<script setup lang="ts">
import { computed } from 'vue'
import { site, whatsappUrlWith } from '@/data/site'
import { planMessage, usePlanIntent } from '@/composables/usePlanIntent'
import { projectTypes } from '@/data/projectTypes'
import { useContactForm } from '@/composables/useContactForm'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SiteContainer from '@/components/ui/SiteContainer.vue'
import FormField from '@/components/ui/FormField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const { fields, status, errorFor, touch, onWhatsappInput, submit } = useContactForm()

/*
 * A mensagem pode chegar pronta da seção de planos, com uma dezena de linhas.
 * Numa caixa de altura fixa a pessoa veria só o começo do que está prestes a
 * enviar. Contar as quebras de linha resolve sem medir o DOM — e continua
 * valendo quando o formulário é remontado depois de um envio.
 */
const messageRows = computed(() =>
  Math.min(16, Math.max(5, fields.message.split('\n').length + 1)),
)

/*
 * Na tela de sucesso, o botão de WhatsApp leva junto o plano escolhido. Quem
 * acabou de pedir orçamento do Premium e resolve falar agora não deveria
 * chegar com um "olá" solto, obrigando a repetir tudo que já preencheu.
 */
const planIntent = usePlanIntent()
const successWhatsapp = computed(() =>
  planIntent.value ? whatsappUrlWith(planMessage(planIntent.value.plan)) : site.whatsappUrl,
)

const BASE =
  'w-full bg-transparent font-sans text-[1.05rem] text-ivory transition-colors duration-300 ease-luxe placeholder:text-muted/80 hover:border-gold-500/60 focus:border-gold-300 focus:outline-none aria-invalid:border-[#e0a04a] lg:text-[0.95rem] lg:placeholder:text-muted/70'

/** Campo em filete, como na arte original. */
const CONTROL = `${BASE} border-0 border-b border-gold-500/80 px-0 py-3.5 lg:border-gold-500/35 lg:py-3`

/** Caixa fechada — só a mensagem, que precisa de área de escrita. */
const BOX = `${BASE} min-h-36 resize-y border border-gold-500/80 px-4 py-3.5 leading-relaxed lg:border-gold-500/35 lg:py-3`
</script>

<template>
  <section id="contato" class="section-y border-b border-gold-500/25 bg-ink-900">
    <SiteContainer>
      <SectionHeading title="Inicie seu projeto" data-reveal />

      <div class="mx-auto mt-12 max-w-4xl lg:mt-16">
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-300 ease-luxe"
          leave-active-class="transition-opacity duration-200 ease-luxe"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div
            v-if="status === 'success'"
            key="success"
            class="surface-luxury flex flex-col items-center gap-5 px-6 py-14 text-center"
            role="status"
          >
            <span
              class="inline-flex size-12 items-center justify-center rounded-full border border-gold-400/50 text-gold-300"
            >
              <AppIcon name="check" :size="22" />
            </span>
            <h3 class="font-display text-2xl text-ivory">Solicitação registrada</h3>
            <p class="max-w-[46ch] text-sm text-muted">
              Respondemos em até um dia útil. Se preferir falar agora, chame no WhatsApp.
            </p>
            <BaseButton :href="successWhatsapp" variant="outline" external>
              Falar no WhatsApp
            </BaseButton>
          </div>

          <form v-else key="form" novalidate data-reveal @submit.prevent="submit">
            <!-- Honeypot: invisível para pessoas, atraente para bots. -->
            <div class="sr-only" aria-hidden="true">
              <label for="company">Empresa</label>
              <input
                id="company"
                v-model="fields.company"
                type="text"
                tabindex="-1"
                autocomplete="off"
              />
            </div>

            <div class="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:gap-y-8">
              <div class="flex flex-col gap-10 lg:gap-8">
                <FormField id="nome" v-slot="slot" label="Nome" :error="errorFor('name')">
                  <input
                    :id="slot.id"
                    v-model="fields.name"
                    type="text"
                    name="name"
                    autocomplete="name"
                    placeholder="Seu nome completo"
                    :class="CONTROL"
                    :aria-invalid="slot.invalid"
                    :aria-describedby="slot.describedBy"
                    @blur="touch('name')"
                  />
                </FormField>

                <FormField id="email" v-slot="slot" label="E-mail" :error="errorFor('email')">
                  <input
                    :id="slot.id"
                    v-model="fields.email"
                    type="email"
                    name="email"
                    autocomplete="email"
                    inputmode="email"
                    placeholder="seu@email.com"
                    :class="CONTROL"
                    :aria-invalid="slot.invalid"
                    :aria-describedby="slot.describedBy"
                    @blur="touch('email')"
                  />
                </FormField>

                <FormField
                  id="whatsapp"
                  v-slot="slot"
                  label="WhatsApp"
                  :error="errorFor('whatsapp')"
                >
                  <input
                    :id="slot.id"
                    :value="fields.whatsapp"
                    type="tel"
                    name="whatsapp"
                    autocomplete="tel-national"
                    inputmode="tel"
                    placeholder="(18) 99999-9999"
                    :class="CONTROL"
                    :aria-invalid="slot.invalid"
                    :aria-describedby="slot.describedBy"
                    @input="onWhatsappInput(($event.target as HTMLInputElement).value)"
                    @blur="touch('whatsapp')"
                  />
                </FormField>
              </div>

              <div class="flex flex-col gap-10 lg:gap-8">
                <FormField
                  id="tipo"
                  v-slot="slot"
                  label="Tipo de projeto"
                  :error="errorFor('projectType')"
                >
                  <select
                    :id="slot.id"
                    v-model="fields.projectType"
                    name="projectType"
                    :class="[CONTROL, 'field-select cursor-pointer pr-8']"
                    :aria-invalid="slot.invalid"
                    :aria-describedby="slot.describedBy"
                    @blur="touch('projectType')"
                  >
                    <option value="" disabled>Selecione o tipo de projeto</option>
                    <option v-for="type in projectTypes" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                </FormField>

                <FormField id="mensagem" v-slot="slot" label="Mensagem" :error="errorFor('message')">
                  <textarea
                    :id="slot.id"
                    v-model="fields.message"
                    name="message"
                    :rows="messageRows"
                    placeholder="Conte-nos sobre seu projeto…"
                    :class="BOX"
                    :aria-invalid="slot.invalid"
                    :aria-describedby="slot.describedBy"
                    @blur="touch('message')"
                  />
                </FormField>
              </div>
            </div>

            <p v-if="status === 'error'" class="mt-8 text-center text-sm text-[#e0a04a]" role="alert">
              Não foi possível enviar agora. Tente novamente ou chame no
              <a
                :href="site.whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="underline underline-offset-4"
                >WhatsApp</a
              >.
            </p>

            <div class="mt-12 flex justify-center">
              <BaseButton type="submit" variant="solid" size="lg" :loading="status === 'submitting'">
                {{ status === 'submitting' ? 'Enviando…' : 'Enviar solicitação' }}
              </BaseButton>
            </div>
          </form>
        </Transition>
      </div>
    </SiteContainer>
  </section>
</template>

<style scoped>
/* Seta própria: o controle nativo destoa da paleta em Windows e Android. */
.field-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9' fill='none'%3E%3Cpath d='M1 1L7 7L13 1' stroke='%23c99b3b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 2px center;
}

.field-select option {
  background-color: var(--color-ink-800);
  color: var(--color-ivory);
}
</style>
