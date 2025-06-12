// const fs = require('fs');
// const path = require('path');

// const outputPath = './src/service-worker-list.json';

// // According to the need, add or remove directories from this array
// const targetFolders = [
//   { name: 'core', path: './public/lib/core/', getNestedFiles: true },
//   { name: 'ui', path: './public/lib/ui/', getNestedFiles: true },
// ];

// function getAllFiles(dirObject, fileList = []) {
//   const files = fs.readdirSync(dirObject.path);

//   files.forEach(file => {
//     const filePath = path.join(dirObject.path, file);

//     if (!fs.statSync(filePath).isDirectory()) {
//       fileList.push(filePath);
//     } else {
//       if (dirObject.getNestedFiles) {
//         getAllFiles({ name: file, path: filePath, getNestedFiles: true }, fileList);
//       }
//     }
//   });

//   return fileList;
// }

// const filesByDirectories = {};

// targetFolders.forEach(folderObject => {
//   const files = getAllFiles(folderObject);
//   filesByDirectories[folderObject.name] = files;
// });

// const jsonResult = JSON.stringify(filesByDirectories);

// fs.writeFileSync(outputPath, jsonResult);

// console.log('Service worker list prepared');

// In your service worker file

const CACHE_NAME = "webviewer-cache-v1";
// This file is cached only because we are using this library in this guide
const localforage = "path/to/localforage.js";

var assets = [
  "/",
  "/style.css",
  "/index.js",
  "/index.html",
  `/scripts/pwacompat.min.js`,
  `/manifest.json`,
  "/images/ic_launcher-48.png",
  "/images/ic_launcher-72.png",
  "/images/ic_launcher-96.png",
  "/images/ic_launcher-144.png",
  "/images/ic_launcher-192.png",
  "/images/ic_launcher-512.png",
  "https://fonts.googleapis.com/css?family=Roboto",
  "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600",
  "https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
  "/public/lib/webviewer.min.js",
];

async function getWorkersList() {
  try {
    const response = await fetch("/service-worker-list.json");
    const jsonData = await response.json();

    return jsonData;
  } catch (err) {
    console.error("Error fetching workers list");
  }
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async function (cache) {
      const { core, ui } = await getWorkersList();
      return cache.addAll([localforage].concat(core, ui, assets));
    })
  );
});
const fs = require('fs');
const path = require('path');

const outputPath = './src/service-worker-list.json';

const targetFolders = [
  { name: 'core', path: './public/lib/core/', getNestedFiles: true },
  { name: 'ui', path: './public/lib/ui/', getNestedFiles: true },
];

function getAllFiles(dirObject, fileList = []) {
  try {
    const files = fs.readdirSync(dirObject.path);

    files.forEach(file => {
      const filePath = path.join(dirObject.path, file);

      if (!fs.statSync(filePath).isDirectory()) {
        fileList.push(filePath);
      } else {
        if (dirObject.getNestedFiles) {
          getAllFiles({ name: file, path: filePath, getNestedFiles: true }, fileList);
        }
      }
    });

    return fileList;
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    return [];
  }
}

const filesByDirectories = {};

targetFolders.forEach(folderObject => {
  try {
    const files = getAllFiles(folderObject);
    filesByDirectories[folderObject.name] = files;
  } catch (err) {
    console.error(`Error processing folder: ${err}`);
  }
});

try {
  const jsonResult = JSON.stringify(filesByDirectories);
  fs.writeFileSync(outputPath, jsonResult);
  console.log('Service worker list prepared');
} catch (err) {
  console.error(`Error writing to file: ${err}`);
}

const CACHE_NAME = "webviewer-cache-v1";
const localforage = "path/to/localforage.js";

const assets = [
  "/",
  "/style.css",
  "/index.js",
  "/index.html",
  `/scripts/pwacompat.min.js`,
  `/manifest.json`,
  "/images/ic_launcher-48.png",
  "/images/ic_launcher-72.png",
  "/images/ic_launcher-96.png",
  "/images/ic_launcher-144.png",
  "/images/ic_launcher-192.png",
  "/images/ic_launcher-512.png",
  "https://fonts.googleapis.com/css?family=Roboto",
  "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600",
  "https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
  "/public/lib/webviewer.min.js",
];

async function getWorkersList() {
  try {
    const response = await fetch("/service-worker-list.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();

    return jsonData;
  } catch (err) {
    console.error("Error fetching workers list", err);
  }
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async function (cache) {
      try {
        const { core, ui } = await getWorkersList();
        return cache.addAll([localforage].concat(core, ui, assets));
      } catch (err) {
        console.error("Error installing service worker", err);
      }
    })
  );
});