import { NavItem, Rendition } from 'epubjs';
import React, { useEffect, useRef, useState } from 'react';
import { EpubView } from 'react-reader';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import routes from '../../../constants/routes.json';
import books from '../../../services/books';
import { bookChapterListState, bookState } from '../../../state/bookStates';
import { bookPageStyleState, bookThemeState } from '../../../state/settingStates';
import BookReaderHeader from './BookReaderHeader';
import styles from './bookReaderPage.css';
import BookSettingsModal from './BookSettingsModal';

const darkTheme = {
  background: '#1A1B1E',
  color: '#fff',
};

const lightTheme = {
  background: '#ffffff',
  color: '#09090b',
};

type ParamTypes = {
  book_id: string;
};

// TODO: https://github.com/futurepress/epub.js/issues/759
// https://github.com/johnfactotum/epubjs-tips

const BookReaderPage = () => {
  const { book_id: bookId } = useParams<ParamTypes>();
  const navigate = useNavigate();

  const renditionRef = useRef<Rendition | null>(null);

  const [currentChapter, setCurrentChapter] = useState<string | undefined>(undefined);
  const [bookInfo, setBookInfo] = useRecoilState(bookState);
  const setToc = useSetRecoilState(bookChapterListState);

  const bookTheme = useRecoilValue(bookThemeState);
  const pageStyle = useRecoilValue(bookPageStyleState);

  const exitPage = () => {
    navigate(`${routes.EBOOKS}`);
  };

  const loadToc = (nav: NavItem[]) => {
    const flatten = (items: NavItem[]): NavItem[] => {
      return ([] as NavItem[]).concat(
        ...items.map((item) => [item, ...flatten(item.subitems || [])])
      );
    };
    setToc(flatten(nav));
  };

  const locationChanged = (value: string | number) => {
    if (bookInfo) {
      books.upsertBook({ ...bookInfo, currentCfi: value });
    }
    const toc = renditionRef.current?.book.navigation.toc;
    const book = renditionRef.current?.book;

    const getNavItemByHref = (href: string) => {
      if (!toc && !book) {
        return null;
      }

      const flatten = (arr: NavItem[]): NavItem[] => {
        return arr.reduce(
          (result: NavItem[], item) => [...result, item, ...flatten(item.subitems || [])],

          []
        );
      };

      const matchingItem = flatten(toc!).find(
        (item) => book!.canonical(item.href) === book!.canonical(href)
      );

      return matchingItem || null;
    };
    // @ts-expect-error wrong type
    const loc = (renditionRef.current?.currentLocation() as Location).start.href;

    setCurrentChapter(getNavItemByHref(loc)?.label);
  };

  const setChapter = (item: NavItem) => {
    renditionRef.current?.display(item.href);
  };

  const getBook = () => {
    const book = books.fetchBook(bookId!);
    setBookInfo(book!);
  };

  useEffect(() => {
    renditionRef.current?.flow(pageStyle);
  }, [pageStyle]);

  useEffect(() => {
    if (!bookInfo) {
      getBook();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookInfo]);

  useEffect(() => {
    renditionRef.current?.themes.select(bookTheme);
    // solution: https://github.com/pgaskin/ePubViewer/blob/5b4d4990350d0548a7634b7a4d95aa0f39e262ab/script.js#L408-L461
    // https://github.com/pgaskin/ePubViewer/blob/5b4d4990350d0548a7634b7a4d95aa0f39e262ab/script.js#L122

    // find better way to update current theme
    renditionRef.current?.clear();
    renditionRef.current?.start(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookTheme]);

  return (
    <div className={styles.content} tabIndex={0}>
      <BookSettingsModal />
      <BookReaderHeader
        exitPage={exitPage}
        setChapter={setChapter}
        currentChapter={currentChapter}
      />
      <div className={styles.reader}>
        {bookInfo ? (
          <div
            style={{
              height: '100%',
            }}
          >
            <EpubView
              url={bookInfo.path}
              location={bookInfo.currentCfi || 1}
              locationChanged={locationChanged}
              epubOptions={{
                flow: pageStyle,
                manager: 'continuous',
                allowPopups: false,
                minSpreadWidth: 9999,
              }}
              getRendition={(rendition) => {
                renditionRef.current = rendition;
                renditionRef.current.themes.fontSize('140%');
                renditionRef.current.themes.register('dark', {
                  body: darkTheme,
                });
                renditionRef.current.themes.register('light', {
                  body: lightTheme,
                });
                renditionRef.current.themes.select(bookTheme);

                loadToc(renditionRef.current.book.navigation.toc);
              }}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default BookReaderPage;
