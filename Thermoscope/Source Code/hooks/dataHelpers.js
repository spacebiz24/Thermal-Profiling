//either use storage or keep a separate file that stores all file names.

//iterate through fileNames and check if any file with the file name already exists. If it already exists, save it after modifiying name and inform user in a modal.
//also display any other error in the modal.
import RNFS from 'react-native-fs';
import { storage } from './storage';
import { STEP } from '../constants';

const storeInMemory = (result) => {
  const currentFiles = storage.contains('files') ? JSON.parse(storage.getString('files')) : [];
  let fileNameExists = currentFiles.find((elem) => elem.name === result.name);
  const originalName = result.name.split('.')[0];
  let i = 1;
  while(fileNameExists) {
    result.name = originalName + i + '.txt';
    fileNameExists = currentFiles.find((elem) => elem.name === result.name);
    i++;
  }
  currentFiles.push({
    name : result.name,
    date : new Date(),
    location : result.fileCopyUri
  });
  console.log(currentFiles);
  storage.set('files', JSON.stringify(currentFiles));
  console.log(storage.getString('files'));
  return result.name;
};

const getFileData = async (filePath) => {
  try{
      const response = await RNFS.readFile(filePath);
      return response;
  } catch (error) {
      console.log(error);
  }
};

const getSensorData = (data) => {
  const sensorsData = [];
  for (let i = 0; i < 9; i++) sensorsData.push([]);
  for (const arr of data) {
    const dataPoints = arr.split(',');
    if (dataPoints.length < 10) continue;
    for (let i = 1; i <=9; i++) {
      sensorsData[i - 1].push({
        x : parseFloat(dataPoints[0]),
        y : parseFloat(dataPoints[i])
      });
    }
  }
  return sensorsData;
};

const averageData = (data, start) => {
  const res = [];
  for (let i = STEP * start; i < Math.min(STEP + STEP * start, data[0].length); i++) {
    let avg = 0;
    for (let j = 0; j < 8; j++) {
      avg += data[j][i].y;
    }
    res.push({
      y : avg/8,
      x : data[0][i].x
    });
  }
  return res;
};

const renameFile = (fileName, newFileName) => {
  let files = JSON.parse(storage.getString('files'));
  console.log(files);
  const file = files.find((item) => item.name === fileName);
  const fileWithNewName = files.find((item) => item.name === newFileName);
  console.log(fileWithNewName);
  if (fileWithNewName) return false;
  files = files.filter((item) => item.name !== fileName);
  file.name = newFileName;
  files.push(file);
  if (storage.contains(fileName)) {
    const comments = storage.getString(fileName);
    storage.delete(fileName);
    storage.set(newFileName, comments);
  }
  storage.set('files', JSON.stringify(files));
  console.log(files);
  return true;
};

const deleteFile = (fileName) => {
  let files = JSON.parse(storage.getString('files'));
  const file = files.find((item) => item.name === fileName);
  files = files.filter((item) => item.name !== fileName);
  storage.set('files', JSON.stringify(files));
  console.log(file.location);
  RNFS.unlink(file.location).then(() => console.log('file deleted')).catch((err) => console.log(err));
  if (storage.contains(fileName)) storage.delete(fileName);
};

export { storeInMemory , getFileData, getSensorData, averageData, renameFile, deleteFile };