export type SiteNavItem = {
  to: string;
  label: string;
  icon: string;
  exact?: boolean;
};

export const siteNavItems: SiteNavItem[] = [
  { to: '/', label: 'Главная', icon: 'fa-home', exact: true },
  { to: '/services', label: 'Прайс', icon: 'fa-clipboard-list' },
  { to: '/#equipment', label: 'Оборуд.', icon: 'fa-screwdriver-wrench' },
  { to: '/#about', label: 'О компании', icon: 'fa-building' },
  { to: '/#form', label: 'Заявка', icon: 'fa-pen-to-square' },
];

function splitNavTarget(to: string) {
  const [pathPart = '/', hashPart] = to.split('#');
  return {
    path: pathPart || '/',
    hash: hashPart ? `#${hashPart}` : '',
  };
}

export function isNavItemActive(path: string, item: SiteNavItem, hash = '') {
  const target = splitNavTarget(item.to);
  const currentHash = hash || '';

  if (target.hash) {
    return path === target.path && currentHash === target.hash;
  }

  if (item.exact) {
    return path === item.to && !currentHash;
  }

  return path === item.to || path.startsWith(`${item.to}/`);
}
