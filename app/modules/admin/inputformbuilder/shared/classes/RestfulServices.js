IFB_NAMESPACE.restfulservices = (function () {

  'use strict';

  var restfulServices = {};
  var protocol, hostname, port, pathname;
  var restApi;

  //Private function
  function parseURL(url) {
    //Example:
    var parser = document.createElement('a');

    //Example: parser.href = "http://example.com:3000/pathname/?search=test#hash";

    //parser.protocol; // => "http:"
    //parser.hostname; // => "example.com"
    //parser.port;     // => "3000"
    //parser.pathname; // => "/pathname/"
    //parser.search;   // => "?search=test"
    //parser.hash;     // => "#hash"
    //parser.host;     // => "example.com:3000"

    parser.href = url;
    protocol = parser.protocol.substring(0, parser.protocol.length - 1);
    hostname = parser.hostname;
    pathname = parser.pathname.charAt(0) === '/' ? parser.pathname.substring(1) : parser.pathname;
    port = parser.port;
  }

  restfulServices.setBaseURL = function (appBaseURL, sessionId) {
    parseURL(appBaseURL);
    restApi = restful(hostname)
      .protocol(protocol)
      .port(port)
      .prefixUrl(pathname)
      //.header('Elli-Nextgen-Session', sessionId) // set global header for WPS
      .header('elli-session', sessionId); // set global header for OSB
    return this;
  };

  //Get a full collection. Returns a promise with an array of entities.
  restfulServices.getAll = function (path) {
    var responsePromise;
    responsePromise = restApi.all(path).getAll().then(function (response) {
      return response;
    }, function (response) {
      // The reponse code is not >= 200 and < 400
      //NGENY-1095, NGENY-2521 and NGENY-3543
      throw new Error('GET API: Invalid response');
    })/*jshint -W024 */
      .catch(function (err) {
        //NGENY-1095, NGENY-2521 and NGENY-3543
        //Deal with the error: logging and/or display error message in Modal window
      });

    return responsePromise;
  };

  //For Post
  restfulServices.post = function (path, data) {
    var responsePromise;
    responsePromise = restApi.all(path).post(data).then(function (response) {
      return response;
    }, function (response) {
      // The reponse code is not >= 200 and < 400
      //NGENY-1095, NGENY-2521 and NGENY-3543
      //ToDO: write coverage for unhandle error codes being return form the service
      if (response.status === elli.builder.constant.workSpaceConstant.responseBadDataError) {
        return response;
      }
      throw new Error('POST API: Invalid response');
    })/*jshint -W024 */
      .catch(function (err) {
        //NGENY-1095, NGENY-2521 and NGENY-3543
        //Deal with the error: logging and/or display error message in Modal window
      });

    return responsePromise;
  };

  //For Delete
  /*jshint -W024*/
  restfulServices.delete = function (path, data) {
    var responsePromise;
    responsePromise = restApi.one(path, data).delete().then(function (response) {
      return response;
    }, function (response) {
      // The reponse code is not >= 200 and < 400
      //NGENY-1095, NGENY-2521 and NGENY-3543
      //ToDO: write coverage for unhandle error codes being return form the service
      throw new Error('DELETE API: Invalid response');
    })/*jshint -W024 */
      .catch(function (err) {
        //NGENY-1095, NGENY-2521 and NGENY-3543
        //Deal with the error: logging and/or display error message in Modal window
      });

    return responsePromise;
  };

  //For Put
  restfulServices.put = function (path, data) {
    var responsePromise;
    responsePromise = restApi.all(path).put(data).then(function (response) {
      return response;
    }, function (response) {
      // The reponse code is not >= 200 and < 400
      //NGENY-1095, NGENY-2521 and NGENY-3543
      //ToDO: write coverage for unhandle error codes being return form the service
      throw new Error('PUT API: Invalid response');
    })/*jshint -W024 */
      .catch(function (err) {
        //NGENY-1095, NGENY-2521 and NGENY-3543
        //Deal with the error: logging and/or display error message in Modal window
      });

    return responsePromise;
  };

  return restfulServices;

}());

