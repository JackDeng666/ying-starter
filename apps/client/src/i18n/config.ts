export const fallbackLng = 'en'
export const languages = [fallbackLng, 'zh']
export const defaultNS = 'basic'

export const languagesWithSlashes = languages.map(l => `/${l}`)

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    lng
  }
}
