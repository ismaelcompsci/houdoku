import { NavItem, Rendition } from 'epubjs';
import React, { useEffect, useRef, useState } from 'react';
import { EpubView } from 'react-reader';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import routes from '../../../constants/routes.json';
import books, { BookLocations } from '../../../services/books';
import { bookChapterListState, bookState } from '../../../state/bookStates';
import { bookPageStyleState, bookThemeState } from '../../../state/settingStates';
import BookReaderHeader from './BookReaderHeader';
import styles from './bookReaderPage.css';
import BookSettingsModal from './BookSettingsModal';
import { flatten, getNavItemByHref } from '../../../util/bookUtils';
import { updateTitlebarText } from '../../../util/titlebar';

const darkTheme = {
  body: {
    background: '#1A1B1E',
    color: '#fff',
  },
  a: {
    color: '#0284c7',
    'text-underline-offset': '4px',
  },
  'a:hover': {
    'text-decoration': 'underline',
    'background-color': 'rgba(26, 27, 30, 0.9) !important',
    color: 'rgba(2, 132, 199, 0.9) !important',
  },
};

const lightTheme = {
  body: {
    background: '#fff',
    color: '#09090b',
  },
  a: {
    color: '#1e83d2',
    'text-underline-offset': '4px',
  },
  'a:hover': {
    'text-decoration': 'underline',
    'background-color': 'rgba(255,255,255, 0.9) !important',
    color: 'rgba(2, 132, 199, 0.9) !important',
  },
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
    updateTitlebarText('Houdoku');
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

  const locationChanged = async (value: string) => {
    if (bookInfo) {
      books.upsertBook({ ...bookInfo, currentCfi: value });
    }

    const labelFromLocation = getLabelFromLocation();
    setCurrentChapter(labelFromLocation);

    const book = renditionRef.current?.book;
    if (!book) {
      return;
    }

    const progress = book.locations.percentageFromCfi(value);

    const currentPage = book.locations.locationFromCfi(value) as unknown as number;

    const totalPages = book.locations.length();

    if (progress && bookInfo) {
      console.log('SETTING BOOK INFO');
      setBookInfo({ ...bookInfo, progress, currentPage, totalPages });
    }

    console.log('progress:', progress);
    console.log('Current page: ', currentPage);
    console.log('Total pages; ', totalPages);
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

  const getOrSaveLocations = async () => {
    const book = renditionRef.current?.book;
    if (!book) return;

    if (bookInfo) {
      // gets or sets locations
      const locations = books.getLocations(bookInfo.id);
      if (locations.locations === '' || !locations) {
        // Generates CFI for every X characters
        await book.locations.generate(1000); // takes a couple of seconds
        // saving an array of 1000 strings :/
        books.saveLocations(bookInfo.id, { locations: book.locations.save() } as BookLocations);
        return;
      }
      book.locations.load(locations.locations);
    }
  };

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

                getOrSaveLocations();

                renditionRef.current.themes.fontSize('140%');
                renditionRef.current.themes.register('dark', {
                  ...darkTheme,
                });
                renditionRef.current.themes.register('light', {
                  ...lightTheme,
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
