import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { LazyImageExtension } from './extension/lazy-image'
import { LazyImageListExtension } from './extension/lazy-image-list'

export const defaultExtensions = [
  StarterKit.configure({
    dropcursor: {
      color: 'var(--primary)'
    }
  }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TextStyleKit,
  LazyImageExtension,
  LazyImageListExtension
]
