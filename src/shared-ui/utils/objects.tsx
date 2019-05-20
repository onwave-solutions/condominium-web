export function noop() {}

export type KeyOf<T> = keyof T;

export type Normalize<T> = { [id: string]: T };

export function validateModel<T extends object>(
  model: T,
  requiredFields: KeyOf<T>[]
) {
  const missing: KeyOf<T>[] = [];
  for (const key of requiredFields) {
    if (!model[key]) missing.push(key);
  }

  return missing;
}

export function getErrorResponse(
  e: any
): { message: string; context?: string } {
  if (!e || !e.response || !e.response.data || !e.response.data.message)
    return { message: "Ha ocurrido un error" };
  return e.response.data;
}

export function getErrorStatusCode(e: any): number | undefined {
  return (
    (e && e.response && e.response.status && e.response.status) || undefined
  );
}
