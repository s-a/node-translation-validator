var fs = require("fs");
var path = require("path");
var glob = require("glob");
var translationValidator = require("./../lib/index.js");


// SCAN START for used translations in templates and source code files
translationValidator.scanTemplateString(
	fs.readFileSync(path.join(__dirname, "/../development-source/dev.html")).toString(), [
		/.*?{{i18n languageCode '(.*?)'.*?/g,
		/.*?{{i18n languageCode "(.*?)".*?/g
	]	
);

translationValidator.scanTemplateString(
	fs.readFileSync(path.join(__dirname, "/../development-source/main-app.js")).toString(), [
		/.*?i18n.translate\(currentLanguageCode, "(.*?)"\).*?/g,
		/.*?i18n.translate\(currentLanguageCode, '(.*?)'\).*?/g
	]
);
// SCAN END



// Manualy push translation keys if translations used programaticaly too nested.
translationValidator.keys.push("Deutsch");
translationValidator.keys.push("Englisch");



// Map custom dictionaries to validators expected format (see custom-dictionary-1.json).
before(function(){
	// Assign ditionaries to validator
	glob("dictionary/**/*.json", {}, function (er, files) {
	    for (var i = 0; i < files.length; i++) {
	        var filename = require("path").join(__dirname, "..", files[i]);
	        translationValidator.dictionaries.push({name:filename, data:require(filename).dictionary});
	    }
		translationValidator.validate();
	});
});

describe('i18n', function () { // need a test here to tell moch to run?
    it('validate', function () {
        require('assert')(true);
    });
});