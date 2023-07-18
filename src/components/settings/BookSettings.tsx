import React, { FC } from 'react';
import { Text, Box, Center, SegmentedControl } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons';
import { useRecoilState } from 'recoil';
import { bookThemeState } from '../../state/settingStates';
import { BookSetting } from '../../models/types';

const BookSettings = () => {
  const [bookTheme, setBookTheme] = useRecoilState(bookThemeState);

  const updateBookSetting = (bookSetting: BookSetting, value: any) => {
    switch (bookSetting) {
      case BookSetting.Theme:
        setBookTheme(value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Text pb="xs">Theme</Text>
      <SegmentedControl
        mb="sm"
        data={[
          {
            value: 'light',
            label: (
              <Center>
                <IconSun size={16} />
                <Box ml={10}>Light</Box>
              </Center>
            ),
          },
          {
            value: 'dark',
            label: (
              <Center>
                <IconMoon size={16} />
                <Box ml={10}>Dark</Box>
              </Center>
            ),
          },
        ]}
        value={bookTheme}
        onChange={(value) => updateBookSetting(BookSetting.Theme, value)}
      />
    </>
  );
};

export default BookSettings;
