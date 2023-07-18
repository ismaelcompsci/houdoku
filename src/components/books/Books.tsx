import { ScrollArea, Text } from '@mantine/core';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Book } from 'houdoku-extension-lib';
import { bookListState } from '../../state/bookStates';
import BooksControlBar from './BooksControlBar';
import BooksGrid from './BooksGrid';
import RemoveBookModal from './RemoveBookModal';

type Props = unknown;

const Books: React.FC<Props> = () => {
  const [removeModalShowing, setRemoveModalShowing] = useState(false);
  const [removeModalBook, setRemoveModalBook] = useState<Book | null>(null);
  const bookList = useRecoilValue(bookListState);

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
              bookList={bookList}
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
