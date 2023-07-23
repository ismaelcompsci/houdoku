import React, { FC, useState } from 'react';
import { Text, Box, Center, SegmentedControl, Slider, Group } from '@mantine/core';
import { IconFile, IconMoon, IconSpacingVertical, IconSun } from '@tabler/icons';
import { useRecoilState } from 'recoil';
import {
  bookFontScaleState,
  bookLineSpacingState,
  bookPageStyleState,
  bookThemeState,
} from '../../state/settingStates';
import { BookPageStyle, BookSetting } from '../../models/types';

const BookSettings = () => {
  const [bookTheme, setBookTheme] = useRecoilState(bookThemeState);
  const [pageStyle, setPageStyle] = useRecoilState(bookPageStyleState);
  const [fontScale, setBookFontScale] = useRecoilState(bookFontScaleState);
  const [lineSpacing, setBookLineScale] = useRecoilState(bookLineSpacingState);

  const [fontScaleValue, setFontScaleValue] = useState(fontScale);
  const [lineSpacingValue, setLineScaleValue] = useState(lineSpacing);

  const updateBookSetting = (bookSetting: BookSetting, value: any) => {
    switch (bookSetting) {
      case BookSetting.Theme:
        setBookTheme(value);
        break;
      case BookSetting.BookPageStyle:
        setPageStyle(value);
        break;
      case BookSetting.FontScale:
        setBookFontScale(value);
        break;
      case BookSetting.LineSpacing:
        setBookLineScale(value);
        break;
      default:
        break;
    }
  };

  const finalValue = () => {
    return fontScale;
  };

  const finalLineSpacingValue = () => {
    return lineSpacing;
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
        onChange={(value) => updateBookSetting(BookSetting.BookPageStyle, value)}
      />
      <Box
        sx={() => ({
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          paddingBottom: '10px',
        })}
      >
        <Text size="sm" lineClamp={1} w="30%">
          Font Size
        </Text>
        <Slider
          min={5}
          w="100%"
          max={300}
          value={fontScaleValue}
          onChange={setFontScaleValue}
          onChangeEnd={(value) => updateBookSetting(BookSetting.FontScale, value)}
        />
        <Text size="sm" w="10%" ml={6}>
          {finalValue()}
        </Text>
      </Box>
      <Box
        sx={() => ({
          display: 'flex',
          width: '100%',
          alignItems: 'center',
        })}
      >
        <Text size="sm" lineClamp={1} w="30%">
          Line Spacing
        </Text>
        <Slider
          min={100}
          w="100%"
          max={300}
          value={lineSpacingValue}
          onChange={setLineScaleValue}
          onChangeEnd={(value) => updateBookSetting(BookSetting.LineSpacing, value)}
        />
        <Text size="sm" w="10%" ml={6}>
          {finalLineSpacingValue()}
        </Text>
      </Box>
    </>
  );
};

export default BookSettings;
