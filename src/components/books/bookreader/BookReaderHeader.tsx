import { Box, Button, Center, Group, MantineTheme, Menu, ScrollArea } from '@mantine/core';
import React from 'react';

import { IconArrowLeft, IconChevronLeft, IconChevronRight, IconSettings } from '@tabler/icons';
import { constSelector, useRecoilState, useRecoilValue } from 'recoil';
import { NavItem } from 'epubjs';
import styles from './BookReaderHeader.css';
import { bookChapterListState, showingSettingsModalState } from '../../../state/bookStates';

//  eslint-disable-next-line
type Props = {
  exitPage: () => void;
  nextPage: () => void;
  prevPage: () => void;
  setChapter: (item: NavItem) => void;
  currentChapter: string | undefined;
};

const BookReaderHeader: React.FC<Props> = ({
  exitPage,
  prevPage,
  nextPage,
  setChapter,
  currentChapter,
}) => {
  const [showingSettingsModal, setShowingSettingsModal] = useRecoilState(showingSettingsModalState);
  const bookToc = useRecoilValue(bookChapterListState);

  const buttonStyles = (theme: MantineTheme) => ({
    root: {
      height: 24,
      fontSize: 12,
      color: theme.colors.gray[4],
      backgroundColor: theme.colors.dark[7],
      '&:hover': {
        backgroundColor: theme.colors.dark[4],
      },
    },
    leftIcon: {
      marginRight: 4,
    },
    rightIcon: {
      marginLeft: 0,
    },
  });

  return (
    <Box
      className={styles.container}
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[6],
      })}
    >
      <Center>
        <Group spacing={4} noWrap>
          <Button
            compact
            styles={buttonStyles}
            radius={0}
            leftIcon={<IconArrowLeft size={14} />}
            onClick={exitPage}
          >
            Go Back
          </Button>

          <Button
            px={2}
            compact
            styles={buttonStyles}
            radius={0}
            rightIcon={<IconChevronLeft size={16} />}
            onClick={() => prevPage()}
          />
          {bookToc.length !== 0 && (
            <Menu shadow="md" width={200} trigger="hover">
              <Menu.Target>
                <Button compact styles={buttonStyles} radius={0} pb={2}>
                  {currentChapter || 'Contents'}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <ScrollArea.Autosize maxHeight={220} style={{ width: '100%' }}>
                  {bookToc.map((relevantChapter: NavItem) => {
                    return (
                      <Menu.Item
                        key={relevantChapter.id}
                        onClick={() => {
                          setChapter(relevantChapter);
                        }}
                      >
                        {`${relevantChapter.label}`}
                      </Menu.Item>
                    );
                  })}
                </ScrollArea.Autosize>
              </Menu.Dropdown>
            </Menu>
          )}

          <Button
            px={2}
            compact
            styles={buttonStyles}
            radius={0}
            rightIcon={<IconChevronRight size={16} />}
            onClick={() => nextPage()}
          />

          <Button
            compact
            styles={buttonStyles}
            radius={0}
            leftIcon={<IconSettings size={14} />}
            onClick={() => setShowingSettingsModal(!showingSettingsModal)}
          >
            Settings
          </Button>
        </Group>
      </Center>
    </Box>
  );
};

export default BookReaderHeader;
