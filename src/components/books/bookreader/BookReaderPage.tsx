import { Rendition } from 'epubjs';
import React, { useEffect, useRef } from 'react';
import { EpubView } from 'react-reader';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import routes from '../../../constants/routes.json';
import { bookState } from '../../../state/bookStates';
import BookReaderHeader from './BookReaderHeader';
import styles from './bookReaderPage.css';
import BookSettingsModal from './BookSettingsModal';
import { bookThemeState } from '../../../state/settingStates';

const darkTheme = {
  background: '#1A1B1E',
  color: '#fff',
};

const lightTheme = {
  background: '#ffffff',
  color: '#09090b',
};

const BookReaderPage = () => {
  const navigate = useNavigate();
  const renditionRef = useRef<Rendition | null>(null);

  const bookInfo = useRecoilValue(bookState);
  const bookTheme = useRecoilValue(bookThemeState);

  console.log(bookTheme);

  const exitPage = () => {
    // save book pos before exit
    navigate(`${routes.EBOOKS}`);
  };

  const locationChanged = (value: string | number) => {};

  useEffect(() => {
    renditionRef.current?.themes.select(bookTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookTheme]);

  return (
    <div className={styles.content} tabIndex={0}>
      <BookSettingsModal />
      <BookReaderHeader exitPage={exitPage} />
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
                flow: 'scrolled',
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
