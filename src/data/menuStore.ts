import { useEffect, useState } from 'react'
import { defaultMenuSections, type MenuCategory } from './menu'

const MENU_STORAGE_KEY = 'bakery.menu.data.v1'
const MENU_UPDATED_EVENT = 'bakery:menu-updated'

function cloneDefaults(): MenuCategory[] {
  return JSON.parse(JSON.stringify(defaultMenuSections)) as MenuCategory[]
}

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function readMenuData(): MenuCategory[] {
  if (!hasWindow()) return cloneDefaults()

  const raw = window.localStorage.getItem(MENU_STORAGE_KEY)
  if (!raw) return cloneDefaults()

  try {
    const parsed = JSON.parse(raw) as MenuCategory[]
    if (!Array.isArray(parsed) || parsed.length === 0) return cloneDefaults()
    return parsed
  } catch {
    return cloneDefaults()
  }
}

export function writeMenuData(data: MenuCategory[]) {
  if (!hasWindow()) return
  window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(data))
  window.dispatchEvent(new CustomEvent(MENU_UPDATED_EVENT))
}

export function resetMenuData() {
  writeMenuData(cloneDefaults())
}

export function useMenuData() {
  const [data, setData] = useState<MenuCategory[]>(() => readMenuData())

  useEffect(() => {
    const refresh = () => setData(readMenuData())

    window.addEventListener(MENU_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(MENU_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return data
}
