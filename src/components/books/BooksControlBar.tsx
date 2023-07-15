import { ipcRenderer } from 'electron';
import log from 'electron-log';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { Button, Group, Menu } from '@mantine/core';
import {
  IconBookUpload,
  IconCheck,
  IconLayoutBottombar,
  IconLayoutGrid,
  IconLayoutList,
  IconLetterA,
  IconPhoto,
} from '@tabler/icons';

import ipcChannels from '../../constants/ipcChannels.json';
import { bookListState, showingBookLibraryCtxMenuState } from '../../state/libraryStates';
import { handleBookAdded } from '../../util/bookActions';
import { bookLibraryViewState } from '../../state/settingStates';
import { LibraryView } from '../../models/types';

const BooksControlBar = () => {
  const [bookList, setBookList] = useRecoilState(bookListState);
  const [libraryView, setLibraryView] = useRecoilState(bookLibraryViewState);
  const setShowingContextMenu = useSetRecoilState(showingBookLibraryCtxMenuState);
  // const [libraryView, setLibraryView] = useRecoilState(libraryViewState);

  const handleAddBook = () => {
    ipcRenderer
      .invoke(
        ipcChannels.APP.SHOW_OPEN_DIALOG,
        false,
        [
          {
            name: 'Books',
            extensions: ['epub'],
          },
        ],
        'Choose your Epub file(s)'
      )
      .then(async (file: string) => {
        log.info(`Trying to add book: ${file}`);
        // UPDATE BOOK GRID WHEN THIS BOOK GETS ADDED
        // eslint-disable-next-line promise/always-return
        const book = await handleBookAdded(file[0]);
        if (book) setBookList([...bookList, book]);
      })
      .catch((error) => {
        log.debug(`Error failed to add book ${error.message}`);
        throw error;
      });
  };
  return (
    <Group position="apart" mb="md" noWrap>
      <Group position="left" align="left" spacing="xs" noWrap>
        <Button onClick={handleAddBook} leftIcon={<IconBookUpload size={16} />}>
          Add Book
        </Button>
        <Menu shadow="md" trigger="hover" closeOnItemClick={false} width={200}>
          <Menu.Target>
            <Button
              variant="default"
              onMouseEnter={() => {
                setShowingContextMenu(false);
              }}
            >
              Layout
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>View</Menu.Label>
            <Menu.Item
              icon={<IconLayoutGrid size={14} />}
              onClick={() => setLibraryView(LibraryView.GridCompact)}
              rightSection={libraryView === LibraryView.GridCompact ? <IconCheck size={14} /> : ''}
            >
              Compact Grid
            </Menu.Item>
            <Menu.Item
              icon={<IconLayoutBottombar size={14} />}
              onClick={() => setLibraryView(LibraryView.GridComfortable)}
              rightSection={
                libraryView === LibraryView.GridComfortable ? <IconCheck size={14} /> : ''
              }
            >
              Comfortable Grid
            </Menu.Item>
            <Menu.Item
              icon={<IconPhoto size={14} />}
              onClick={() => setLibraryView(LibraryView.GridCoversOnly)}
              rightSection={
                libraryView === LibraryView.GridCoversOnly ? <IconCheck size={14} /> : ''
              }
            >
              Cover Grid
            </Menu.Item>
            <Menu.Item
              icon={<IconLayoutList size={14} />}
              disabled
              // onClick={() => setLibraryView(LibraryView.List)}
              // rightSection={libraryView === LibraryView.List ? <IconCheck size={14} /> : ''}
            >
              List
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default BooksControlBar;
