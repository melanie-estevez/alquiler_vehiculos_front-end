// src/services/http.ts
export function pickList<T = any>(raw: any): T[] {
  if (Array.isArray(raw)) return raw;

  // axios response: res.data
  const data = raw?.data ?? raw;

  // patrones comunes
  const candidates = [
    data?.data?.items,
    data?.items,
    data?.data,
    data?.results,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }

  return [];
}

export function pickItem<T = any>(raw: any): T {
  // axios response: res.data
  const data = raw?.data ?? raw;

  // patrones comunes
  return (data?.data ?? data) as T;
}