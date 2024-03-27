import { useLayoutEffect } from 'react'

import { useRouter } from '@/router/hooks'

type ExternalLinkProps = {
  src: string
}

// 已经不会再进来
export default function ExternalLink({ src }: ExternalLinkProps) {
  const { back } = useRouter()
  useLayoutEffect(() => {
    window.open(src, '_black')
    back()
  }, [back, src])
  return <div />
}
