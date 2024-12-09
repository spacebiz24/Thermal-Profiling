import * as React from 'react'
import { Dirs, FileSystem } from 'react-native-file-access';
import { StyleSheet, View, Text, Button } from 'react-native';
import { DocumentDirectoryPath, CachesDirectoryPath, writeFile, readDir, readFile, unlink, ExternalDirectoryPath, ExternalStorageDirectoryPath } from 'react-native-fs'; //send files for testing
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';
import { useEffect, useState } from 'react';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

function Test () {
  const [result, setResult] = useState(null);
  const [fileInDir, setFileInDir] = useState([]);
  check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
  .then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        console.log('The permission has not been requested / is denied but requestable');
        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
          if (result === RESULTS.GRANTED) console.log('request granted');
          else console.log('not granted');
        });
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  })
  .catch((error) => {
    console.log(error);
  });
  const getFilesFromDir = (result) => {
      console.log(ExternalDirectoryPath, ExternalStorageDirectoryPath);
      if (!result) return;
      console.log("FS directory path : ",result);
      readDir(result).then((files) => {
        // console.log("files on FS: ",files);
        for (const file of files) {
          console.log(file);
          getFile(file.path)
        }
        setFileInDir(files);
      }).catch((error) => {
        console.log(error);
      });
  };
  const getDirData = async (dirPath) => {
    const isDirectory = await FileSystem.isDir(dirPath);
    if (!isDirectory) {
      console.log("not a directory");
      return;
    }
    console.log("is a directory");
    const result = await FileSystem.statDir(dirPath);
    for (let file of result) {
      getFileData(file);
    }
    console.log(result);
  }
  const getFileData = async(file) => {
    try {
      const result = await FileSystem.readFile(file.uri);
      console.log(file.filename);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
  const getFile = async (filePath) => {
    try{
        const response = await readFile(filePath);
        console.log("File read : ",response)
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2))
  }, [result])

  const handleError = (unknown) => {
    if (isCancel(err)) {
      console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title="open picker for single file selection"
        onPress={async () => {
          try {
            const pickerResult = await DocumentPicker.pickSingle({
              presentationStyle: 'fullScreen',
              allowMultiSelection : true,
            })
            setResult([pickerResult])
          } catch (e) {
            handleError(e)
          }
        }}
      />
      <Button
        title="open picker for multi file selection"
        onPress={() => {
          DocumentPicker.pick({ allowMultiSelection: true,
            copyTo: 'cachesDirectory', }).then(setResult).catch(handleError)
        }}
      />
      <Button
        title="get Files from cacheDirectory"
        onPress={() => {
          DocumentPicker.pick({
            allowMultiSelection: true,
            type: [types.doc, types.docx],
          })
            .then(setResult)
            .catch(handleError)
        }}
      />
      <Button
        title="open picker for single selection of pdf file"
        onPress={() => {
          DocumentPicker.pick({
            type: types.pdf,
          })
            .then(setResult)
            .catch(handleError)
        }}
      />
      <Button
        title="releaseSecureAccess"
        onPress={() => {
          DocumentPicker.releaseSecureAccess([])
            .then(() => {
              console.warn('releaseSecureAccess: success')
            })
            .catch(handleError)
        }}
      />
      <Button
        title="open directory picker"
        onPress={() => {
          DocumentPicker.pickDirectory()
            .then((result) => {
              setResult(result);
              getDirData(result.uri);
            })
            .catch(handleError);
        }}
      />
      <Button
        title="get Files from file system"
        onPress={() => {
          console.log(Dirs.SDCardDir[0], "content://com.android.externalstorage.documents/tree/9C33-6BBD%3Adatata");
          getFile(result[0].uri);
        }}
      />

      <Text selectable>Result: {JSON.stringify(result, null, 2)}</Text>
      <Text selectable>copiedTO: {result && result[0]?(result[0].fileCopyUri?result[0].fileCopyUri:result.copyError?result.copyError:'no copy'):'sucks'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

export { Test };