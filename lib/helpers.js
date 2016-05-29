'use strict';

const fs = require('fs-extra'),
	path = require('path');

class Helpers {
	constructor() { }

	/**
	 * Checks if n is numeric
	 * @param  {String}  n
	 * @return {Boolean}
	 */
	static isNumeric(n){
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	/**
	 * Checks to see if val has something set
	 * @param  {Object}  val
	 * @return {Boolean}
	 */
	static hasValue(val){

    	if (val){
	    	if (val instanceof Date){
	    		return true;
	    	}else if (typeof val === 'object'){
	    		return true;
	    	}else if (this.isNumeric(val)){
	    		return true;
	    	}else if (val.length > 0){
	    		return true;
	    	}
	    }

    	return false;

    }

    /**
     * Checks if file exists.  Returns file object or null.
     * @param  {String} filePath
     * @return {String}
     */
    static exists(filePath){

    	try {
    		let stats = fs.statSync(filePath);
    		return stats && stats.mode ? path.parse(filePath) : null;
    	}catch(err){
    		return {};
    	}
    }
}

module.exports = Helpers;