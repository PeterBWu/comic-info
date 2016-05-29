comic-info
==========

[![Build Status](https://travis-ci.org/leemm/comic-info.svg?branch=master)](https://travis-ci.org/leemm/comic-info)

Gets information for comic-book files e.g. pages, size, meta data.  Currently supports PDF, CBZ and CBR.

# Prerequisites

Several tools are required to open all functionality.  You can everything or just those you need.

* **p7zip** - to install 7z command, required for archive based file support e.g. CBZ, CBR.
* **poppler** - to install pdfinfo command, required PDF support.

```sh
# OSX
$ brew update && brew doctor && brew install p7zip && brew install poppler
# Ubuntu
$ sudo apt-get install poppler-utils && sudo apt-get install p7zip-full
```


# Install
```
npm install comic-info --save
```

# Usage

To see info on a CBZ file.

```javascript
'use strict';

const path = require('path'),
    comic = require('comic-info'),
    filePath = path.join(__dirname, 'BusterBear10.cbz');

new comic({ path: filePath })
    .then(res => { if (res){ console.log('Success!', res); } })
    .catch(err => { if (err){ console.log('Failed!', err); } });

/*
// res = ...
{ dir: '/Users/lee/Projects/misc/comic-info/examples',
  filename: 'BusterBear10.cbz',
  ext: '.cbz',
  name: 'BusterBear10',
  size: 2349084,
  created: Sun May 29 2016 20:13:11 GMT+0100 (BST),
  modified: Sun May 29 2016 20:13:11 GMT+0100 (BST),
  pages: 3,
  encrypted: false,
  files:
   [ { date: '2016-05-29',
       time: '20:13:10',
       attr: 'D....',
       size: 0,
       compressed: 0,
       name: 'BusterBear10' },
     { date: '2016-05-16',
       time: '22:27:46',
       attr: '.....',
       size: 812820,
       compressed: 796005,
       name: 'BusterBear10/CCI05162016_0002.jpg' },
     { date: '2016-05-16',
       time: '22:28:00',
       attr: '.....',
       size: 786033,
       compressed: 769174,
       name: 'BusterBear10/CCI05162016_0003.jpg' },
     { date: '2016-05-16',
       time: '22:28:34',
       attr: '.....',
       size: 799701,
       compressed: 782887,
       name: 'BusterBear10/CCI05162016_0004.jpg' } ],
  meta:
   { Path: '/Users/lee/Projects/misc/comic-info/examples/BusterBear10.cbz',
     Type: 'zip',
     'Physical Size': '2349084' } } */
```

To see info on a PDF file.

```javascript
'use strict';

const path = require('path'),
    comic = require('comic-info'),
    filePath = path.join(__dirname, 'ChillingTales013.pdf');

new comic({ path: filePath })
    .then(res => { if (res){ console.log('Success!', res); } })
    .catch(err => { if (err){ console.log('Failed!', err); } });

/*
// res = ...
{ dir: '/Users/lee/Projects/misc/comic-info/examples',
  filename: 'ChillingTales013.pdf',
  ext: '.pdf',
  name: 'ChillingTales013',
  size: 4167051,
  created: Sun May 29 2016 20:14:51 GMT+0100 (BST),
  modified: Sun May 29 2016 20:14:37 GMT+0100 (BST),
  pages: 5,
  encrypted: false,
  files: [],
  meta:
   { root: '/',
     dev: 16777217,
     mode: 33188,
     nlink: 1,
     uid: 501,
     gid: 20,
     rdev: 0,
     blksize: 4096,
     ino: 18290377,
     blocks: 8144,
     atime: Sun May 29 2016 20:16:01 GMT+0100 (BST),
     birthtime: Sun May 29 2016 20:14:36 GMT+0100 (BST),
     Title: 'ChillingTales013\u0000',
     Producer: 'ImageMagick 6.9.3-6 Q16 x86_64 2016-03-13 http',
     CreationDate: 1590706800000,
     ModDate: 1590706800000,
     Tagged: false,
     UserProperties: false,
     Suspects: false,
     Form: 'none',
     JavaScript: false,
     PageSize: '264 x 371.04 pts',
     PageRot: 0,
     FileSize: '4167051 bytes',
     Optimized: false,
     PDFVersion: 1.3 } } */
```