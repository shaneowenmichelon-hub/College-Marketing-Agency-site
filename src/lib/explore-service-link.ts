/**
 * Link name for a service card.
 *
 * "Explore {name}" is the visible label when it fits the card. A three-up
 * card at the `md` breakpoint has about 18 characters of text-sm bold after
 * padding. Wider blocks (the services hub columns) pass a higher limit.
 * When the name does not fit, the visible label stays "Learn more" and the
 * service is added for assistive tech.
 */
export function exploreServiceLink(
  name: string,
  maxLength = 18,
): { visible: string; srOnly?: string } {
  const explore = `Explore ${name}`;
  if (explore.length <= maxLength) return { visible: explore };
  return { visible: "Learn more", srOnly: `about campus ${name}` };
}
