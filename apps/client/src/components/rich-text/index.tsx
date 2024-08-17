import { cn } from '@/client/lib/utils'

import './rich-text.css'

type RichTextProps = {
  className?: string
  text?: string
}

export const RichText = ({ className, text }: RichTextProps) => {
  return <div className={cn('tiptap', className)} dangerouslySetInnerHTML={{ __html: text || '' }} />
}
