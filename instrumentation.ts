function createStoragePolyfill() {
  const store = new Map<string, string>()

  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    setItem(key: string, value: string) {
      store.set(String(key), String(value))
    },
    removeItem(key: string) {
      store.delete(String(key))
    },
    clear() {
      store.clear()
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null
    },
    get length() {
      return store.size
    },
  }
}

export async function register() {
  const globalScope = globalThis as typeof globalThis & {
    localStorage?: Storage | Record<string, unknown>
    sessionStorage?: Storage | Record<string, unknown>
  }

  if (
    typeof globalScope.localStorage === 'object' &&
    globalScope.localStorage !== null &&
    typeof (globalScope.localStorage as Partial<Storage>).getItem !== 'function'
  ) {
    globalScope.localStorage = createStoragePolyfill() as unknown as Storage
  }

  if (
    typeof globalScope.sessionStorage === 'object' &&
    globalScope.sessionStorage !== null &&
    typeof (globalScope.sessionStorage as Partial<Storage>).getItem !== 'function'
  ) {
    globalScope.sessionStorage = createStoragePolyfill() as unknown as Storage
  }
}
