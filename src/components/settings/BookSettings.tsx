import React, { FC } from 'react';
import { Text, Box, Center, SegmentedControl, Checkbox } from '@mantine/core';
import { IconFile, IconMoon, IconSpacingVertical, IconSun } from '@tabler/icons';
import { useRecoilState } from 'recoil';
import { bookPageStyleState, bookThemeState } from '../../state/settingStates';
import { BookPageStyle, BookSetting } from '../../models/types';

const BookSettings = () => {
  const [bookTheme, setBookTheme] = useRecoilState(bookThemeState);
  const [pageStyle, setPageStyle] = useRecoilState(bookPageStyleState);

  const updateBookSetting = (bookSetting: BookSetting, value: any) => {
    switch (bookSetting) {
      case BookSetting.Theme:
        setBookTheme(value);
        break;
      case BookSetting.PageStyle:
        setPageStyle(value);
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
      <Text pb="xs">Page Style</Text>
      <SegmentedControl
        mb="xs"
        data={[
          {
            value: BookPageStyle.Single,
            label: (
              <Center>
                <IconFile size={16} />
                <Box ml={10}>Single</Box>
              </Center>
            ),
          },

          {
            value: BookPageStyle.LongStrip,
            label: (
              <Center>
                <IconSpacingVertical size={16} />
                <Box ml={10}>Long Strip</Box>
              </Center>
            ),
          },
        ]}
        value={pageStyle}
        onChange={(value) => updateBookSetting(BookSetting.PageStyle, value)}
      />
    </>
  );
};

export default BookSettings;
