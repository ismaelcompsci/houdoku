import { Book, NavItem } from 'epubjs';

export const flatten = (items: NavItem[]): NavItem[] => {
  return ([] as NavItem[]).concat(...items.map((item) => [item, ...flatten(item.subitems || [])]));
};

export const getNavItemByHref = (
  href: string,
  toc: NavItem[] | undefined,
  book: Book | undefined
) => {
  if (!toc && !book) {
    return null;
  }

  const matchingItem = flatten(toc!).find(
    (item) => book!.canonical(item.href) === book!.canonical(href)
  );

  return matchingItem || null;
};
