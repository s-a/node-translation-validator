/* author: Stephan Ahlf  */

(function($, Handlebars, page){

  // "globals"

  var currentLanguageCode = "en-GB";

  var I18n = function(){
    return this;
  };

  I18n.prototype.format = function(str, args) {
    return str.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  };

  I18n.prototype.translate = function(languageCode, str){
    var formatParms = [];
    for (var i = 2; i < arguments.length; i++) {
      var arg = arguments[i];
      if (typeof(arg) === "string"){
        formatParms.push(arg);
      }
    }

    var translation = str;
    try{
      var dictionary = i18nDictionary[languageCode];
      translation = dictionary[str];
      translation = i18n.format(translation, formatParms); 
    } catch(e){
      console.warn("NO TRANSLATION found", languageCode, str);
      translation = str;
    }

    return translation;
  };

  var i18n = new I18n();
 
  Handlebars.registerHelper('i18n', i18n.translate);

  var init = function() {
    console.log(i18n.translate(currentLanguageCode, "testing_data"));
    console.log(i18n.translate(currentLanguageCode, 'testing_data_done'));
  };

  init();


})(window.jQuery.noConflict(), window.Handlebars, window.page);