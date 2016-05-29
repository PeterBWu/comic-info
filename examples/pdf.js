'use strict';

// Royalty free comics from http://digitalcomicmuseum.com/

const path = require('path'),
  parse = require('../index'),
	filePath = path.join(__dirname, 'ChillingTales013.pdf');

new parse({ path: filePath })
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