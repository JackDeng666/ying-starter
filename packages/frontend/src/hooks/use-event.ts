import { RefObject, useEffect } from 'react'

export type TargetEventMap<T> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : HTMLElementEventMap

export const useEvent = <T extends EventTarget = Window, K extends keyof TargetEventMap<T> = keyof TargetEventMap<T>>(
  event: K,
  handler?: (this: T, ev: TargetEventMap<T>[K]) => any,
  targetRef?: RefObject<T>,
  options?: boolean | AddEventListenerOptions
) => {
  useEffect(() => {
    if (!handler) return
    const currentTarget = (targetRef?.current ?? window) as T
    if (!currentTarget) return
    const listener = handler as EventListener
    currentTarget.addEventListener(event as string, listener, options)
    return () => {
      currentTarget.removeEventListener(event as string, listener, options)
    }
  }, [event, handler, targetRef, options])
}
