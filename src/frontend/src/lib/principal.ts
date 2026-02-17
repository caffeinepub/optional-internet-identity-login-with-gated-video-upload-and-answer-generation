/**
 * Formats a principal ID for display by showing prefix and suffix with ellipsis
 */
export function formatPrincipal(principal: string, prefixLength = 5, suffixLength = 3): string {
  if (principal.length <= prefixLength + suffixLength) {
    return principal;
  }
  
  const prefix = principal.slice(0, prefixLength);
  const suffix = principal.slice(-suffixLength);
  
  return `${prefix}...${suffix}`;
}
