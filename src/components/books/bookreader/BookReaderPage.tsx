import { Rendition } from 'epubjs';
import React, { useRef } from 'react';
import { EpubView } from 'react-reader';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import routes from '../../../constants/routes.json';
import { bookState } from '../../../state/libraryStates';
import BookReaderHeader from './BookReaderHeader';
import styles from './bookReaderPage.css';
import BookSettingsModal from './BookSettingsModal';

const darkTheme = {
  background: '#1A1B1E',
  color: '#fff',
};

const BookReaderPage = () => {
  const navigate = useNavigate();
  const renditionRef = useRef<Rendition | null>(null);
  const bookInfo = useRecoilValue(bookState);

  // const [book, setBook] = useState<Book | null>(null);

  const exitPage = () => {
    // save book pos before exit
    navigate(`${routes.EBOOKS}`);
  };

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
              location={bookInfo.currentCfi || 0}
              epubOptions={{
                flow: 'scrolled',
                manager: 'continuous',
                allowPopups: false,
                minSpreadWidth: 9999,
              }}
              getRendition={(rendition) => {
                renditionRef.current = rendition;
                renditionRef.current.themes.fontSize('140%');
                // renditionRef.current.themes.add({
                //   body: {
                //     background: theme,
                //     color: '#fff',
                //     padding: '0px 0px',
                //   },
                // });

                renditionRef.current.themes.register('dark', {
                  body: darkTheme,
                });
                renditionRef.current.themes.select('dark');
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
