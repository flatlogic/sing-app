'use strict';
var callsites = require('callsites');

module.exports = function (filepath) {
	var stacks = callsites();

	if (!filepath) {
		return stacks[2].getFileName();
	}

	var seenVal = false;

	// skip the first stack as it's this function
	for (var i = 1; i < stacks.length; i++) {
		var parentFilepath = stacks[i].getFileName();

		if (parentFilepath === filepath) {
			seenVal = true;
			continue;
		}

		// skip native modules
		if (parentFilepath === 'module.js') {
			continue;
		}

		if (seenVal && parentFilepath !== filepath) {
			return parentFilepath;
		}
	}
};
