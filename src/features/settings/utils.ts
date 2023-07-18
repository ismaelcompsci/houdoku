import log from 'electron-log';
import { SettingType } from 'houdoku-extension-lib';
import {
  GeneralSetting,
  IntegrationSetting,
  ReaderSetting,
  TrackerSetting,
  SettingTypes,
  ReadingDirection,
  PageStyle,
  OffsetPages,
  BookSetting,
} from '../../models/types';
import persistantStore from '../../util/persistantStore';
import storeKeys from '../../constants/storeKeys.json';

type StoreValues = {
  [key in GeneralSetting | ReaderSetting | BookSetting | TrackerSetting | IntegrationSetting]?:
    | string
    | null;
};

type Setting = GeneralSetting | ReaderSetting | BookSetting | TrackerSetting | IntegrationSetting;

type SettingEnum =
  | typeof GeneralSetting
  | typeof ReaderSetting
  | typeof TrackerSetting
  | typeof IntegrationSetting
  | typeof BookSetting;

const getStoreValues = (storePrefix: string, settingEnum: SettingEnum): StoreValues => {
  const values: StoreValues = {};
  Object.values(settingEnum).forEach((setting: Setting) => {
    values[setting] = persistantStore.read(`${storePrefix}${setting}`);
  });
  return values;
};

const parseStoreValues = (storeValues: StoreValues): { [key in Setting]?: any } => {
  const settings: { [key in Setting]?: any } = {};
  Object.entries(storeValues)
    .filter(([, value]) => value !== null)
    .forEach(([key, value]) => {
      const settingKey = key as Setting;
      switch (SettingTypes[settingKey]) {
        case SettingType.BOOLEAN:
          settings[settingKey] = value === 'true';
          break;
        case SettingType.STRING:
          settings[settingKey] = value === 'null' ? null : value;
          break;
        case SettingType.STRING_ARRAY:
          settings[settingKey] = value ? value.split(',') : [];
          break;
        case SettingType.NUMBER:
          settings[settingKey] = parseInt(value as string, 10);
          break;
        default:
          break;
      }
    });
  return settings;
};

export const getAllStoredSettings = () => {
  const settings = {
    ...parseStoreValues(getStoreValues(storeKeys.SETTINGS.GENERAL_PREFIX, GeneralSetting)),
    ...parseStoreValues(getStoreValues(storeKeys.SETTINGS.READER_PREFIX, ReaderSetting)),
    ...parseStoreValues(getStoreValues(storeKeys.SETTINGS.BOOK_PREFIX, BookSetting)),
    ...parseStoreValues(getStoreValues(storeKeys.SETTINGS.TRACKER_PREFIX, TrackerSetting)),
    ...parseStoreValues(getStoreValues(storeKeys.SETTINGS.INTEGRATION_PREFIX, IntegrationSetting)),
  };

  log.info(`Using settings: ${JSON.stringify(settings)}`);
  return settings;
};

export function saveGeneralSetting(key: GeneralSetting, value: any) {
  persistantStore.write(`${storeKeys.SETTINGS.GENERAL_PREFIX}${key}`, value);
  log.info(`Set GeneralSetting ${key} to ${value}`);
}

export function saveReaderSetting(key: ReaderSetting, value: any) {
  persistantStore.write(`${storeKeys.SETTINGS.READER_PREFIX}${key}`, value);
  log.info(`Set ReaderSetting ${key} to ${value}`);
}

export function saveBookSetting(key: BookSetting, value: any) {
  persistantStore.write(`${storeKeys.SETTINGS.BOOK_PREFIX}${key}`, value);
  log.info(`Set BookSetting ${key} to ${value}`);
}

export function saveTrackerSetting(key: TrackerSetting, value: any) {
  persistantStore.write(`${storeKeys.SETTINGS.TRACKER_PREFIX}${key}`, value);
  log.info(`Set TrackerSetting ${key} to ${value}`);
}

export function saveIntegrationSetting(key: IntegrationSetting, value: any) {
  persistantStore.write(`${storeKeys.SETTINGS.INTEGRATION_PREFIX}${key}`, value);
  log.info(`Set IntegrationSetting ${key} to ${value}`);
}

export function nextReadingDirection(readingDirection: ReadingDirection): ReadingDirection {
  return readingDirection === ReadingDirection.LeftToRight
    ? ReadingDirection.RightToLeft
    : ReadingDirection.LeftToRight;
}

export function nextPageStyle(pageStyle: PageStyle): PageStyle {
  return {
    [PageStyle.Single]: PageStyle.Double,
    [PageStyle.Double]: PageStyle.LongStrip,
    [PageStyle.LongStrip]: PageStyle.Single,
  }[pageStyle];
}

export function nextOffsetPages(offsetPages: OffsetPages): OffsetPages {
  return {
    [OffsetPages.All]: OffsetPages.None,
    [OffsetPages.None]: OffsetPages.First,
    [OffsetPages.First]: OffsetPages.All,
  }[offsetPages];
}
