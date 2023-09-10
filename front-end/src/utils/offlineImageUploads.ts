import { app as electronApp, ipcRenderer } from 'electron';
// import fs from 'fs';

export const sendFile = (fileName: string, file: string | Buffer) => {
  window.api.send('toMain', { method: 'write', fileName, file });
};

export const receiveFile = () => {
  return new Promise((resolve, reject) => {
    window.api.receive('fromMain', (file: any) => {
      const formattedFilePath = file
        .replace(/\//g, '\\')
        .replace(/\/\//g, '\\')
        .replace(/\\/, '\\\\');
      return resolve(formattedFilePath);
    });
    // return reject('Cannot save file');
  });
};

export const readFile = (fileName: string) => {
  window.api.send('toMain', { method: 'read', fileName });
  return new Promise((resolve, reject) => {
    window.api.receive('fromMain', (file: any) => {
      return resolve(file);
    });
    // return reject('Cannot read file');
  });
};

export const checkDir = () => {
  window.api.send('toMain', { method: 'dirIsNotEmpty' });
  return new Promise((resolve, reject) => {
    window.api.receive('fromMain', (res: any) => {
      return resolve(res);
    });
    // return reject('Cannot save file');
  });
};

export const deleteFile = (fileName: string) => {
  window.api.send('toMain', { method: 'delete', fileName });
  return new Promise((resolve, reject) => {
    window.api.receive('fromMain', (res: any) => {
      resolve(res);
    });
    // reject('Cannot save file');
  });
};
