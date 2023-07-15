import { Box, Button, Center, Group, MantineTheme } from '@mantine/core';
import React from 'react';

import { IconArrowLeft, IconSettings } from '@tabler/icons';
import { useRecoilState } from 'recoil';
import styles from './BookReaderHeader.css';
import { showingSettingsModalState } from '../../../state/bookStates';

//  eslint-disable-next-line
type Props = {
  exitPage: () => void;
};

const BookReaderHeader: React.FC<Props> = ({ exitPage }) => {
  const [showingSettingsModal, setShowingSettingsModal] = useRecoilState(showingSettingsModalState);

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
