const fallbackLng = 'en'
const constLngs = [fallbackLng, 'zh'] as const

export type TIntlText = {
  [key in (typeof constLngs)[number]]?: string
}

export const clientLanguagesConfig = {
  fallbackLng,
  languages: constLngs.map(lng => lng) // 这里是为了把 as const 的数组转回普通类型
}
