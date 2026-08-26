<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import {
  adminProjects,
  loadProjects,
  projectsError,
  projectsLoading,
  removeAdminProject,
  saveAdminProject,
  toggleAdminProject,
  uploadProjectImage,
  type AdminProject,
} from '@/data/adminProjects'
import {
  leads,
  leadsError,
  leadsLoading,
  loadLeads,
  removeLead,
  toggleLeadHandled,
} from '@/data/adminLeads'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

type Page = 'dashboard' | 'projects' | 'leads' | 'editor'

const session = ref<Session | null>(null)
const isAuthenticated = computed(() => session.value !== null)
const authReady = ref(false)
const loginError = ref('')
const loginLoading = ref(false)

const page = ref<Page>('dashboard')
const query = ref('')
const status = ref('all')
const editingId = ref<string | null>(null)
const formError = ref('')
const saving = ref(false)

const credentials = reactive({ email: '', password: '' })
const form = reactive({
  title: '',
  category: 'Site institucional',
  year: new Date().getFullYear(),
  description: '',
  href: '',
  active: true,
  /** Blob otimizado aguardando upload; nulo quando a imagem não mudou. */
  imageBlob: null as Blob | null,
  /** URL só para exibir a prévia (object URL local ou URL pública do Storage). */
  imagePreview: '',
  /** Caminho já gravado no bucket, ao editar um projeto existente. */
  imagePath: '',
})

let previewObjectUrl = ''

function setPreview(url: string, isObjectUrl: boolean): void {
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl)
  previewObjectUrl = isObjectUrl ? url : ''
  form.imagePreview = url
}

const filteredProjects = computed(() =>
  adminProjects.value.filter((project) => {
    const matchesQuery = `${project.title} ${project.category}`
      .toLowerCase()
      .includes(query.value.toLowerCase())
    const matchesStatus =
      status.value === 'all' || (status.value === 'active' ? project.active : !project.active)
    return matchesQuery && matchesStatus
  }),
)

onMounted(async () => {
  if (!isSupabaseConfigured || !supabase) {
    authReady.value = true
    return
  }
  const { data } = await supabase.auth.getSession()
  session.value = data.session
  authReady.value = true
  if (session.value) await Promise.all([loadProjects(), loadLeads()])

  supabase.auth.onAuthStateChange((_event, next) => {
    session.value = next
    if (next) {
      void loadProjects()
      void loadLeads()
    } else {
      adminProjects.value = []
      leads.value = []
    }
  })
})

onBeforeUnmount(() => {
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl)
})

/**
 * Cada falha de login tem uma saída diferente — dizer sempre "senha incorreta"
 * faria alguém repetir a senha certa indefinidamente por causa de um e-mail
 * não confirmado.
 */
function loginMessage(code: string | undefined, status: number | undefined): string {
  if (code === 'email_not_confirmed')
    return 'Este usuário existe, mas o e-mail não foi confirmado. No Supabase, marque "Auto Confirm User" ao criá-lo.'
  if (code === 'over_request_rate_limit' || status === 429)
    return 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.'
  if (status === undefined) return 'Sem conexão com o servidor. Verifique sua internet.'
  return 'E-mail ou senha incorretos.'
}

async function login(): Promise<void> {
  if (!supabase) {
    loginError.value = 'Supabase não configurado. Defina as variáveis em .env.local.'
    return
  }
  loginLoading.value = true
  loginError.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email.trim(),
    password: credentials.password,
  })

  loginLoading.value = false
  if (error) {
    loginError.value = loginMessage(error.code, error.status)
    return
  }
  credentials.password = ''
}

async function logout(): Promise<void> {
  await supabase?.auth.signOut()
  page.value = 'dashboard'
}

function resetForm(): void {
  editingId.value = null
  formError.value = ''
  setPreview('', false)
  Object.assign(form, {
    title: '',
    category: 'Site institucional',
    year: new Date().getFullYear(),
    description: '',
    href: '',
    active: true,
    imageBlob: null,
    imagePath: '',
  })
}

