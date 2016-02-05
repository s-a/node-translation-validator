var should = require('should');
var TranslationValidator = require("./../lib/translation-validator.js");
var translationValidator = new TranslationValidator();

translationValidator.init();

var glob = require("glob")
var dictionaries = [];
var path = require("path");


var generateDictionaryKeyInUseTestsForLanguage = function (filename, language, dict, key) {
    it('\"' + key + '\" should exist in dictionary', function () {
        var dict = require(filename).i18nDictionary;
        should.exist(dict[language][key]);
        //console.log(dict[language][key]);
    });
};


var generateDictionaryKeyNotInUseTestsForLanguage = function (filename, language, dict, key) {
    it('Key \"' + key + '\" should be in use', function () {
        var dict = require(filename).i18nDictionary[language];
        translationValidator.keys.indexOf(key).should.not.equal(-1);
    });
};



var generateDictionaryKeysInUseTestsForLanguage = function (filename, language, dict) {

    describe('Test used keys against dictionary in ' + path.basename(filename) + " (" + language + ")", function () {
        for (var i = 0; i < translationValidator.keys.length; i++) {
            var key = translationValidator.keys[i];
            generateDictionaryKeyInUseTestsForLanguage(filename, language, dict, key)
        };
    });


};


var generateDictionaryKeysInUseTests = function (filename) {
    var dict = require(filename).i18nDictionary;

    for (var language in dict) {
        generateDictionaryKeysInUseTestsForLanguage(filename, language, dict);
    }


};

describe('identify dictionary keys and compare them to dictionary files', function () {

    before(function (done) {
        // options is optional
        glob("config/**/*.json", {}, function (er, files) {
            for (var i = 0; i < files.length; i++) {
                var filename = require("path").join(__dirname, "..", files[i]);
                dictionaries.push(filename);
                generateDictionaryKeysInUseTests(filename);


                describe('Test declared keys gainst usage', function () {
                    var keys = [];
                    var dict = require(filename).i18nDictionary;
                    for (var lng in dict) {
                        for (var key in dict[lng]) {
                            if (keys.indexOf(key) === -1) {
                                generateDictionaryKeyNotInUseTestsForLanguage(filename, lng, dict, key);
                                keys.push(key);
                            }
                        }
                    }
                });

            }

            done();
        });
    });

    it('should find some keys', function () {
        translationValidator.keys.length.should.above(20);
    });

    it('should find some dictionaries', function () {
        dictionaries.length.should.above(1);
    });





});
