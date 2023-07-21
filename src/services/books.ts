import { Book } from 'houdoku-extension-lib/dist/types';
import { v4 as uuidv4 } from 'uuid';
import persistantStore from '../util/persistantStore';
import storeKeys from '../constants/storeKeys.json';

export type BookLocations = {
  locations: string;
};

const getLocations = (bookId: string): BookLocations => {
  const val = persistantStore.read(`${storeKeys.BOOKS.BOOK_LOCATIONS}${bookId}`);
  return val === null ? '' : JSON.parse(val);
};

const saveLocations = (bookId: string, loactions: BookLocations) => {
  persistantStore.write(`${storeKeys.BOOKS.BOOK_LOCATIONS}${bookId}`, JSON.stringify(loactions));
};

const deleteLocations = (bookId: string) => {
  persistantStore.remove(`${storeKeys.BOOKS.BOOK_LOCATIONS}${bookId}`);
};

const fetchBookList = (): Book[] => {
  const val = persistantStore.read(`${storeKeys.BOOKS.SERIES_LIST}`);
  return val === null ? [] : JSON.parse(val);
};

const fetchBook = (bookId: string): Book | null => {
  const book: Book | undefined = fetchBookList().find((s) => s.id === bookId);
  return book || null;
};

const upsertBook = (book: Book): Book => {
  const seriesId = book.id ? book.id : uuidv4();
  const newBook: Book = { ...book, id: seriesId };

  const existingList = fetchBookList().filter((s: Book) => s.id !== newBook.id);

  persistantStore.write(
    `${storeKeys.BOOKS.SERIES_LIST}`,
    JSON.stringify([...existingList, newBook])
  );
  return newBook;
};

const removeBook = (book: Book): void => {
  persistantStore.write(
    `${storeKeys.BOOKS.SERIES_LIST}`,
    JSON.stringify(fetchBookList().filter((s: Book) => s.id !== book.id))
  );
};

export default {
  removeBook,
  upsertBook,
  fetchBookList,
  fetchBook,
  getLocations,
  saveLocations,
  deleteLocations,
};
