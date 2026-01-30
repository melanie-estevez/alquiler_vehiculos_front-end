export function pickList<T = any>(raw: any): T[] {
  if (Array.isArray(raw)) return raw;

  const data = raw?.data ?? raw;

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
  const data = raw?.data ?? raw;

  return (data?.data ?? data) as T;
}