export type SiteNavItem = {
  to: string;
  label: string;
  icon: string;
  exact?: boolean;
};

export const siteNavItems: SiteNavItem[] = [
  { to: '/', label: 'Главная', icon: 'fa-home', exact: true },
  { to: '/services', label: 'Услуги', icon: 'fa-clipboard-list' },
  { to: '/equipment', label: 'Оборуд.', icon: 'fa-screwdriver-wrench' },
  { to: '/contacts', label: 'О компании', icon: 'fa-phone' },
  { to: '/form', label: 'Заявка', icon: 'fa-pen-to-square' },
];

export function isNavItemActive(path: string, item: SiteNavItem) {
  if (item.exact) return path === item.to;
  return path === item.to || path.startsWith(`${item.to}/`);
}
