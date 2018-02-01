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
ipc.on('save-file', function (event, args) {
  // console.log('About to save file in main service');
  // console.log('Value of event is :', args);
  const file_path = args.file_name;
  const file_contents = args.file_contents;
  const file_type = args.file_type;
  fs.writeFileSync(file_path, file_contents, function (error) {
    if (error) {
      // throw error
      console.log('There was an error in saving file', error);
      event.sender.send('file-save-error-' + file_type, error);
    }else{
      console.log('Saved file', file_path);
      event.sender.send('file-saved-'+file_type, args.file_name);
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
  const file_type = args.file_type;
  let data = '';
  try {
    data = fs.readFileSync(file_path, 'utf8');
    // console.log('loaded file', file_path);
    event.sender.send('file-read-'+file_type, data);
  } catch (error) {
    console.log('Error loading file ', file_path);
    event.sender.send('file-read-error-' + file_type, error);
  }
})

ipc.on('find-file', function(event, args) {
  const file_name = args.file_name;
  const file_type = args.file_type
  console.log('About to check ' + file_type + ' in main service from ', file_name);
  let data = '';
  try {
    if (fs.existsSync(file_name)) {
      console.log('found ' + file_type, file_name);
      event.sender.send('found-file-'+file_type, data);
    } else {
      console.log('Not found ' + file_type);
      event.sender.send('not-found-file-'+file_type, 'folder does not exist');
    }
    // console.log('loaded file' + file_path, data);
    
  } catch (error) {
    console.log('Error finding  ' + file_type + ' ' + file_name, error);
    event.sender.send('not-found-file-' + file_type, error);
  }
});


ipc.on('create-data-folder', function(event, args) {
  const folder_name = args.file_name;
  console.log('About to create data folder in main service from ', folder_name);
  let data = '';
  try {
    fs.mkdirSync(folder_name);
    console.log('Data folder not found so not creating a new one');
    event.sender.send('created-data-folder', folder_name);
    // console.log('loaded file' + file_path, data);
    
  } catch (error) {
    console.log('Error creating data folder ' + folder_name, error);
    event.sender.send('not-created-data-folder', error);
  }
});

// Check default folders and files
ipc.on('create-defaults', function(event, args) {
  console.log('About to create default folders and files');

  const data_folder_name = args.data_folder_name;
  const article_file_name = args.article_file_name;
  const article_file_data = args.article_file_data;
  const config_file_name = args.config_file_name;
  const config_file_data = args.config_file_data;

  console.log('First check if data folder exists or not');
  if (!file_exists(data_folder_name)) {
    // create data folder
    make_dir(data_folder_name);
  }

  // if (!file_exists(article_file_name)) {
  //   // create article file
  //   save_file(article_file_name, article_file_data);
  // }

  if (!file_exists(config_file_name)) {
    // create config file
    save_file(config_file_name, config_file_data);
  }

  event.sender.send('created-defaults','');
});

function file_exists(file_name) {
  try {
    if (fs.existsSync(file_name)) {
      console.log('found ', file_name);
      return true;
    } else {
      console.log('Not found ' + file_name);
      return false;
    }
    // console.log('loaded file' + file_path, data);
  } catch (error) {
    console.log('Error finding  ' + file_name, error);
    return false;
  }
}

function make_dir(dir_name){
  try {
    fs.mkdirSync(dir_name);
    console.log('Data folder not found so not creating a new one');
    return true;
  } catch (error) {
    console.log('Error creating data folder ' + dir_name, error);
    return false;
  }

}

function save_file(file_name, file_contents){
  fs.writeFileSync(file_name, file_contents, function(error) {
    if (error) {
      // throw error
      console.log('There was an error in saving file', error);
      return false;
    } else {
      console.log('Saved file', file_name);
      return true;
    }
  });
  
}
