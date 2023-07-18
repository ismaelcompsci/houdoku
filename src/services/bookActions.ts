import { ipcRenderer } from 'electron';
import log from 'electron-log';
import Epub from 'epubjs';
import { PackagingMetadataObject } from 'epubjs/types/packaging';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import { Book } from 'houdoku-extension-lib';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import ipcChannels from '../constants/ipcChannels.json';
import { sanitizeFilename } from '../util/filesystem';
import books from './books';

export function blobToBuffer(blob: Blob): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
      reject(new Error('first argument must be a Blob'));
    }

    const reader = new FileReader();

    function onLoadEnd(e: ProgressEvent<FileReader>) {
      reader.removeEventListener('loadend', onLoadEnd, false);
      if (e.target?.error) {
        reject(e.target?.error);
      } else {
        resolve(Buffer.from(reader.result as ArrayBuffer));
      }
    }

    reader.addEventListener('loadend', onLoadEnd, false);
    reader.readAsArrayBuffer(blob);
  });
}

export async function getBookCoverPath(title: string, ext: string) {
  const bookCoverDir = await ipcRenderer.invoke(ipcChannels.GET_PATH.THUMBNAILS_DIR);
  if (!fs.existsSync(bookCoverDir)) {
    fs.mkdirSync(bookCoverDir);
  }

  return path.join(bookCoverDir, `${title}.${ext}`);
}

export async function saveBookCover(blob: Blob, meta: PackagingMetadataObject) {
  const buffer = await blobToBuffer(blob);
  const fileType = await fileTypeFromBuffer(buffer);

  const coverPath = await getBookCoverPath(`${meta.title}-${meta.creator}`, fileType?.ext || 'png');

  fs.writeFileSync(coverPath, buffer);

  return coverPath;
}

export async function saveBook(meta: PackagingMetadataObject, bookPath: string, bookDir: string) {
  const filetype = bookPath.split('.');
  const filename = sanitizeFilename(
    `${meta.title}-${meta.creator}.${filetype[filetype.length - 1]}`
  );
  const finalBookPath = `${bookDir}\\${filename}`;
  fs.copyFile(bookPath, finalBookPath, (err) => {
    if (err) throw err;
    log.info(`Copied ${bookPath} to ${finalBookPath}`);
  });
  return { filename, finalBookPath };
}

export async function handleBookAdded(bookPath: string): Promise<Book | undefined> {
  if (!bookPath) {
    return undefined;
  }

  const bookDir = await ipcRenderer.invoke(ipcChannels.GET_PATH.BOOKS_DIR);

  if (!fs.existsSync(bookDir)) {
    fs.mkdirSync(bookDir);
  }

  try {
    const book = Epub(bookPath);

    await book.ready;

    const meta = book.packaging.metadata;
    const cover = await book.loaded.cover;

    const blb = await book.archive.getBlob(cover);
    const coverPath = await saveBookCover(blb, meta);

    const { finalBookPath } = await saveBook(meta, bookPath, bookDir);

    const toc = book.navigation.toc.flat();

    const bookInfo = {
      id: uuidv4(),
      title: meta.title,
      author: meta.creator,
      publisher: meta.publisher,
      desciption: meta.description,
      identifer: meta.identifier,
      path: finalBookPath,
      toc,
      coverPath,
      highlights: [],
    };

    books.upsertBook(bookInfo);
    return bookInfo;
  } catch (err) {
    log.error(err, 'COULD NOT PARSE EPUB BOOK');
    return undefined;
  }
}