function openEditor(project?: AdminProject): void {
  resetForm()
  if (project) {
    editingId.value = project.id
    Object.assign(form, {
      title: project.title,
      category: project.category,
      year: project.year,
      description: project.description,
      href: project.href ?? '',
      active: project.active,
      imagePath: project.imagePath,
      imageBlob: null,
    })
    setPreview(project.full, false)
  }
  page.value = 'editor'
}

/** Redimensiona e recomprime no navegador antes de subir — economiza banda e Storage. */
async function onImage(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > 15_000_000) {
    formError.value = 'A imagem é muito grande. Escolha um arquivo de até 15 MB.'
    input.value = ''
    return
  }

  try {
    formError.value = 'Otimizando imagem...'
    const bitmap = await createImageBitmap(file)
    // 1400 px cobre a ampliação (~1024 px) e os cartões em retina (~740 px).
    // Em 1800 px cada projeto chegava a 238 kB e disputava banda com o LCP.
    const scale = Math.min(1, 1400 / bitmap.width, 1000 / bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas indisponível')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.82),
    )
    if (!blob) throw new Error('Conversão falhou')

    form.imageBlob = blob
    setPreview(URL.createObjectURL(blob), true)
    formError.value = ''
  } catch {
    formError.value = 'Não foi possível otimizar essa imagem. Tente usar JPG, PNG ou WebP.'
    input.value = ''
  }
}

async function submitProject(): Promise<void> {
  formError.value = ''

  if (!form.imageBlob && !form.imagePath) {
    formError.value = 'Selecione uma imagem para o projeto.'
    return
  }
  if (!form.title.trim() || !form.description.trim() || !form.category.trim()) {
    formError.value = 'Preencha título, descrição e categoria.'
    return
  }

  saving.value = true
  try {
    const previousPath = form.imagePath
    const imagePath = form.imageBlob
      ? await uploadProjectImage(form.imageBlob, form.title)
      : previousPath

    await saveAdminProject({
      id: editingId.value ?? undefined,
      title: form.title,
      category: form.category,
      year: Number(form.year),
      description: form.description,
      href: form.href,
      imagePath,
      active: form.active,
      previousImagePath: form.imageBlob ? previousPath : undefined,
    })

    page.value = 'projects'
    resetForm()
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Não foi possível salvar o projeto.'
  } finally {
    saving.value = false
  }
}

async function onToggleLead(id: string): Promise<void> {
  try {
    await toggleLeadHandled(id)
  } catch (error) {
    leadsError.value = error instanceof Error ? error.message : 'Falha ao atualizar o lead.'
  }
}

async function onRemoveLead(lead: { id: string; name: string }): Promise<void> {
  if (!confirm(`Excluir a solicitação de "${lead.name}"? Esta ação não pode ser desfeita.`)) return
  try {
    await removeLead(lead.id)
  } catch (error) {
    leadsError.value = error instanceof Error ? error.message : 'Falha ao excluir o lead.'
  }
}

/** dd/mm/aaaa às hh:mm — formato lido sem esforço por quem atende o lead. */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Link de WhatsApp já com a saudação preenchida, para responder num clique. */
function whatsappLink(lead: { whatsapp: string; name: string }): string {
  const digits = lead.whatsapp.replace(/\D/g, '')
  const e164 = digits.startsWith('55') ? digits : `55${digits}`
  const text = `Olá, ${lead.name.split(' ')[0]}! Recebemos sua solicitação no site da Elite Web Designer.`
  return `https://wa.me/${e164}?text=${encodeURIComponent(text)}`
}

/** Contador do menu: quantas solicitações ainda não foram atendidas. */
const pendingLeads = computed(() => leads.value.filter((lead) => !lead.handled).length)

async function onToggle(id: string): Promise<void> {
  try {
    await toggleAdminProject(id)
  } catch (error) {
    projectsError.value = error instanceof Error ? error.message : 'Falha ao alterar o status.'
  }
}

