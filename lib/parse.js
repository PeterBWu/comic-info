'use strict';

const Helpers = require('./helpers'),
	cli = require('simple-cli-parser'),
	path = require('path'),
	fs = require('fs-extra'),
	titlecase = require('titlecase'),
	_ = require('lodash'),
	keys = [
		{ prop: 'dir' },
		{ prop: 'base', renameTo: 'filename' },
		{ prop: 'ext' },
		{ prop: 'name' },
		{ prop: 'size' },
		{ prop: 'ctime', renameTo: 'created' },
		{ prop: 'mtime', renameTo: 'modified' },
		{ prop: 'Pages', renameTo: 'pages' },
		{ prop: 'Encrypted', renameTo: 'encrypted', default: false },
		{ prop: 'files', default: [] },
		{ prop: 'meta' }
	];

class Parse {

	/**
     * Get information about comic books
     * @private
     * @param  {Object}  cmd { path: '/cake.pdf' }
     * @param  {Function}  onData // if need to track status of stderr (curl downloads etc.)
     * @return {Promise}
     */
    constructor(opt, onData) {

    	let filePath = Helpers.exists((opt && opt.path ? opt.path : ''));
    	if (!filePath.ext){ filePath.ext = ''; }

		return new Promise((resolve, reject) => {

			switch (filePath.ext){
	    		case '.pdf':
	    			return resolve(this._pdfinfo(filePath));
	    			break;
	    		case '.cbr':
	    		case '.cbz':
                case '.cb7':
                case '.cbt':
	    			return resolve(this._archiveinfo(filePath));
	    			break;
	    	}

		});

    }

    /**
     * Get's PDF Info via CLI
     * @private
     * @param  {Object} fileInfo
     * @param  {Function} currentData optional - returns polled data on longer processes
     * @return {Promise}
     */
    _pdfinfo(fileInfo, currentData){
    	const fullPath = path.join(fileInfo.dir, fileInfo.base);

    	return new cli([ 'pdfinfo', fullPath ], currentData).then(raw => {

    		// process raw data
    		let mergedResults = Object.assign(fileInfo, fs.statSync(fullPath), this._parsePDFStdout(raw));

    		// Meta data
    		mergedResults.meta = {};

    		let without = _.filter(Object.keys(mergedResults), key => { return _.map(keys, 'prop').indexOf(key) === -1; });
    		without.map(key => {
    			mergedResults.meta[key] = mergedResults[key];
    		});

    		return this._getStandardProperties(mergedResults);

    	});

    }

    /**
     * Get's Archive Info via CLI
     * @private
     * @param  {Object} fileInfo
     * @param  {Function} currentData optional - returns polled data on longer processes
     * @return {Promise}
     */
    _archiveinfo(fileInfo, currentData){
    	const fullPath = path.join(fileInfo.dir, fileInfo.base);

    	return new cli([ '7z', 'l', fullPath ], currentData).then(raw => {

    		// process raw data
    		let merge = Object.assign(fileInfo, fs.statSync(fullPath), this._parseArchiveStdout(raw));

            merge.files = _.filter(merge.files, file => { return file.name.indexOf('.DS_Store') === -1 });

    		// pages
    		merge.Pages = _.filter(merge.files, file => { return file.attr.indexOf('D') === -1; }).length;

    		return this._getStandardProperties(merge);

    	});

    }

    /**
     * Takes "raw" object from either PDF or Archive and removes unnecessary properties
     * @private
     * @param  {Object} raw
     * @return {Object}
     */
    _getStandardProperties(raw){

		let parsedObject = {};

		// Standard File Info
		keys.map(key => {
			let val = !Helpers.hasValue(raw[key.prop]) ? null : raw[key.prop];
			val = !val && key.default !== null ? key.default : val;

			parsedObject[(key.renameTo ? key.renameTo : key.prop)] = val;
		});

		return parsedObject;
    }

    /**
     * Takes space delimited PDF stdoutput and converts to key:value array
     * @private
     * @param  {Object} data
     * @return {Object}
     */
    _parsePDFStdout(data){

    	let masterObj = {};
    	let lines = data.toString().split('\n').map(line => { return line.split(':'); }).map((line, idx) => {
    		let obj = {},
    			key = titlecase(line[0].replace(':', '')).replace(/ /g, ''),
    			val = line[1] && line[1].length > 0 ? line[1].trim() : '';

    		// Check for types
    		val = key.toLowerCase().indexOf('date') > -1 && !isNaN(Date.parse(val)) ? new Date(val).getTime() : val;

    		val = !isNaN(parseFloat(val)) && isFinite(val) ? parseFloat(val, 10) : val;

    		val = val === 'yes' ? true : val;
    		val = val === 'no' ? false : val;

    		obj[key] = val;

    		return obj;
    	}).map((line) => {
    		let key = Object.keys(line)[0];
    		if (key.toString().length > 0){ masterObj[key] = line[key]; }

    		return line;
    	});

		return masterObj;
    }

     /**
     * Takes 7z ls output and parses to object
     * @private
     * @param  {Object} data
     * @return {Object}
     */
    _parseArchiveStdout(data){

    	let lines = data.toString().split('\n');


    	// Get meta data (header of 7z output)
    	let meta = _.filter(lines, line => {
    		return line.indexOf(' = ') > -1
    	}).map(line => {
    		let retObj = {};
    		retObj[line.split(' = ')[0]] = line.split(' = ')[1];
    		return retObj;
    	});

    	let metaFixed = {};
    	meta.map(obj => {
    		metaFixed[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
    	});
    	meta = Object.assign(metaFixed, {});

    	// File listing
    	let fileListing = [],
    		headers = [],
    		foundHeaders = false,
    		foundFooter = false;

    	for (let idx = 0; idx < lines.length; idx ++){
    		let line = lines[idx];

    		if (line.indexOf('----------------') > -1 && !foundHeaders){ // Titles or footer
    			headers = _.filter(lines[idx -1].split(' '), line => { return line.length > 0; });
    			foundHeaders = true;
    		}else if (line.indexOf('----------------') > -1 && foundHeaders && !foundFooter){
    			foundFooter = true;
    		}else if (foundHeaders && !foundFooter){
    			let parts = _.filter(line.split(' '), pt => { return pt.length > 0; }),
    				fileObj = {};

    			for (let pti = 0; pti < parts.length - 1; pti ++){
    				fileObj[headers[pti].toLowerCase()] = Helpers.isNumeric(parts[pti]) ? parseInt(parts[pti], 10) : parts[pti];
    			}

    			fileObj[headers[5].toLowerCase()] = parts.slice(parts.length - 1, parts.length).join(' ');

                // Add any missing properties (sometimes 'compressed' returns empty value)
                headers.map(header => {
                    if (!fileObj[header.toLowerCase()]){ fileObj[header.toLowerCase()] = 0; }
                });

    			fileListing.push(fileObj);
    		}
    	}


    	return { meta: meta, files: fileListing };
    }

}

module.exports = Parse;