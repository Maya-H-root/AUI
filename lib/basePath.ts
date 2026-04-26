/** GitHub project Pages base, e.g. `/my-repo`. Empty for root hosting or local dev. */
export function getBasePath(): string {
  const raw = process.env.BASE_PATH?.trim() ?? "";
  if (!raw || raw === "/") return "";
  return raw.startsWith("/") ? raw : `/${raw}`;
}
