import React from 'react';

import { Book } from 'houdoku-extension-lib';
import { Overlay, SimpleGrid, Title, createStyles } from '@mantine/core';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { log } from 'electron-log';
import { useNavigate } from 'react-router-dom';
import {
  bookLibraryViewState,
  confirmRemoveSeriesState,
  libraryColumnsState,
} from '../../state/settingStates';
import styles from '../library/LibraryGrid.css';
import ExtensionImage from '../general/ExtensionImage';
import { bookListState, bookState } from '../../state/bookStates';
import { removeBook } from '../../features/library/utils';

import routes from '../../constants/routes.json';
import { LibraryView } from '../../models/types';

const useStyles = createStyles((theme) => ({
  ctxMenuContent: {
    width: 220,
    backgroundColor: theme.colors.dark[6],
    borderRadius: 6,
    overflow: 'hidden',
    padding: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.dark[4],
  },
  ctxSubMenuContent: {
    width: 240,
  },
  ctxMenuItem: {
    backgroundColor: theme.colors.dark[6],
    '&:hover, &[data-highlighted]': {
      backgroundColor: theme.colors.dark[7],
    },
    cursor: 'pointer',
    borderRadius: 3,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    height: 25,
    overflowY: 'hidden',
    position: 'relative',
    paddingLeft: 25,
    paddingRight: 5,
    userSelect: 'none',
    outline: 'none',
  },
  ctxMenuItemIndicator: {
    position: 'absolute',
    left: 0,
    width: 25,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

type Props = {
  getFilteredList: () => Book[];
  showRemoveModal: (book: Book) => void;
};

const BooksGrid: React.FC<Props> = (props: Props) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const setBookList = useSetRecoilState(bookListState);
  const libraryColumns = useRecoilValue(libraryColumnsState);
  const setBookState = useSetRecoilState(bookState);
  const libraryView = useRecoilValue(bookLibraryViewState);

  // TODO Make Book remove value
  const confirmRemoveBook = useRecoilValue(confirmRemoveSeriesState);

  const viewFunc = (book: Book) => {
    setBookState(book);
    navigate(`${routes.BOOKREADER}/${book.id}`);
  };

  const removeFunc = (book: Book) => {
    if (confirmRemoveBook) {
      props.showRemoveModal(book);
    } else {
      removeBook(book, setBookList);
    }
  };

  return (
    <>
      <SimpleGrid cols={libraryColumns} spacing="xs">
        {props.getFilteredList().map((book: Book) => {
          const coverSource = book.coverPath;

          return (
            <ContextMenu.Root key={`${book.id}-${book.title}`}>
              <ContextMenu.Trigger className={styles.ContextMenuTrigger}>
                <div>
                  <div
                    className={styles.coverContainer}
                    onClick={() => viewFunc(book)}
                    style={{
                      height: `calc(105vw / ${libraryColumns})`,
                    }}
                  >
                    <ExtensionImage
                      url={coverSource}
                      series={book}
                      alt={book.title}
                      width="100%"
                      height="100%"
                      style={{ objectFit: 'cover' }}
                    />
                    {libraryView === LibraryView.GridCompact ? (
                      <>
                        <Title
                          className={styles.seriesTitle}
                          order={5}
                          lineClamp={3}
                          p={4}
                          style={{ zIndex: 10 }}
                        >
                          {book.title}
                        </Title>
                        <Overlay
                          gradient="linear-gradient(0deg, #000000cc, #00000000 40%, #00000000)"
                          zIndex={5}
                        />
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                  {libraryView === LibraryView.GridComfortable ? (
                    <Title order={5} lineClamp={3} p={4}>
                      {book.title}
                    </Title>
                  ) : (
                    ''
                  )}
                </div>
              </ContextMenu.Trigger>
              <ContextMenu.Portal>
                <ContextMenu.Content className={classes.ctxMenuContent}>
                  <ContextMenu.Item
                    className={classes.ctxMenuItem}
                    onClick={() => removeFunc(book)}
                  >
                    Remove
                  </ContextMenu.Item>
                </ContextMenu.Content>
              </ContextMenu.Portal>
            </ContextMenu.Root>
          );
        })}
      </SimpleGrid>
    </>
  );
};

export default BooksGrid;
