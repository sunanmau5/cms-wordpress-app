export function toRouteName(pathname: string): string {
  return pathname.replace(/-/g, " ").replace(/\//g, "");
}
