import { prisma } from './prisma'

export type ContentMap = Record<string, string>

export async function getContent(page: string, section: string, defaults: ContentMap = {}): Promise<ContentMap> {
  try {
    const blocks = await prisma.contentBlock.findMany({
      where: { page, section },
      orderBy: { sortOrder: 'asc' },
    })
    const fromDB = Object.fromEntries(blocks.map((b) => [b.key, b.value]))
    return { ...defaults, ...fromDB }
  } catch {
    return defaults
  }
}

export async function getAllPageContent(page: string): Promise<Record<string, ContentMap>> {
  try {
    const blocks = await prisma.contentBlock.findMany({ where: { page }, orderBy: { sortOrder: 'asc' } })
    const result: Record<string, ContentMap> = {}
    for (const b of blocks) {
      if (!result[b.section]) result[b.section] = {}
      result[b.section][b.key] = b.value
    }
    return result
  } catch {
    return {}
  }
}
