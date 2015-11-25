/*jshint -W121 */
/*TODo: Although I (Xiaomin, s of 06/01/2015) ignore jshint warning in above, the following is not a good practice */
/*Need to review later.*/
String.prototype.replaceAt = function (index, character) {
  'use strict';
  return this.substr(0, index) + character + this.substr(index + character.length);
};

