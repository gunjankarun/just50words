const fs = require('fs')
const os = require('os')
const path = require('path')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const shell = electron.shell

/**
 * The event handler to save data to text file
 * The file name will be in args.file_name
 * file contents will be in args.file_contents
 * @param 'send-to-save' is the channel to use to send save commands
 * 
 */
ipc.on('send-to-save', function (event, args) {
  // console.log('About to save file in main service');
  // console.log('Value of event is :', args);
  const file_path = args.file_name;
  const file_contents = args.file_contents;
  fs.writeFileSync(file_path, file_contents, function (error) {
    if (error) {
      // throw error
      console.log('There was an error in saving file', error);
      event.sender.send('file-save-error', error);
    }else{
      console.log('Saved file', file_path);
      event.sender.send('file-saved', args.file_name);
    }
  })
})

/**
 * The event handler to load data from text file
 * The file name will be in args.file_name
 * @param 'read-file' is the channel to use to send save commands
 * 
 */
ipc.on('read-file', function (event, args) {
  // console.log('About to read file in main service');
  // console.log('Value of args is :', args);
  const file_path = args.file_name;
  let data = '';
  try {
    data = fs.readFileSync(file_path, 'utf8');
    console.log('loaded file', file_path);
    event.sender.send('file-read', data);
  } catch (error) {
    console.log('Error loading file ', file_path);
    event.sender.send('file-read-error', error);
  }
})