async function onRemove(project: AdminProject): Promise<void> {
  if (!confirm(`Excluir "${project.title}"? Esta ação não pode ser desfeita.`)) return
  try {
    await removeAdminProject(project.id)
  } catch (error) {
    projectsError.value = error instanceof Error ? error.message : 'Falha ao excluir o projeto.'
  }
}
</script>

<template>
  <main v-if="!authReady" class="grid min-h-screen place-items-center bg-ink-950 text-muted">
    <p class="label-caps">Carregando…</p>
  </main>

  <main v-else-if="!isAuthenticated" class="admin-login grid min-h-screen place-items-center bg-ink-950 px-5">
    <section class="w-full max-w-md border border-gold-500/35 bg-ink-900 p-8 shadow-luxe sm:p-10">
      <div class="mx-auto grid size-14 place-items-center border border-gold-400/50 font-display text-2xl text-gold-300">E</div>
      <p class="label-caps mt-6 text-center text-gold-400">Área exclusiva</p>
      <h1 class="mt-3 text-center text-4xl">Elite Admin</h1>
      <p class="mt-3 text-center text-sm text-muted">Entre para gerenciar seu portfólio.</p>
      <form class="mt-8 space-y-5" @submit.prevent="login">
        <label class="block">
          <span class="label-caps text-gold-300">E-mail</span>
          <input v-model="credentials.email" required type="email" autocomplete="username" class="mt-2 w-full border border-gold-500/30 bg-ink-950 px-4 py-3 text-ivory focus:border-gold-400" placeholder="seu@email.com" />
        </label>
        <label class="block">
          <span class="label-caps text-gold-300">Senha</span>
          <input v-model="credentials.password" required type="password" autocomplete="current-password" class="mt-2 w-full border border-gold-500/30 bg-ink-950 px-4 py-3 text-ivory focus:border-gold-400" placeholder="••••••••" />
        </label>
        <p v-if="loginError" class="text-sm text-red-400" role="alert">{{ loginError }}</p>
        <button :disabled="loginLoading" class="label-caps w-full border border-gold-400 bg-gold-400 px-5 py-3 text-ink-950 transition hover:bg-gold-200 disabled:opacity-60">{{ loginLoading ? 'Entrando…' : 'Entrar no painel' }}</button>
      </form>
      <a href="/" class="label-caps mt-6 block text-center text-muted hover:text-gold-300">Voltar ao site</a>
    </section>
  </main>

  <div v-else class="min-h-screen bg-ink-950 text-sand">
    <aside class="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-gold-500/20 bg-ink-900 p-5 md:flex md:flex-col">
      <a href="/" class="flex items-center gap-3 border-b border-gold-500/20 pb-5">
        <span class="grid size-9 place-items-center border border-gold-400/50 font-display text-gold-300">E</span>
        <span class="font-display text-xl text-ivory">Elite <i class="text-gold-400">Admin</i></span>
      </a>
      <nav class="mt-8 space-y-2">
        <button class="admin-nav" :class="{ 'is-active': page === 'dashboard' }" @click="page = 'dashboard'">Dashboard</button>
        <button class="admin-nav" :class="{ 'is-active': page === 'projects' }" @click="page = 'projects'">Projetos</button>
        <button class="admin-nav" :class="{ 'is-active': page === 'leads' }" @click="page = 'leads'">
          Solicitações
          <span v-if="pendingLeads" class="admin-badge">{{ pendingLeads }}</span>
        </button>
        <button class="admin-nav" :class="{ 'is-active': page === 'editor' }" @click="openEditor()">+ Novo projeto</button>
      </nav>
      <div class="mt-auto border-t border-gold-500/20 pt-5">
        <p class="text-sm text-ivory">Administrador</p>
        <button class="label-caps mt-3 text-red-400 hover:text-red-300" @click="logout">Sair</button>
      </div>
    </aside>

    <header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gold-500/20 bg-ink-950/90 px-5 backdrop-blur md:ml-64 md:px-8">
      <p class="font-display text-xl text-ivory md:hidden">Elite Admin</p>
      <div class="ml-auto flex gap-5">
        <a href="/" target="_blank" class="label-caps text-muted hover:text-gold-300">Ver site</a>
        <button class="label-caps text-red-400 md:hidden" @click="logout">Sair</button>
      </div>
    </header>

    <main class="px-5 py-8 md:ml-64 md:px-8 lg:px-12">
      <p v-if="projectsError" class="mb-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{{ projectsError }}</p>
      <p v-if="projectsLoading" class="mb-6 text-sm text-muted">Carregando projetos…</p>
      <template v-if="page === 'dashboard'">
        <div class="flex items-start justify-between gap-6">
          <div><p class="label-caps text-gold-400">Visão geral</p><h1 class="mt-2 text-4xl sm:text-5xl">Dashboard</h1></div>
          <button class="admin-primary" @click="openEditor()">+ Novo projeto</button>
        </div>
        <section class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article class="admin-stat"><span>Total de projetos</span><strong>{{ adminProjects.length }}</strong></article>
          <article class="admin-stat"><span>Projetos ativos</span><strong>{{ adminProjects.filter(p => p.active).length }}</strong></article>
          <article class="admin-stat"><span>Rascunhos</span><strong>{{ adminProjects.filter(p => !p.active).length }}</strong></article>
          <article class="admin-stat"><span>Categorias</span><strong>{{ new Set(adminProjects.map(p => p.category)).size }}</strong></article>
        </section>
        <section class="mt-10 border border-gold-500/20 bg-ink-900 p-5 sm:p-7">
          <div class="flex items-center justify-between"><h2 class="text-2xl">Projetos recentes</h2><button class="label-caps text-gold-400" @click="page = 'projects'">Ver todos</button></div>
          <div v-if="adminProjects.length" class="mt-6 divide-y divide-gold-500/15">
            <div v-for="project in adminProjects.slice(0, 5)" :key="project.id" class="flex items-center gap-4 py-4">
              <img :src="project.src" :alt="project.alt" class="h-12 w-20 border border-gold-500/20 object-cover" />
              <div class="min-w-0 flex-1"><p class="truncate text-ivory">{{ project.title }}</p><p class="text-xs text-muted">{{ project.category }}</p></div>
              <span class="label-caps" :class="project.active ? 'text-green-400' : 'text-muted'">{{ project.active ? 'Ativo' : 'Rascunho' }}</span>
            </div>
          </div>
          <p v-else class="mt-8 text-muted">Nenhum projeto cadastrado ainda.</p>
        </section>
      </template>

      <template v-else-if="page === 'projects'">
        <div class="flex items-start justify-between gap-6">
          <div><p class="label-caps text-gold-400">Gerenciamento</p><h1 class="mt-2 text-4xl sm:text-5xl">Projetos</h1></div>
          <button class="admin-primary" @click="openEditor()">+ Novo projeto</button>
        </div>
        <div class="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
          <input v-model="query" class="admin-input" placeholder="Buscar projetos..." />
          <select v-model="status" class="admin-input"><option value="all">Todos os status</option><option value="active">Ativos</option><option value="draft">Rascunhos</option></select>
        </div>
        <section v-if="filteredProjects.length" class="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <article v-for="project in filteredProjects" :key="project.id" class="overflow-hidden border border-gold-500/25 bg-ink-900">
            <img :src="project.src" :alt="project.alt" class="aspect-[16/9] w-full object-cover" />
            <div class="p-5"><div class="flex items-start justify-between gap-3"><h2 class="text-2xl">{{ project.title }}</h2><span class="text-xs" :class="project.active ? 'text-green-400' : 'text-muted'">{{ project.active ? '● Ativo' : '○ Rascunho' }}</span></div><p class="label-caps mt-2 text-gold-400">{{ project.category }}</p><p class="mt-3 line-clamp-2 text-sm text-muted">{{ project.description }}</p><div class="mt-5 flex gap-4 border-t border-gold-500/15 pt-4"><button class="text-sm text-gold-300" @click="openEditor(project)">Editar</button><button class="text-sm text-sand" @click="onToggle(project.id)">{{ project.active ? 'Desativar' : 'Ativar' }}</button><button class="ml-auto text-sm text-red-400" @click="onRemove(project)">Excluir</button></div></div>
          </article>
        </section>
        <div v-else class="mt-8 border border-dashed border-gold-500/25 py-20 text-center text-muted">Nenhum projeto encontrado.</div>
      </template>

      <template v-else-if="page === 'leads'">
        <div>
          <p class="label-caps text-gold-400">Formulário de contato</p>
          <h1 class="mt-2 text-4xl sm:text-5xl">Solicitações</h1>
        </div>

        <p v-if="leadsError" class="mt-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{{ leadsError }}</p>
        <p v-if="leadsLoading" class="mt-6 text-sm text-muted">Carregando solicitações…</p>

        <section v-if="leads.length" class="mt-8 flex flex-col gap-4">
          <!-- Não atendidas primeiro seria o ideal, mas a ordem cronológica
               ajuda mais: quem chegou antes espera há mais tempo. -->
          <article
            v-for="lead in leads"
            :key="lead.id"
            class="border bg-ink-900 p-5"
            :class="lead.handled ? 'border-gold-500/15 opacity-60' : 'border-gold-500/35'"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 class="text-2xl">{{ lead.name }}</h2>
                <p class="label-caps mt-1 text-gold-400">{{ lead.projectType }}</p>
              </div>
              <div class="text-right text-xs text-muted">
                <p>{{ formatDate(lead.createdAt) }}</p>
                <p class="mt-1" :class="lead.handled ? 'text-muted' : 'text-green-400'">
                  {{ lead.handled ? '✓ Atendido' : '● Novo' }}
                </p>
              </div>
            </div>

            <p class="mt-4 border-y border-gold-500/15 py-4 text-sm leading-relaxed text-sand whitespace-pre-line">{{ lead.message }}</p>

            <div class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a :href="`mailto:${lead.email}`" class="text-gold-300 hover:text-gold-200">{{ lead.email }}</a>
              <a :href="whatsappLink(lead)" target="_blank" rel="noopener noreferrer" class="text-gold-300 hover:text-gold-200">
                {{ lead.whatsapp }} — responder no WhatsApp ↗
              </a>
            </div>

            <div class="mt-5 flex gap-4 border-t border-gold-500/15 pt-4">
              <button class="text-sm text-sand" @click="onToggleLead(lead.id)">
                {{ lead.handled ? 'Marcar como novo' : 'Marcar como atendido' }}
              </button>
              <button class="ml-auto text-sm text-red-400" @click="onRemoveLead(lead)">Excluir</button>
            </div>
          </article>
        </section>

        <div v-else-if="!leadsLoading" class="mt-8 border border-dashed border-gold-500/25 py-20 text-center text-muted">
          Nenhuma solicitação recebida ainda.
        </div>
      </template>

      <template v-else>
        <button class="label-caps text-gold-400" @click="page = 'projects'">← Voltar</button>
        <h1 class="mt-4 text-4xl sm:text-5xl">{{ editingId ? 'Editar projeto' : 'Novo projeto' }}</h1>
        <form class="mt-10 max-w-4xl space-y-8" @submit.prevent="submitProject">
          <section class="admin-panel"><h2 class="text-2xl">Imagem do projeto</h2><label class="mt-5 grid min-h-64 cursor-pointer place-items-center overflow-hidden border border-dashed border-gold-400/40 bg-ink-950 text-center"><img v-if="form.imagePreview" :src="form.imagePreview" alt="Prévia" class="max-h-96 w-full object-contain" /><span v-else><strong class="block text-gold-300">Selecionar imagem</strong><small class="mt-2 block text-muted">JPG, PNG ou WebP · máximo 15 MB</small><small class="mt-1 block text-muted">A imagem será otimizada automaticamente.</small></span><input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="onImage" /></label></section>
          <section class="admin-panel"><h2 class="text-2xl">Informações básicas</h2><div class="mt-6 grid gap-5 sm:grid-cols-2"><label class="sm:col-span-2"><span class="admin-label">Título</span><input v-model="form.title" required class="admin-input mt-2" /></label><label class="sm:col-span-2"><span class="admin-label">Descrição</span><textarea v-model="form.description" required rows="5" class="admin-input mt-2 resize-y" /></label><label><span class="admin-label">Categoria</span><input v-model="form.category" required class="admin-input mt-2" /></label><label><span class="admin-label">Ano</span><input v-model="form.year" required type="number" class="admin-input mt-2" /></label><label class="sm:col-span-2"><span class="admin-label">Link do projeto</span><input v-model="form.href" type="url" class="admin-input mt-2" placeholder="https://" /></label></div></section>
          <section class="admin-panel flex items-center justify-between gap-6"><div><h2 class="text-2xl">Projeto ativo</h2><p class="mt-1 text-sm text-muted">Projetos ativos aparecem no portfólio público.</p></div><button type="button" role="switch" :aria-checked="form.active" class="h-7 w-12 rounded-full p-1 transition" :class="form.active ? 'bg-gold-400' : 'bg-ink-700'" @click="form.active = !form.active"><span class="block size-5 rounded-full bg-white transition" :class="form.active ? 'translate-x-5' : ''" /></button></section>
          <p v-if="formError" class="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{{ formError }}</p>
          <div class="flex justify-end gap-4"><button type="button" class="admin-secondary" @click="page = 'projects'">Cancelar</button><button :disabled="saving" class="admin-primary disabled:opacity-60">{{ saving ? 'Salvando…' : editingId ? 'Salvar alterações' : 'Criar projeto' }}</button></div>
        </form>
      </template>
    </main>
  </div>
