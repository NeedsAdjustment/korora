/**
 * Login is presented as first name + last name, but Better Auth works with an
 * email address under the hood. This deterministic alias keeps the original
 * wedding-site login experience without exposing or collecting real emails.
 */
export function toDemoEmail(firstName: string, lastName: string): string {
  return `${normalizeNamePart(firstName)}.${normalizeNamePart(lastName)}@korora.demo`
}

export function normalizeNamePart(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}
