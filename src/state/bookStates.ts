import { NavItem } from 'epubjs';
import { Book } from 'houdoku-extension-lib/dist/types';
import { atom, selector } from 'recoil';

//  eslint-disable-next-line
export const showingSettingsModalState = atom({
  key: 'bookReaderShowingSettingsModalState',
  default: false,
});

export const bookState = atom({
  key: 'bookState',
  default: undefined as Book | undefined,
});

// todo
export const bookListState = atom<Book[]>({
  key: 'bookSeriesList',
  default: [] as Book[],
});

export const activeBookListState = selector({
  key: 'activeBookLibrarySeriesList',
  get: ({ get }) => {
    const bookList = get(bookListState);
    return bookList;
  },
});

export const showingBookLibraryCtxMenuState = atom({
  key: 'libraryShowingBookCtxMenuState',
  default: false,
});

export const bookChapterListState = atom({
  key: 'bookChapterList',
  default: [] as NavItem[],
});
