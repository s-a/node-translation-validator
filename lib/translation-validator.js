var should = require('should');
var path = require("path");


var TranslationValidator = function () {
    this.dictionaries = [];
    this.keys = [];
    return this;
};

TranslationValidator.prototype.identifyTranslationKeys = function (templateString, regEx) {
    var result;
    //var count = (templateString.match(/{{i18n languageCode '/g) || []).length;
    while ((result = regEx.exec(templateString)) !== null) {
        //count--;
        if (this.keys.indexOf(result[1]) === -1) {
            // console.log(result[1]);
            this.keys.push(result[1]);
        }
    }
};





var generateDictionaryKeyInUseTestsForLanguage = function (name, language, dict, key) {
    it('\"' + key + '\" should exist in dictionary', function () {
        should.exist(dict[language][key]);
    });
};


TranslationValidator.prototype.generateDictionaryKeyNotInUseTestsForLanguage = function(name, language, dict, key) {
    var self = this;
    it('Key \"' + key + '\" ("' + language + '") should be in use', function () {
        self.keys.indexOf(key).should.not.equal(-1);
    });
};

 

TranslationValidator.prototype.generateDictionaryKeysInUseTestsForLanguage = function(name, language, dict) {
    var self = this;
    describe('Test used keys against dictionary in ' + name + " (" + language + ")", function () {
        for (var i = 0; i < self.keys.length; i++) {
            var key = self.keys[i];
            generateDictionaryKeyInUseTestsForLanguage(name, language, dict, key)
        };
    });
};


TranslationValidator.prototype.generateDictionaryKeysInUseTests = function(dictionary) {
    for (var language in dictionary.data) {
        this.generateDictionaryKeysInUseTestsForLanguage(dictionary.name, language, dictionary.data);
    }
};
 

TranslationValidator.prototype.validate = function() {
    var self = this;
    describe('identify keys in dictionaries and compare them to used keys in templateStrings and vice versa', function () {
        for (var i = 0; i < self.dictionaries.length; i++) {
            var dictionary = self.dictionaries[i];

            self.generateDictionaryKeysInUseTests(dictionary);

            describe('Test declared keys ' + dictionary.name + ' gainst usage', function () {
                var keys = [];
                for (var lng in dictionary.data) {
                    for (var key in dictionary.data[lng]) {
                        if (keys.indexOf(key) === -1) { // avoid double test
                            self.generateDictionaryKeyNotInUseTestsForLanguage(dictionary.name, lng, dictionary.data, key);
                            keys.push(key);
                        }
                    }
                }
            });
        }


        it('should find some keys', function () {
            self.keys.length.should.above(1);
        });

        it('should find some dictionaries', function () {
            self.dictionaries.length.should.above(1);
        });
    });

};

TranslationValidator.prototype.scanTemplateString = function(templateString, regularExpressions /* array */) {
    for (var i = regularExpressions.length - 1; i >= 0; i--) {
        var regex = regularExpressions[i];
        this.identifyTranslationKeys(templateString, regex);      
    }
};

module.exports = TranslationValidator;