</template>

<style scoped>
.admin-nav { width: 100%; border: 1px solid transparent; padding: .8rem 1rem; text-align: left; font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; transition: .2s; }
.admin-nav:hover, .admin-nav.is-active { border-color: rgb(170 126 49 / .3); background: rgb(201 155 59 / .09); color: var(--color-gold-300); }
/* Contador de solicitações não atendidas, para o menu não deixar lead esquecido. */
.admin-badge { display: inline-grid; place-items: center; min-width: 1.4rem; height: 1.4rem; margin-left: .5rem; padding: 0 .35rem; border-radius: 999px; background: var(--color-gold-400); color: var(--color-ink-950); font-size: .68rem; font-weight: 600; letter-spacing: 0; }
.admin-primary, .admin-secondary { border: 1px solid var(--color-gold-400); padding: .75rem 1.2rem; font-size: .72rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; }
.admin-primary { background: var(--color-gold-400); color: var(--color-ink-950); }
.admin-secondary { color: var(--color-gold-300); }
.admin-stat, .admin-panel { border: 1px solid rgb(170 126 49 / .22); background: var(--color-ink-900); padding: 1.5rem; }
.admin-stat span { display: block; color: var(--color-muted); font-size: .75rem; text-transform: uppercase; letter-spacing: .12em; }
.admin-stat strong { display: block; margin-top: .8rem; font-family: var(--font-display); font-size: 2.5rem; font-weight: 400; color: var(--color-ivory); }
.admin-input { width: 100%; border: 1px solid rgb(170 126 49 / .3); background: var(--color-ink-950); padding: .8rem 1rem; color: var(--color-ivory); }
.admin-label { font-size: .7rem; color: var(--color-gold-300); letter-spacing: .14em; text-transform: uppercase; }
</style>
