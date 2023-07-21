import { ScrollArea, Text } from '@mantine/core';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Book } from 'houdoku-extension-lib';
import { activeBookListState } from '../../state/bookStates';
import BooksControlBar from './BooksControlBar';
import BooksGrid from './BooksGrid';
import RemoveBookModal from './RemoveBookModal';
import { bookLibrarySortState } from '../../state/settingStates';
import { LibrarySort } from '../../models/types';

type Props = unknown;

const Books: React.FC<Props> = () => {
  const [removeModalShowing, setRemoveModalShowing] = useState(false);
  const [removeModalBook, setRemoveModalBook] = useState<Book | null>(null);
  const bookList = useRecoilValue(activeBookListState);
  const librarySort = useRecoilValue(bookLibrarySortState);

  const renderEmptyMessage = () => {
    return (
      <Text align="center" style={{ paddingTop: '30vh' }}>
        Your library is empty. Add{' '}
        <Text component="span" color="cyan" weight={700}>
          Books
        </Text>{' '}
        to your Books library
      </Text>
    );
  };

  const getFilteredList = (): Book[] => {
    const filteredList = bookList.filter((book: Book) => {
      if (!book) return false;
      return true;
    });

    //  sort by title desc
    switch (librarySort) {
      case LibrarySort.TitleAsc:
        return filteredList.sort((a: Book, b: Book) => a.title.localeCompare(b.title));
      case LibrarySort.TitleDesc:
        return filteredList.sort((a: Book, b: Book) => b.title.localeCompare(a.title));
      default:
        return filteredList;
    }
  };

  return (
    <>
      <BooksControlBar />
      <ScrollArea style={{ height: 'calc(100vh - 24px - 72px)' }} pr="xl" mr={-16}>
        {bookList.length > 0 ? (
          <>
            <RemoveBookModal
              book={removeModalBook}
              showing={removeModalShowing}
              close={() => setRemoveModalShowing(false)}
            />
            <BooksGrid
              getFilteredList={getFilteredList}
              showRemoveModal={(book) => {
                setRemoveModalBook(book);
                setRemoveModalShowing(true);
              }}
            />
          </>
        ) : (
          renderEmptyMessage()
        )}
      </ScrollArea>
    </>
  );
};

export default Books;
