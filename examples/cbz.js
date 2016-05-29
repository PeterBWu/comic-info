'use strict';

// Royalty free comics from http://digitalcomicmuseum.com/

const path = require('path'),
	parse = require('../index'),
	filePath = path.join(__dirname, 'BusterBear10.cbz');

new parse({ path: filePath })
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