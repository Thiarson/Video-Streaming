export type DynamicObject<K extends string | number | symbol, V> = {
  [key in K]: V
}
