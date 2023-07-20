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
import { flatten, getNavItemByHref } from '../../../util/bookUtils';
import { updateTitlebarText } from '../../../util/titlebar';

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

  const nextPage = () => {
    renditionRef.current?.next();
  };

  const prevPage = () => {
    renditionRef.current?.prev();
  };

  const loadToc = (nav: NavItem[]) => {
    setToc(flatten(nav));
  };

  const getLabelFromLocation = () => {
    const toc = renditionRef.current?.book.navigation.toc;
    const book = renditionRef.current?.book;
    // @ts-expect-error wrong type set
    const loc = (renditionRef.current?.currentLocation() as Location).start.href;

    return getNavItemByHref(loc, toc, book)?.label;
  };

  const locationChanged = (value: string | number) => {
    if (bookInfo) {
      books.upsertBook({ ...bookInfo, currentCfi: value });
    }

    const labelFromLocation = getLabelFromLocation();
    setCurrentChapter(labelFromLocation);
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
    if (currentChapter) {
      updateTitlebarText(`${bookInfo?.title} - ${currentChapter}`);
      return;
    }
    updateTitlebarText(`${bookInfo?.title}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter, bookInfo]);

  useEffect(() => {
    // get book if the page is refreshed
    if (!bookInfo) {
      getBook();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        nextPage={nextPage}
        prevPage={prevPage}
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
