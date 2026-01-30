

type SuccessResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

function isObj(v: any) {
  return v !== null && typeof v === "object";
}

export function pickItem<T>(res: { data: any }): T {
  const d = res?.data;

  
  if (isObj(d) && "data" in d) return (d as SuccessResponse<T>).data;

  
  return d as T;
}

export function pickList<T>(res: { data: any }): T[] {
  const d = res?.data;

  if (isObj(d) && "data" in d) {
    const inner = (d as SuccessResponse<any>).data;

    
    if (Array.isArray(inner)) return inner as T[];

   
    if (isObj(inner) && Array.isArray((inner as any).items)) return (inner as any).items as T[];

    if (isObj(inner) && Array.isArray((inner as any).data)) return (inner as any).data as T[];

    return [];
  }

  if (isObj(d) && Array.isArray((d as any).items)) return (d as any).items as T[];

  
  if (Array.isArray(d)) return d as T[];

  return [];
}
