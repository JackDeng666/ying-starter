export type StrictOmit<T, TKey extends keyof T> = Pick<T, Exclude<keyof T, TKey>>
export type MakeRequired<T, TKey extends keyof T> = Omit<T, TKey> & Required<Pick<T, TKey>>
