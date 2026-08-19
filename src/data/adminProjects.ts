import { ref } from 'vue'
import type { PortfolioProject } from './portfolio'

export interface AdminProject extends PortfolioProject {
  readonly createdAt: string
  readonly active: boolean
}

const STORAGE_KEY = 'elite-admin-projects'

function readProjects(): AdminProject[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as AdminProject[]
  } catch {
    return []
  }
}

export const adminProjects = ref<AdminProject[]>(readProjects())

function persist(): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProjects.value))
    return true
  } catch {
    return false
  }
}

export function saveAdminProject(project: AdminProject): boolean {
  const previous = [...adminProjects.value]
  const index = adminProjects.value.findIndex((item) => item.id === project.id)
  if (index >= 0) adminProjects.value[index] = project
  else adminProjects.value.unshift(project)
  if (persist()) return true
  adminProjects.value = previous
  return false
}

export function removeAdminProject(id: string): void {
  adminProjects.value = adminProjects.value.filter((project) => project.id !== id)
  persist()
}

export function toggleAdminProject(id: string): void {
  adminProjects.value = adminProjects.value.map((project) =>
    project.id === id ? { ...project, active: !project.active } : project,
  )
  persist()
}
