'use strict';var index=require('./index-C0LU9Dzu.js');require('buffer'),require('stream'),require('http'),require('https'),require('http2'),require('util'),require('os'),require('path'),require('crypto'),require('fs');var noAuth=require('./noAuth-CtyTriK3.js');require('console'),require('process'),require('dns'),require('net'),require('events'),require('tls'),require('zlib'),require('url'),require('vm'),require('assert'),require('tty'),require('node:path'),require('child_process'),require('node:events'),require('querystring'),require('stream/web'),require('node:stream'),require('node:util'),require('worker_threads'),require('perf_hooks'),require('util/types'),require('async_hooks'),require('string_decoder'),require('diagnostics_channel'),require('timers'),require('fs/promises'),require('timers/promises'),require('constants'),require('node:os'),require('node:process'),require('node:http'),require('node:https'),require('node:zlib'),require('node:fs'),require('dgram'),require('node:url'),require('rusty-store-kv');const getValueFromTextNode = (obj) => {
    const textNodeName = "#text";
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== undefined) {
            obj[key] = obj[key][textNodeName];
        }
        else if (typeof obj[key] === "object" && obj[key] !== null) {
            obj[key] = getValueFromTextNode(obj[key]);
        }
    }
    return obj;
};var validator = {};var util = {};var hasRequiredUtil;

function requireUtil () {
	if (hasRequiredUtil) return util;
	hasRequiredUtil = 1;
	(function (exports) {

		const nameStartChar = ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
		const nameChar = nameStartChar + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
		const nameRegexp = '[' + nameStartChar + '][' + nameChar + ']*';
		const regexName = new RegExp('^' + nameRegexp + '$');

		const getAllMatches = function(string, regex) {
		  const matches = [];
		  let match = regex.exec(string);
		  while (match) {
		    const allmatches = [];
		    allmatches.startIndex = regex.lastIndex - match[0].length;
		    const len = match.length;
		    for (let index = 0; index < len; index++) {
		      allmatches.push(match[index]);
		    }
		    matches.push(allmatches);
		    match = regex.exec(string);
		  }
		  return matches;
		};

		const isName = function(string) {
		  const match = regexName.exec(string);
		  return !(match === null || typeof match === 'undefined');
		};

		exports.isExist = function(v) {
		  return typeof v !== 'undefined';
		};

		exports.isEmptyObject = function(obj) {
		  return Object.keys(obj).length === 0;
		};

		/**
		 * Copy all the properties of a into b.
		 * @param {*} target
		 * @param {*} a
		 */
		exports.merge = function(target, a, arrayMode) {
		  if (a) {
		    const keys = Object.keys(a); // will return an array of own properties
		    const len = keys.length; //don't make it inline
		    for (let i = 0; i < len; i++) {
		      if (arrayMode === 'strict') {
		        target[keys[i]] = [ a[keys[i]] ];
		      } else {
		        target[keys[i]] = a[keys[i]];
		      }
		    }
		  }
		};
		/* exports.merge =function (b,a){
		  return Object.assign(b,a);
		} */

		exports.getValue = function(v) {
		  if (exports.isExist(v)) {
		    return v;
		  } else {
		    return '';
		  }
		};

		// const fakeCall = function(a) {return a;};
		// const fakeCallNoReturn = function() {};

		exports.isName = isName;
		exports.getAllMatches = getAllMatches;
		exports.nameRegexp = nameRegexp; 
	} (util));
	return util;
}var hasRequiredValidator;

function requireValidator () {
	if (hasRequiredValidator) return validator;
	hasRequiredValidator = 1;

	const util = requireUtil();

	const defaultOptions = {
	  allowBooleanAttributes: false, //A tag can have attributes without any value
	  unpairedTags: []
	};

	//const tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
	validator.validate = function (xmlData, options) {
	  options = Object.assign({}, defaultOptions, options);

	  //xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
	  //xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
	  //xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE
	  const tags = [];
	  let tagFound = false;

	  //indicates that the root tag has been closed (aka. depth 0 has been reached)
	  let reachedRoot = false;

	  if (xmlData[0] === '\ufeff') {
	    // check for byte order mark (BOM)
	    xmlData = xmlData.substr(1);
	  }
	  
	  for (let i = 0; i < xmlData.length; i++) {

	    if (xmlData[i] === '<' && xmlData[i+1] === '?') {
	      i+=2;
	      i = readPI(xmlData,i);
	      if (i.err) return i;
	    }else if (xmlData[i] === '<') {
	      //starting of tag
	      //read until you reach to '>' avoiding any '>' in attribute value
	      let tagStartPos = i;
	      i++;
	      
	      if (xmlData[i] === '!') {
	        i = readCommentAndCDATA(xmlData, i);
	        continue;
	      } else {
	        let closingTag = false;
	        if (xmlData[i] === '/') {
	          //closing tag
	          closingTag = true;
	          i++;
	        }
	        //read tagname
	        let tagName = '';
	        for (; i < xmlData.length &&
	          xmlData[i] !== '>' &&
	          xmlData[i] !== ' ' &&
	          xmlData[i] !== '\t' &&
	          xmlData[i] !== '\n' &&
	          xmlData[i] !== '\r'; i++
	        ) {
	          tagName += xmlData[i];
	        }
	        tagName = tagName.trim();
	        //console.log(tagName);

	        if (tagName[tagName.length - 1] === '/') {
	          //self closing tag without attributes
	          tagName = tagName.substring(0, tagName.length - 1);
	          //continue;
	          i--;
	        }
	        if (!validateTagName(tagName)) {
	          let msg;
	          if (tagName.trim().length === 0) {
	            msg = "Invalid space after '<'.";
	          } else {
	            msg = "Tag '"+tagName+"' is an invalid name.";
	          }
	          return getErrorObject('InvalidTag', msg, getLineNumberForPosition(xmlData, i));
	        }

	        const result = readAttributeStr(xmlData, i);
	        if (result === false) {
	          return getErrorObject('InvalidAttr', "Attributes for '"+tagName+"' have open quote.", getLineNumberForPosition(xmlData, i));
	        }
	        let attrStr = result.value;
	        i = result.index;

	        if (attrStr[attrStr.length - 1] === '/') {
	          //self closing tag
	          const attrStrStart = i - attrStr.length;
	          attrStr = attrStr.substring(0, attrStr.length - 1);
	          const isValid = validateAttributeString(attrStr, options);
	          if (isValid === true) {
	            tagFound = true;
	            //continue; //text may presents after self closing tag
	          } else {
	            //the result from the nested function returns the position of the error within the attribute
	            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
	            //this gives us the absolute index in the entire xml, which we can use to find the line at last
	            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
	          }
	        } else if (closingTag) {
	          if (!result.tagClosed) {
	            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
	          } else if (attrStr.trim().length > 0) {
	            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
	          } else if (tags.length === 0) {
	            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
	          } else {
	            const otg = tags.pop();
	            if (tagName !== otg.tagName) {
	              let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
	              return getErrorObject('InvalidTag',
	                "Expected closing tag '"+otg.tagName+"' (opened in line "+openPos.line+", col "+openPos.col+") instead of closing tag '"+tagName+"'.",
	                getLineNumberForPosition(xmlData, tagStartPos));
	            }

	            //when there are no more tags, we reached the root level.
	            if (tags.length == 0) {
	              reachedRoot = true;
	            }
	          }
	        } else {
	          const isValid = validateAttributeString(attrStr, options);
	          if (isValid !== true) {
	            //the result from the nested function returns the position of the error within the attribute
	            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
	            //this gives us the absolute index in the entire xml, which we can use to find the line at last
	            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
	          }

	          //if the root level has been reached before ...
	          if (reachedRoot === true) {
	            return getErrorObject('InvalidXml', 'Multiple possible root nodes found.', getLineNumberForPosition(xmlData, i));
	          } else if(options.unpairedTags.indexOf(tagName) !== -1); else {
	            tags.push({tagName, tagStartPos});
	          }
	          tagFound = true;
	        }

	        //skip tag text value
	        //It may include comments and CDATA value
	        for (i++; i < xmlData.length; i++) {
	          if (xmlData[i] === '<') {
	            if (xmlData[i + 1] === '!') {
	              //comment or CADATA
	              i++;
	              i = readCommentAndCDATA(xmlData, i);
	              continue;
	            } else if (xmlData[i+1] === '?') {
	              i = readPI(xmlData, ++i);
	              if (i.err) return i;
	            } else {
	              break;
	            }
	          } else if (xmlData[i] === '&') {
	            const afterAmp = validateAmpersand(xmlData, i);
	            if (afterAmp == -1)
	              return getErrorObject('InvalidChar', "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
	            i = afterAmp;
	          }else {
	            if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
	              return getErrorObject('InvalidXml', "Extra text at the end", getLineNumberForPosition(xmlData, i));
	            }
	          }
	        } //end of reading tag text value
	        if (xmlData[i] === '<') {
	          i--;
	        }
	      }
	    } else {
	      if ( isWhiteSpace(xmlData[i])) {
	        continue;
	      }
	      return getErrorObject('InvalidChar', "char '"+xmlData[i]+"' is not expected.", getLineNumberForPosition(xmlData, i));
	    }
	  }

	  if (!tagFound) {
	    return getErrorObject('InvalidXml', 'Start tag expected.', 1);
	  }else if (tags.length == 1) {
	      return getErrorObject('InvalidTag', "Unclosed tag '"+tags[0].tagName+"'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
	  }else if (tags.length > 0) {
	      return getErrorObject('InvalidXml', "Invalid '"+
	          JSON.stringify(tags.map(t => t.tagName), null, 4).replace(/\r?\n/g, '')+
	          "' found.", {line: 1, col: 1});
	  }

	  return true;
	};

	function isWhiteSpace(char){
	  return char === ' ' || char === '\t' || char === '\n'  || char === '\r';
	}
	/**
	 * Read Processing insstructions and skip
	 * @param {*} xmlData
	 * @param {*} i
	 */
	function readPI(xmlData, i) {
	  const start = i;
	  for (; i < xmlData.length; i++) {
	    if (xmlData[i] == '?' || xmlData[i] == ' ') {
	      //tagname
	      const tagname = xmlData.substr(start, i - start);
	      if (i > 5 && tagname === 'xml') {
	        return getErrorObject('InvalidXml', 'XML declaration allowed only at the start of the document.', getLineNumberForPosition(xmlData, i));
	      } else if (xmlData[i] == '?' && xmlData[i + 1] == '>') {
	        //check if valid attribut string
	        i++;
	        break;
	      } else {
	        continue;
	      }
	    }
	  }
	  return i;
	}

	function readCommentAndCDATA(xmlData, i) {
	  if (xmlData.length > i + 5 && xmlData[i + 1] === '-' && xmlData[i + 2] === '-') {
	    //comment
	    for (i += 3; i < xmlData.length; i++) {
	      if (xmlData[i] === '-' && xmlData[i + 1] === '-' && xmlData[i + 2] === '>') {
	        i += 2;
	        break;
	      }
	    }
	  } else if (
	    xmlData.length > i + 8 &&
	    xmlData[i + 1] === 'D' &&
	    xmlData[i + 2] === 'O' &&
	    xmlData[i + 3] === 'C' &&
	    xmlData[i + 4] === 'T' &&
	    xmlData[i + 5] === 'Y' &&
	    xmlData[i + 6] === 'P' &&
	    xmlData[i + 7] === 'E'
	  ) {
	    let angleBracketsCount = 1;
	    for (i += 8; i < xmlData.length; i++) {
	      if (xmlData[i] === '<') {
	        angleBracketsCount++;
	      } else if (xmlData[i] === '>') {
	        angleBracketsCount--;
	        if (angleBracketsCount === 0) {
	          break;
	        }
	      }
	    }
	  } else if (
	    xmlData.length > i + 9 &&
	    xmlData[i + 1] === '[' &&
	    xmlData[i + 2] === 'C' &&
	    xmlData[i + 3] === 'D' &&
	    xmlData[i + 4] === 'A' &&
	    xmlData[i + 5] === 'T' &&
	    xmlData[i + 6] === 'A' &&
	    xmlData[i + 7] === '['
	  ) {
	    for (i += 8; i < xmlData.length; i++) {
	      if (xmlData[i] === ']' && xmlData[i + 1] === ']' && xmlData[i + 2] === '>') {
	        i += 2;
	        break;
	      }
	    }
	  }

	  return i;
	}

	const doubleQuote = '"';
	const singleQuote = "'";

	/**
	 * Keep reading xmlData until '<' is found outside the attribute value.
	 * @param {string} xmlData
	 * @param {number} i
	 */
	function readAttributeStr(xmlData, i) {
	  let attrStr = '';
	  let startChar = '';
	  let tagClosed = false;
	  for (; i < xmlData.length; i++) {
	    if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
	      if (startChar === '') {
	        startChar = xmlData[i];
	      } else if (startChar !== xmlData[i]) ; else {
	        startChar = '';
	      }
	    } else if (xmlData[i] === '>') {
	      if (startChar === '') {
	        tagClosed = true;
	        break;
	      }
	    }
	    attrStr += xmlData[i];
	  }
	  if (startChar !== '') {
	    return false;
	  }

	  return {
	    value: attrStr,
	    index: i,
	    tagClosed: tagClosed
	  };
	}

	/**
	 * Select all the attributes whether valid or invalid.
	 */
	const validAttrStrRegxp = new RegExp('(\\s*)([^\\s=]+)(\\s*=)?(\\s*([\'"])(([\\s\\S])*?)\\5)?', 'g');

	//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

	function validateAttributeString(attrStr, options) {
	  //console.log("start:"+attrStr+":end");

	  //if(attrStr.trim().length === 0) return true; //empty string

	  const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
	  const attrNames = {};

	  for (let i = 0; i < matches.length; i++) {
	    if (matches[i][1].length === 0) {
	      //nospace before attribute name: a="sd"b="saf"
	      return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' has no space in starting.", getPositionFromMatch(matches[i]))
	    } else if (matches[i][3] !== undefined && matches[i][4] === undefined) {
	      return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' is without value.", getPositionFromMatch(matches[i]));
	    } else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
	      //independent attribute: ab
	      return getErrorObject('InvalidAttr', "boolean attribute '"+matches[i][2]+"' is not allowed.", getPositionFromMatch(matches[i]));
	    }
	    /* else if(matches[i][6] === undefined){//attribute without value: ab=
	                    return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
	                } */
	    const attrName = matches[i][2];
	    if (!validateAttrName(attrName)) {
	      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is an invalid name.", getPositionFromMatch(matches[i]));
	    }
	    if (!attrNames.hasOwnProperty(attrName)) {
	      //check for duplicate attribute.
	      attrNames[attrName] = 1;
	    } else {
	      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is repeated.", getPositionFromMatch(matches[i]));
	    }
	  }

	  return true;
	}

	function validateNumberAmpersand(xmlData, i) {
	  let re = /\d/;
	  if (xmlData[i] === 'x') {
	    i++;
	    re = /[\da-fA-F]/;
	  }
	  for (; i < xmlData.length; i++) {
	    if (xmlData[i] === ';')
	      return i;
	    if (!xmlData[i].match(re))
	      break;
	  }
	  return -1;
	}

	function validateAmpersand(xmlData, i) {
	  // https://www.w3.org/TR/xml/#dt-charref
	  i++;
	  if (xmlData[i] === ';')
	    return -1;
	  if (xmlData[i] === '#') {
	    i++;
	    return validateNumberAmpersand(xmlData, i);
	  }
	  let count = 0;
	  for (; i < xmlData.length; i++, count++) {
	    if (xmlData[i].match(/\w/) && count < 20)
	      continue;
	    if (xmlData[i] === ';')
	      break;
	    return -1;
	  }
	  return i;
	}

	function getErrorObject(code, message, lineNumber) {
	  return {
	    err: {
	      code: code,
	      msg: message,
	      line: lineNumber.line || lineNumber,
	      col: lineNumber.col,
	    },
	  };
	}

	function validateAttrName(attrName) {
	  return util.isName(attrName);
	}

	// const startsWithXML = /^xml/i;

	function validateTagName(tagname) {
	  return util.isName(tagname) /* && !tagname.match(startsWithXML) */;
	}

	//this function returns the line number for the character at the given index
	function getLineNumberForPosition(xmlData, index) {
	  const lines = xmlData.substring(0, index).split(/\r?\n/);
	  return {
	    line: lines.length,

	    // column number is last line's length + 1, because column numbering starts at 1:
	    col: lines[lines.length - 1].length + 1
	  };
	}

	//this function returns the position of the first character of match within attrStr
	function getPositionFromMatch(match) {
	  return match.startIndex + match[1].length;
	}
	return validator;
}var OptionsBuilder = {};var hasRequiredOptionsBuilder;

function requireOptionsBuilder () {
	if (hasRequiredOptionsBuilder) return OptionsBuilder;
	hasRequiredOptionsBuilder = 1;
	const defaultOptions = {
	    preserveOrder: false,
	    attributeNamePrefix: '@_',
	    attributesGroupName: false,
	    textNodeName: '#text',
	    ignoreAttributes: true,
	    removeNSPrefix: false, // remove NS from tag name or attribute name if true
	    allowBooleanAttributes: false, //a tag can have attributes without any value
	    //ignoreRootElement : false,
	    parseTagValue: true,
	    parseAttributeValue: false,
	    trimValues: true, //Trim string values of tag and attributes
	    cdataPropName: false,
	    numberParseOptions: {
	      hex: true,
	      leadingZeros: true,
	      eNotation: true
	    },
	    tagValueProcessor: function(tagName, val) {
	      return val;
	    },
	    attributeValueProcessor: function(attrName, val) {
	      return val;
	    },
	    stopNodes: [], //nested tags will not be parsed even for errors
	    alwaysCreateTextNode: false,
	    isArray: () => false,
	    commentPropName: false,
	    unpairedTags: [],
	    processEntities: true,
	    htmlEntities: false,
	    ignoreDeclaration: false,
	    ignorePiTags: false,
	    transformTagName: false,
	    transformAttributeName: false,
	    updateTag: function(tagName, jPath, attrs){
	      return tagName
	    },
	    // skipEmptyListItem: false
	};
	   
	const buildOptions = function(options) {
	    return Object.assign({}, defaultOptions, options);
	};

	OptionsBuilder.buildOptions = buildOptions;
	OptionsBuilder.defaultOptions = defaultOptions;
	return OptionsBuilder;
}var xmlNode;
var hasRequiredXmlNode;

function requireXmlNode () {
	if (hasRequiredXmlNode) return xmlNode;
	hasRequiredXmlNode = 1;

	class XmlNode{
	  constructor(tagname) {
	    this.tagname = tagname;
	    this.child = []; //nested tags, text, cdata, comments in order
	    this[":@"] = {}; //attributes map
	  }
	  add(key,val){
	    // this.child.push( {name : key, val: val, isCdata: isCdata });
	    if(key === "__proto__") key = "#__proto__";
	    this.child.push( {[key]: val });
	  }
	  addChild(node) {
	    if(node.tagname === "__proto__") node.tagname = "#__proto__";
	    if(node[":@"] && Object.keys(node[":@"]).length > 0){
	      this.child.push( { [node.tagname]: node.child, [":@"]: node[":@"] });
	    }else {
	      this.child.push( { [node.tagname]: node.child });
	    }
	  };
	}

	xmlNode = XmlNode;
	return xmlNode;
}var DocTypeReader;
var hasRequiredDocTypeReader;

function requireDocTypeReader () {
	if (hasRequiredDocTypeReader) return DocTypeReader;
	hasRequiredDocTypeReader = 1;
	const util = requireUtil();

	//TODO: handle comments
	function readDocType(xmlData, i){
	    
	    const entities = {};
	    if( xmlData[i + 3] === 'O' &&
	         xmlData[i + 4] === 'C' &&
	         xmlData[i + 5] === 'T' &&
	         xmlData[i + 6] === 'Y' &&
	         xmlData[i + 7] === 'P' &&
	         xmlData[i + 8] === 'E')
	    {    
	        i = i+9;
	        let angleBracketsCount = 1;
	        let hasBody = false, comment = false;
	        let exp = "";
	        for(;i<xmlData.length;i++){
	            if (xmlData[i] === '<' && !comment) { //Determine the tag type
	                if( hasBody && isEntity(xmlData, i)){
	                    i += 7; 
	                    [entityName, val,i] = readEntityExp(xmlData,i+1);
	                    if(val.indexOf("&") === -1) //Parameter entities are not supported
	                        entities[ validateEntityName(entityName) ] = {
	                            regx : RegExp( `&${entityName};`,"g"),
	                            val: val
	                        };
	                }
	                else if( hasBody && isElement(xmlData, i))  i += 8;//Not supported
	                else if( hasBody && isAttlist(xmlData, i))  i += 8;//Not supported
	                else if( hasBody && isNotation(xmlData, i)) i += 9;//Not supported
	                else if( isComment)                         comment = true;
	                else                                        throw new Error("Invalid DOCTYPE");

	                angleBracketsCount++;
	                exp = "";
	            } else if (xmlData[i] === '>') { //Read tag content
	                if(comment){
	                    if( xmlData[i - 1] === "-" && xmlData[i - 2] === "-"){
	                        comment = false;
	                        angleBracketsCount--;
	                    }
	                }else {
	                    angleBracketsCount--;
	                }
	                if (angleBracketsCount === 0) {
	                  break;
	                }
	            }else if( xmlData[i] === '['){
	                hasBody = true;
	            }else {
	                exp += xmlData[i];
	            }
	        }
	        if(angleBracketsCount !== 0){
	            throw new Error(`Unclosed DOCTYPE`);
	        }
	    }else {
	        throw new Error(`Invalid Tag instead of DOCTYPE`);
	    }
	    return {entities, i};
	}

	function readEntityExp(xmlData,i){
	    //External entities are not supported
	    //    <!ENTITY ext SYSTEM "http://normal-website.com" >

	    //Parameter entities are not supported
	    //    <!ENTITY entityname "&anotherElement;">

	    //Internal entities are supported
	    //    <!ENTITY entityname "replacement text">
	    
	    //read EntityName
	    let entityName = "";
	    for (; i < xmlData.length && (xmlData[i] !== "'" && xmlData[i] !== '"' ); i++) {
	        // if(xmlData[i] === " ") continue;
	        // else 
	        entityName += xmlData[i];
	    }
	    entityName = entityName.trim();
	    if(entityName.indexOf(" ") !== -1) throw new Error("External entites are not supported");

	    //read Entity Value
	    const startChar = xmlData[i++];
	    let val = "";
	    for (; i < xmlData.length && xmlData[i] !== startChar ; i++) {
	        val += xmlData[i];
	    }
	    return [entityName, val, i];
	}

	function isComment(xmlData, i){
	    if(xmlData[i+1] === '!' &&
	    xmlData[i+2] === '-' &&
	    xmlData[i+3] === '-') return true
	    return false
	}
	function isEntity(xmlData, i){
	    if(xmlData[i+1] === '!' &&
	    xmlData[i+2] === 'E' &&
	    xmlData[i+3] === 'N' &&
	    xmlData[i+4] === 'T' &&
	    xmlData[i+5] === 'I' &&
	    xmlData[i+6] === 'T' &&
	    xmlData[i+7] === 'Y') return true
	    return false
	}
	function isElement(xmlData, i){
	    if(xmlData[i+1] === '!' &&
	    xmlData[i+2] === 'E' &&
	    xmlData[i+3] === 'L' &&
	    xmlData[i+4] === 'E' &&
	    xmlData[i+5] === 'M' &&
	    xmlData[i+6] === 'E' &&
	    xmlData[i+7] === 'N' &&
	    xmlData[i+8] === 'T') return true
	    return false
	}

	function isAttlist(xmlData, i){
	    if(xmlData[i+1] === '!' &&
	    xmlData[i+2] === 'A' &&
	    xmlData[i+3] === 'T' &&
	    xmlData[i+4] === 'T' &&
	    xmlData[i+5] === 'L' &&
	    xmlData[i+6] === 'I' &&
	    xmlData[i+7] === 'S' &&
	    xmlData[i+8] === 'T') return true
	    return false
	}
	function isNotation(xmlData, i){
	    if(xmlData[i+1] === '!' &&
	    xmlData[i+2] === 'N' &&
	    xmlData[i+3] === 'O' &&
	    xmlData[i+4] === 'T' &&
	    xmlData[i+5] === 'A' &&
	    xmlData[i+6] === 'T' &&
	    xmlData[i+7] === 'I' &&
	    xmlData[i+8] === 'O' &&
	    xmlData[i+9] === 'N') return true
	    return false
	}

	function validateEntityName(name){
	    if (util.isName(name))
		return name;
	    else
	        throw new Error(`Invalid entity name ${name}`);
	}

	DocTypeReader = readDocType;
	return DocTypeReader;
}var strnum;
var hasRequiredStrnum;

function requireStrnum () {
	if (hasRequiredStrnum) return strnum;
	hasRequiredStrnum = 1;
	const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
	const numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
	// const octRegex = /0x[a-z0-9]+/;
	// const binRegex = /0x[a-z0-9]+/;


	//polyfill
	if (!Number.parseInt && window.parseInt) {
	    Number.parseInt = window.parseInt;
	}
	if (!Number.parseFloat && window.parseFloat) {
	    Number.parseFloat = window.parseFloat;
	}

	  
	const consider = {
	    hex :  true,
	    leadingZeros: true,
	    decimalPoint: "\.",
	    eNotation: true
	    //skipLike: /regex/
	};

	function toNumber(str, options = {}){
	    // const options = Object.assign({}, consider);
	    // if(opt.leadingZeros === false){
	    //     options.leadingZeros = false;
	    // }else if(opt.hex === false){
	    //     options.hex = false;
	    // }

	    options = Object.assign({}, consider, options );
	    if(!str || typeof str !== "string" ) return str;
	    
	    let trimmedStr  = str.trim();
	    // if(trimmedStr === "0.0") return 0;
	    // else if(trimmedStr === "+0.0") return 0;
	    // else if(trimmedStr === "-0.0") return -0;

	    if(options.skipLike !== undefined && options.skipLike.test(trimmedStr)) return str;
	    else if (options.hex && hexRegex.test(trimmedStr)) {
	        return Number.parseInt(trimmedStr, 16);
	    // } else if (options.parseOct && octRegex.test(str)) {
	    //     return Number.parseInt(val, 8);
	    // }else if (options.parseBin && binRegex.test(str)) {
	    //     return Number.parseInt(val, 2);
	    }else {
	        //separate negative sign, leading zeros, and rest number
	        const match = numRegex.exec(trimmedStr);
	        if(match){
	            const sign = match[1];
	            const leadingZeros = match[2];
	            let numTrimmedByZeros = trimZeros(match[3]); //complete num without leading zeros
	            //trim ending zeros for floating number
	            
	            const eNotation = match[4] || match[6];
	            if(!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str; //-0123
	            else if(!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str; //0123
	            else {//no leading zeros or leading zeros are allowed
	                const num = Number(trimmedStr);
	                const numStr = "" + num;
	                if(numStr.search(/[eE]/) !== -1){ //given number is long and parsed to eNotation
	                    if(options.eNotation) return num;
	                    else return str;
	                }else if(eNotation){ //given number has enotation
	                    if(options.eNotation) return num;
	                    else return str;
	                }else if(trimmedStr.indexOf(".") !== -1){ //floating number
	                    // const decimalPart = match[5].substr(1);
	                    // const intPart = trimmedStr.substr(0,trimmedStr.indexOf("."));

	                    
	                    // const p = numStr.indexOf(".");
	                    // const givenIntPart = numStr.substr(0,p);
	                    // const givenDecPart = numStr.substr(p+1);
	                    if(numStr === "0" && (numTrimmedByZeros === "") ) return num; //0.0
	                    else if(numStr === numTrimmedByZeros) return num; //0.456. 0.79000
	                    else if( sign && numStr === "-"+numTrimmedByZeros) return num;
	                    else return str;
	                }
	                
	                if(leadingZeros){
	                    // if(numTrimmedByZeros === numStr){
	                    //     if(options.leadingZeros) return num;
	                    //     else return str;
	                    // }else return str;
	                    if(numTrimmedByZeros === numStr) return num;
	                    else if(sign+numTrimmedByZeros === numStr) return num;
	                    else return str;
	                }

	                if(trimmedStr === numStr) return num;
	                else if(trimmedStr === sign+numStr) return num;
	                // else{
	                //     //number with +/- sign
	                //     trimmedStr.test(/[-+][0-9]);

	                // }
	                return str;
	            }
	            // else if(!eNotation && trimmedStr && trimmedStr !== Number(trimmedStr) ) return str;
	            
	        }else { //non-numeric string
	            return str;
	        }
	    }
	}

	/**
	 * 
	 * @param {string} numStr without leading zeros
	 * @returns 
	 */
	function trimZeros(numStr){
	    if(numStr && numStr.indexOf(".") !== -1){//float
	        numStr = numStr.replace(/0+$/, ""); //remove ending zeros
	        if(numStr === ".")  numStr = "0";
	        else if(numStr[0] === ".")  numStr = "0"+numStr;
	        else if(numStr[numStr.length-1] === ".")  numStr = numStr.substr(0,numStr.length-1);
	        return numStr;
	    }
	    return numStr;
	}
	strnum = toNumber;
	return strnum;
}var OrderedObjParser_1;
var hasRequiredOrderedObjParser;

function requireOrderedObjParser () {
	if (hasRequiredOrderedObjParser) return OrderedObjParser_1;
	hasRequiredOrderedObjParser = 1;
	///@ts-check

	const util = requireUtil();
	const xmlNode = requireXmlNode();
	const readDocType = requireDocTypeReader();
	const toNumber = requireStrnum();

	// const regx =
	//   '<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)'
	//   .replace(/NAME/g, util.nameRegexp);

	//const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
	//const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");

	class OrderedObjParser{
	  constructor(options){
	    this.options = options;
	    this.currentNode = null;
	    this.tagsNodeStack = [];
	    this.docTypeEntities = {};
	    this.lastEntities = {
	      "apos" : { regex: /&(apos|#39|#x27);/g, val : "'"},
	      "gt" : { regex: /&(gt|#62|#x3E);/g, val : ">"},
	      "lt" : { regex: /&(lt|#60|#x3C);/g, val : "<"},
	      "quot" : { regex: /&(quot|#34|#x22);/g, val : "\""},
	    };
	    this.ampEntity = { regex: /&(amp|#38|#x26);/g, val : "&"};
	    this.htmlEntities = {
	      "space": { regex: /&(nbsp|#160);/g, val: " " },
	      // "lt" : { regex: /&(lt|#60);/g, val: "<" },
	      // "gt" : { regex: /&(gt|#62);/g, val: ">" },
	      // "amp" : { regex: /&(amp|#38);/g, val: "&" },
	      // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
	      // "apos" : { regex: /&(apos|#39);/g, val: "'" },
	      "cent" : { regex: /&(cent|#162);/g, val: "¢" },
	      "pound" : { regex: /&(pound|#163);/g, val: "£" },
	      "yen" : { regex: /&(yen|#165);/g, val: "¥" },
	      "euro" : { regex: /&(euro|#8364);/g, val: "€" },
	      "copyright" : { regex: /&(copy|#169);/g, val: "©" },
	      "reg" : { regex: /&(reg|#174);/g, val: "®" },
	      "inr" : { regex: /&(inr|#8377);/g, val: "₹" },
	      "num_dec": { regex: /&#([0-9]{1,7});/g, val : (_, str) => String.fromCharCode(Number.parseInt(str, 10)) },
	      "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val : (_, str) => String.fromCharCode(Number.parseInt(str, 16)) },
	    };
	    this.addExternalEntities = addExternalEntities;
	    this.parseXml = parseXml;
	    this.parseTextData = parseTextData;
	    this.resolveNameSpace = resolveNameSpace;
	    this.buildAttributesMap = buildAttributesMap;
	    this.isItStopNode = isItStopNode;
	    this.replaceEntitiesValue = replaceEntitiesValue;
	    this.readStopNodeData = readStopNodeData;
	    this.saveTextToParentTag = saveTextToParentTag;
	    this.addChild = addChild;
	  }

	}

	function addExternalEntities(externalEntities){
	  const entKeys = Object.keys(externalEntities);
	  for (let i = 0; i < entKeys.length; i++) {
	    const ent = entKeys[i];
	    this.lastEntities[ent] = {
	       regex: new RegExp("&"+ent+";","g"),
	       val : externalEntities[ent]
	    };
	  }
	}

	/**
	 * @param {string} val
	 * @param {string} tagName
	 * @param {string} jPath
	 * @param {boolean} dontTrim
	 * @param {boolean} hasAttributes
	 * @param {boolean} isLeafNode
	 * @param {boolean} escapeEntities
	 */
	function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
	  if (val !== undefined) {
	    if (this.options.trimValues && !dontTrim) {
	      val = val.trim();
	    }
	    if(val.length > 0){
	      if(!escapeEntities) val = this.replaceEntitiesValue(val);
	      
	      const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
	      if(newval === null || newval === undefined){
	        //don't parse
	        return val;
	      }else if(typeof newval !== typeof val || newval !== val){
	        //overwrite
	        return newval;
	      }else if(this.options.trimValues){
	        return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
	      }else {
	        const trimmedVal = val.trim();
	        if(trimmedVal === val){
	          return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
	        }else {
	          return val;
	        }
	      }
	    }
	  }
	}

	function resolveNameSpace(tagname) {
	  if (this.options.removeNSPrefix) {
	    const tags = tagname.split(':');
	    const prefix = tagname.charAt(0) === '/' ? '/' : '';
	    if (tags[0] === 'xmlns') {
	      return '';
	    }
	    if (tags.length === 2) {
	      tagname = prefix + tags[1];
	    }
	  }
	  return tagname;
	}

	//TODO: change regex to capture NS
	//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
	const attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])([\\s\\S]*?)\\3)?', 'gm');

	function buildAttributesMap(attrStr, jPath, tagName) {
	  if (!this.options.ignoreAttributes && typeof attrStr === 'string') {
	    // attrStr = attrStr.replace(/\r?\n/g, ' ');
	    //attrStr = attrStr || attrStr.trim();

	    const matches = util.getAllMatches(attrStr, attrsRegx);
	    const len = matches.length; //don't make it inline
	    const attrs = {};
	    for (let i = 0; i < len; i++) {
	      const attrName = this.resolveNameSpace(matches[i][1]);
	      let oldVal = matches[i][4];
	      let aName = this.options.attributeNamePrefix + attrName;
	      if (attrName.length) {
	        if (this.options.transformAttributeName) {
	          aName = this.options.transformAttributeName(aName);
	        }
	        if(aName === "__proto__") aName  = "#__proto__";
	        if (oldVal !== undefined) {
	          if (this.options.trimValues) {
	            oldVal = oldVal.trim();
	          }
	          oldVal = this.replaceEntitiesValue(oldVal);
	          const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
	          if(newVal === null || newVal === undefined){
	            //don't parse
	            attrs[aName] = oldVal;
	          }else if(typeof newVal !== typeof oldVal || newVal !== oldVal){
	            //overwrite
	            attrs[aName] = newVal;
	          }else {
	            //parse
	            attrs[aName] = parseValue(
	              oldVal,
	              this.options.parseAttributeValue,
	              this.options.numberParseOptions
	            );
	          }
	        } else if (this.options.allowBooleanAttributes) {
	          attrs[aName] = true;
	        }
	      }
	    }
	    if (!Object.keys(attrs).length) {
	      return;
	    }
	    if (this.options.attributesGroupName) {
	      const attrCollection = {};
	      attrCollection[this.options.attributesGroupName] = attrs;
	      return attrCollection;
	    }
	    return attrs
	  }
	}

	const parseXml = function(xmlData) {
	  xmlData = xmlData.replace(/\r\n?/g, "\n"); //TODO: remove this line
	  const xmlObj = new xmlNode('!xml');
	  let currentNode = xmlObj;
	  let textData = "";
	  let jPath = "";
	  for(let i=0; i< xmlData.length; i++){//for each char in XML data
	    const ch = xmlData[i];
	    if(ch === '<'){
	      // const nextIndex = i+1;
	      // const _2ndChar = xmlData[nextIndex];
	      if( xmlData[i+1] === '/') {//Closing Tag
	        const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
	        let tagName = xmlData.substring(i+2,closeIndex).trim();

	        if(this.options.removeNSPrefix){
	          const colonIndex = tagName.indexOf(":");
	          if(colonIndex !== -1){
	            tagName = tagName.substr(colonIndex+1);
	          }
	        }

	        if(this.options.transformTagName) {
	          tagName = this.options.transformTagName(tagName);
	        }

	        if(currentNode){
	          textData = this.saveTextToParentTag(textData, currentNode, jPath);
	        }

	        //check if last tag of nested tag was unpaired tag
	        const lastTagName = jPath.substring(jPath.lastIndexOf(".")+1);
	        if(tagName && this.options.unpairedTags.indexOf(tagName) !== -1 ){
	          throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
	        }
	        let propIndex = 0;
	        if(lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1 ){
	          propIndex = jPath.lastIndexOf('.', jPath.lastIndexOf('.')-1);
	          this.tagsNodeStack.pop();
	        }else {
	          propIndex = jPath.lastIndexOf(".");
	        }
	        jPath = jPath.substring(0, propIndex);

	        currentNode = this.tagsNodeStack.pop();//avoid recursion, set the parent tag scope
	        textData = "";
	        i = closeIndex;
	      } else if( xmlData[i+1] === '?') {

	        let tagData = readTagExp(xmlData,i, false, "?>");
	        if(!tagData) throw new Error("Pi Tag is not closed.");

	        textData = this.saveTextToParentTag(textData, currentNode, jPath);
	        if( (this.options.ignoreDeclaration && tagData.tagName === "?xml") || this.options.ignorePiTags);else {
	  
	          const childNode = new xmlNode(tagData.tagName);
	          childNode.add(this.options.textNodeName, "");
	          
	          if(tagData.tagName !== tagData.tagExp && tagData.attrExpPresent){
	            childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
	          }
	          this.addChild(currentNode, childNode, jPath);

	        }


	        i = tagData.closeIndex + 1;
	      } else if(xmlData.substr(i + 1, 3) === '!--') {
	        const endIndex = findClosingIndex(xmlData, "-->", i+4, "Comment is not closed.");
	        if(this.options.commentPropName){
	          const comment = xmlData.substring(i + 4, endIndex - 2);

	          textData = this.saveTextToParentTag(textData, currentNode, jPath);

	          currentNode.add(this.options.commentPropName, [ { [this.options.textNodeName] : comment } ]);
	        }
	        i = endIndex;
	      } else if( xmlData.substr(i + 1, 2) === '!D') {
	        const result = readDocType(xmlData, i);
	        this.docTypeEntities = result.entities;
	        i = result.i;
	      }else if(xmlData.substr(i + 1, 2) === '![') {
	        const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
	        const tagExp = xmlData.substring(i + 9,closeIndex);

	        textData = this.saveTextToParentTag(textData, currentNode, jPath);

	        let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
	        if(val == undefined) val = "";

	        //cdata should be set even if it is 0 length string
	        if(this.options.cdataPropName){
	          currentNode.add(this.options.cdataPropName, [ { [this.options.textNodeName] : tagExp } ]);
	        }else {
	          currentNode.add(this.options.textNodeName, val);
	        }
	        
	        i = closeIndex + 2;
	      }else {//Opening tag
	        let result = readTagExp(xmlData,i, this.options.removeNSPrefix);
	        let tagName= result.tagName;
	        const rawTagName = result.rawTagName;
	        let tagExp = result.tagExp;
	        let attrExpPresent = result.attrExpPresent;
	        let closeIndex = result.closeIndex;

	        if (this.options.transformTagName) {
	          tagName = this.options.transformTagName(tagName);
	        }
	        
	        //save text as child node
	        if (currentNode && textData) {
	          if(currentNode.tagname !== '!xml'){
	            //when nested tag is found
	            textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
	          }
	        }

	        //check if last tag was unpaired tag
	        const lastTag = currentNode;
	        if(lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1 ){
	          currentNode = this.tagsNodeStack.pop();
	          jPath = jPath.substring(0, jPath.lastIndexOf("."));
	        }
	        if(tagName !== xmlObj.tagname){
	          jPath += jPath ? "." + tagName : tagName;
	        }
	        if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
	          let tagContent = "";
	          //self-closing tag
	          if(tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1){
	            if(tagName[tagName.length - 1] === "/"){ //remove trailing '/'
	              tagName = tagName.substr(0, tagName.length - 1);
	              jPath = jPath.substr(0, jPath.length - 1);
	              tagExp = tagName;
	            }else {
	              tagExp = tagExp.substr(0, tagExp.length - 1);
	            }
	            i = result.closeIndex;
	          }
	          //unpaired tag
	          else if(this.options.unpairedTags.indexOf(tagName) !== -1){
	            
	            i = result.closeIndex;
	          }
	          //normal tag
	          else {
	            //read until closing tag is found
	            const result = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
	            if(!result) throw new Error(`Unexpected end of ${rawTagName}`);
	            i = result.i;
	            tagContent = result.tagContent;
	          }

	          const childNode = new xmlNode(tagName);
	          if(tagName !== tagExp && attrExpPresent){
	            childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
	          }
	          if(tagContent) {
	            tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
	          }
	          
	          jPath = jPath.substr(0, jPath.lastIndexOf("."));
	          childNode.add(this.options.textNodeName, tagContent);
	          
	          this.addChild(currentNode, childNode, jPath);
	        }else {
	  //selfClosing tag
	          if(tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1){
	            if(tagName[tagName.length - 1] === "/"){ //remove trailing '/'
	              tagName = tagName.substr(0, tagName.length - 1);
	              jPath = jPath.substr(0, jPath.length - 1);
	              tagExp = tagName;
	            }else {
	              tagExp = tagExp.substr(0, tagExp.length - 1);
	            }
	            
	            if(this.options.transformTagName) {
	              tagName = this.options.transformTagName(tagName);
	            }

	            const childNode = new xmlNode(tagName);
	            if(tagName !== tagExp && attrExpPresent){
	              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
	            }
	            this.addChild(currentNode, childNode, jPath);
	            jPath = jPath.substr(0, jPath.lastIndexOf("."));
	          }
	    //opening tag
	          else {
	            const childNode = new xmlNode( tagName);
	            this.tagsNodeStack.push(currentNode);
	            
	            if(tagName !== tagExp && attrExpPresent){
	              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
	            }
	            this.addChild(currentNode, childNode, jPath);
	            currentNode = childNode;
	          }
	          textData = "";
	          i = closeIndex;
	        }
	      }
	    }else {
	      textData += xmlData[i];
	    }
	  }
	  return xmlObj.child;
	};

	function addChild(currentNode, childNode, jPath){
	  const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
	  if(result === false);else if(typeof result === "string"){
	    childNode.tagname = result;
	    currentNode.addChild(childNode);
	  }else {
	    currentNode.addChild(childNode);
	  }
	}

	const replaceEntitiesValue = function(val){

	  if(this.options.processEntities){
	    for(let entityName in this.docTypeEntities){
	      const entity = this.docTypeEntities[entityName];
	      val = val.replace( entity.regx, entity.val);
	    }
	    for(let entityName in this.lastEntities){
	      const entity = this.lastEntities[entityName];
	      val = val.replace( entity.regex, entity.val);
	    }
	    if(this.options.htmlEntities){
	      for(let entityName in this.htmlEntities){
	        const entity = this.htmlEntities[entityName];
	        val = val.replace( entity.regex, entity.val);
	      }
	    }
	    val = val.replace( this.ampEntity.regex, this.ampEntity.val);
	  }
	  return val;
	};
	function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
	  if (textData) { //store previously collected data as textNode
	    if(isLeafNode === undefined) isLeafNode = Object.keys(currentNode.child).length === 0;
	    
	    textData = this.parseTextData(textData,
	      currentNode.tagname,
	      jPath,
	      false,
	      currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
	      isLeafNode);

	    if (textData !== undefined && textData !== "")
	      currentNode.add(this.options.textNodeName, textData);
	    textData = "";
	  }
	  return textData;
	}

	//TODO: use jPath to simplify the logic
	/**
	 * 
	 * @param {string[]} stopNodes 
	 * @param {string} jPath
	 * @param {string} currentTagName 
	 */
	function isItStopNode(stopNodes, jPath, currentTagName){
	  const allNodesExp = "*." + currentTagName;
	  for (const stopNodePath in stopNodes) {
	    const stopNodeExp = stopNodes[stopNodePath];
	    if( allNodesExp === stopNodeExp || jPath === stopNodeExp  ) return true;
	  }
	  return false;
	}

	/**
	 * Returns the tag Expression and where it is ending handling single-double quotes situation
	 * @param {string} xmlData 
	 * @param {number} i starting index
	 * @returns 
	 */
	function tagExpWithClosingIndex(xmlData, i, closingChar = ">"){
	  let attrBoundary;
	  let tagExp = "";
	  for (let index = i; index < xmlData.length; index++) {
	    let ch = xmlData[index];
	    if (attrBoundary) {
	        if (ch === attrBoundary) attrBoundary = "";//reset
	    } else if (ch === '"' || ch === "'") {
	        attrBoundary = ch;
	    } else if (ch === closingChar[0]) {
	      if(closingChar[1]){
	        if(xmlData[index + 1] === closingChar[1]){
	          return {
	            data: tagExp,
	            index: index
	          }
	        }
	      }else {
	        return {
	          data: tagExp,
	          index: index
	        }
	      }
	    } else if (ch === '\t') {
	      ch = " ";
	    }
	    tagExp += ch;
	  }
	}

	function findClosingIndex(xmlData, str, i, errMsg){
	  const closingIndex = xmlData.indexOf(str, i);
	  if(closingIndex === -1){
	    throw new Error(errMsg)
	  }else {
	    return closingIndex + str.length - 1;
	  }
	}

	function readTagExp(xmlData,i, removeNSPrefix, closingChar = ">"){
	  const result = tagExpWithClosingIndex(xmlData, i+1, closingChar);
	  if(!result) return;
	  let tagExp = result.data;
	  const closeIndex = result.index;
	  const separatorIndex = tagExp.search(/\s/);
	  let tagName = tagExp;
	  let attrExpPresent = true;
	  if(separatorIndex !== -1){//separate tag name and attributes expression
	    tagName = tagExp.substring(0, separatorIndex);
	    tagExp = tagExp.substring(separatorIndex + 1).trimStart();
	  }

	  const rawTagName = tagName;
	  if(removeNSPrefix){
	    const colonIndex = tagName.indexOf(":");
	    if(colonIndex !== -1){
	      tagName = tagName.substr(colonIndex+1);
	      attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
	    }
	  }

	  return {
	    tagName: tagName,
	    tagExp: tagExp,
	    closeIndex: closeIndex,
	    attrExpPresent: attrExpPresent,
	    rawTagName: rawTagName,
	  }
	}
	/**
	 * find paired tag for a stop node
	 * @param {string} xmlData 
	 * @param {string} tagName 
	 * @param {number} i 
	 */
	function readStopNodeData(xmlData, tagName, i){
	  const startIndex = i;
	  // Starting at 1 since we already have an open tag
	  let openTagCount = 1;

	  for (; i < xmlData.length; i++) {
	    if( xmlData[i] === "<"){ 
	      if (xmlData[i+1] === "/") {//close tag
	          const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
	          let closeTagName = xmlData.substring(i+2,closeIndex).trim();
	          if(closeTagName === tagName){
	            openTagCount--;
	            if (openTagCount === 0) {
	              return {
	                tagContent: xmlData.substring(startIndex, i),
	                i : closeIndex
	              }
	            }
	          }
	          i=closeIndex;
	        } else if(xmlData[i+1] === '?') { 
	          const closeIndex = findClosingIndex(xmlData, "?>", i+1, "StopNode is not closed.");
	          i=closeIndex;
	        } else if(xmlData.substr(i + 1, 3) === '!--') { 
	          const closeIndex = findClosingIndex(xmlData, "-->", i+3, "StopNode is not closed.");
	          i=closeIndex;
	        } else if(xmlData.substr(i + 1, 2) === '![') { 
	          const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
	          i=closeIndex;
	        } else {
	          const tagData = readTagExp(xmlData, i, '>');

	          if (tagData) {
	            const openTagName = tagData && tagData.tagName;
	            if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length-1] !== "/") {
	              openTagCount++;
	            }
	            i=tagData.closeIndex;
	          }
	        }
	      }
	  }//end for loop
	}

	function parseValue(val, shouldParse, options) {
	  if (shouldParse && typeof val === 'string') {
	    //console.log(options)
	    const newval = val.trim();
	    if(newval === 'true' ) return true;
	    else if(newval === 'false' ) return false;
	    else return toNumber(val, options);
	  } else {
	    if (util.isExist(val)) {
	      return val;
	    } else {
	      return '';
	    }
	  }
	}


	OrderedObjParser_1 = OrderedObjParser;
	return OrderedObjParser_1;
}var node2json = {};var hasRequiredNode2json;

function requireNode2json () {
	if (hasRequiredNode2json) return node2json;
	hasRequiredNode2json = 1;

	/**
	 * 
	 * @param {array} node 
	 * @param {any} options 
	 * @returns 
	 */
	function prettify(node, options){
	  return compress( node, options);
	}

	/**
	 * 
	 * @param {array} arr 
	 * @param {object} options 
	 * @param {string} jPath 
	 * @returns object
	 */
	function compress(arr, options, jPath){
	  let text;
	  const compressedObj = {};
	  for (let i = 0; i < arr.length; i++) {
	    const tagObj = arr[i];
	    const property = propName(tagObj);
	    let newJpath = "";
	    if(jPath === undefined) newJpath = property;
	    else newJpath = jPath + "." + property;

	    if(property === options.textNodeName){
	      if(text === undefined) text = tagObj[property];
	      else text += "" + tagObj[property];
	    }else if(property === undefined){
	      continue;
	    }else if(tagObj[property]){
	      
	      let val = compress(tagObj[property], options, newJpath);
	      const isLeaf = isLeafTag(val, options);

	      if(tagObj[":@"]){
	        assignAttributes( val, tagObj[":@"], newJpath, options);
	      }else if(Object.keys(val).length === 1 && val[options.textNodeName] !== undefined && !options.alwaysCreateTextNode){
	        val = val[options.textNodeName];
	      }else if(Object.keys(val).length === 0){
	        if(options.alwaysCreateTextNode) val[options.textNodeName] = "";
	        else val = "";
	      }

	      if(compressedObj[property] !== undefined && compressedObj.hasOwnProperty(property)) {
	        if(!Array.isArray(compressedObj[property])) {
	            compressedObj[property] = [ compressedObj[property] ];
	        }
	        compressedObj[property].push(val);
	      }else {
	        //TODO: if a node is not an array, then check if it should be an array
	        //also determine if it is a leaf node
	        if (options.isArray(property, newJpath, isLeaf )) {
	          compressedObj[property] = [val];
	        }else {
	          compressedObj[property] = val;
	        }
	      }
	    }
	    
	  }
	  // if(text && text.length > 0) compressedObj[options.textNodeName] = text;
	  if(typeof text === "string"){
	    if(text.length > 0) compressedObj[options.textNodeName] = text;
	  }else if(text !== undefined) compressedObj[options.textNodeName] = text;
	  return compressedObj;
	}

	function propName(obj){
	  const keys = Object.keys(obj);
	  for (let i = 0; i < keys.length; i++) {
	    const key = keys[i];
	    if(key !== ":@") return key;
	  }
	}

	function assignAttributes(obj, attrMap, jpath, options){
	  if (attrMap) {
	    const keys = Object.keys(attrMap);
	    const len = keys.length; //don't make it inline
	    for (let i = 0; i < len; i++) {
	      const atrrName = keys[i];
	      if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
	        obj[atrrName] = [ attrMap[atrrName] ];
	      } else {
	        obj[atrrName] = attrMap[atrrName];
	      }
	    }
	  }
	}

	function isLeafTag(obj, options){
	  const { textNodeName } = options;
	  const propCount = Object.keys(obj).length;
	  
	  if (propCount === 0) {
	    return true;
	  }

	  if (
	    propCount === 1 &&
	    (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)
	  ) {
	    return true;
	  }

	  return false;
	}
	node2json.prettify = prettify;
	return node2json;
}var XMLParser_1;
var hasRequiredXMLParser;

function requireXMLParser () {
	if (hasRequiredXMLParser) return XMLParser_1;
	hasRequiredXMLParser = 1;
	const { buildOptions} = requireOptionsBuilder();
	const OrderedObjParser = requireOrderedObjParser();
	const { prettify} = requireNode2json();
	const validator = requireValidator();

	class XMLParser{
	    
	    constructor(options){
	        this.externalEntities = {};
	        this.options = buildOptions(options);
	        
	    }
	    /**
	     * Parse XML dats to JS object 
	     * @param {string|Buffer} xmlData 
	     * @param {boolean|Object} validationOption 
	     */
	    parse(xmlData,validationOption){
	        if(typeof xmlData === "string");else if( xmlData.toString){
	            xmlData = xmlData.toString();
	        }else {
	            throw new Error("XML data is accepted in String or Bytes[] form.")
	        }
	        if( validationOption){
	            if(validationOption === true) validationOption = {}; //validate with default options
	            
	            const result = validator.validate(xmlData, validationOption);
	            if (result !== true) {
	              throw Error( `${result.err.msg}:${result.err.line}:${result.err.col}` )
	            }
	          }
	        const orderedObjParser = new OrderedObjParser(this.options);
	        orderedObjParser.addExternalEntities(this.externalEntities);
	        const orderedResult = orderedObjParser.parseXml(xmlData);
	        if(this.options.preserveOrder || orderedResult === undefined) return orderedResult;
	        else return prettify(orderedResult, this.options);
	    }

	    /**
	     * Add Entity which is not by default supported by this library
	     * @param {string} key 
	     * @param {string} value 
	     */
	    addEntity(key, value){
	        if(value.indexOf("&") !== -1){
	            throw new Error("Entity value can't have '&'")
	        }else if(key.indexOf("&") !== -1 || key.indexOf(";") !== -1){
	            throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'")
	        }else if(value === "&"){
	            throw new Error("An entity with value '&' is not permitted");
	        }else {
	            this.externalEntities[key] = value;
	        }
	    }
	}

	XMLParser_1 = XMLParser;
	return XMLParser_1;
}var orderedJs2Xml;
var hasRequiredOrderedJs2Xml;

function requireOrderedJs2Xml () {
	if (hasRequiredOrderedJs2Xml) return orderedJs2Xml;
	hasRequiredOrderedJs2Xml = 1;
	const EOL = "\n";

	/**
	 * 
	 * @param {array} jArray 
	 * @param {any} options 
	 * @returns 
	 */
	function toXml(jArray, options) {
	    let indentation = "";
	    if (options.format && options.indentBy.length > 0) {
	        indentation = EOL;
	    }
	    return arrToStr(jArray, options, "", indentation);
	}

	function arrToStr(arr, options, jPath, indentation) {
	    let xmlStr = "";
	    let isPreviousElementTag = false;

	    for (let i = 0; i < arr.length; i++) {
	        const tagObj = arr[i];
	        const tagName = propName(tagObj);
	        if(tagName === undefined) continue;

	        let newJPath = "";
	        if (jPath.length === 0) newJPath = tagName;
	        else newJPath = `${jPath}.${tagName}`;

	        if (tagName === options.textNodeName) {
	            let tagText = tagObj[tagName];
	            if (!isStopNode(newJPath, options)) {
	                tagText = options.tagValueProcessor(tagName, tagText);
	                tagText = replaceEntitiesValue(tagText, options);
	            }
	            if (isPreviousElementTag) {
	                xmlStr += indentation;
	            }
	            xmlStr += tagText;
	            isPreviousElementTag = false;
	            continue;
	        } else if (tagName === options.cdataPropName) {
	            if (isPreviousElementTag) {
	                xmlStr += indentation;
	            }
	            xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
	            isPreviousElementTag = false;
	            continue;
	        } else if (tagName === options.commentPropName) {
	            xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
	            isPreviousElementTag = true;
	            continue;
	        } else if (tagName[0] === "?") {
	            const attStr = attr_to_str(tagObj[":@"], options);
	            const tempInd = tagName === "?xml" ? "" : indentation;
	            let piTextNodeName = tagObj[tagName][0][options.textNodeName];
	            piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : ""; //remove extra spacing
	            xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr}?>`;
	            isPreviousElementTag = true;
	            continue;
	        }
	        let newIdentation = indentation;
	        if (newIdentation !== "") {
	            newIdentation += options.indentBy;
	        }
	        const attStr = attr_to_str(tagObj[":@"], options);
	        const tagStart = indentation + `<${tagName}${attStr}`;
	        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
	        if (options.unpairedTags.indexOf(tagName) !== -1) {
	            if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
	            else xmlStr += tagStart + "/>";
	        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
	            xmlStr += tagStart + "/>";
	        } else if (tagValue && tagValue.endsWith(">")) {
	            xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
	        } else {
	            xmlStr += tagStart + ">";
	            if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
	                xmlStr += indentation + options.indentBy + tagValue + indentation;
	            } else {
	                xmlStr += tagValue;
	            }
	            xmlStr += `</${tagName}>`;
	        }
	        isPreviousElementTag = true;
	    }

	    return xmlStr;
	}

	function propName(obj) {
	    const keys = Object.keys(obj);
	    for (let i = 0; i < keys.length; i++) {
	        const key = keys[i];
	        if(!obj.hasOwnProperty(key)) continue;
	        if (key !== ":@") return key;
	    }
	}

	function attr_to_str(attrMap, options) {
	    let attrStr = "";
	    if (attrMap && !options.ignoreAttributes) {
	        for (let attr in attrMap) {
	            if(!attrMap.hasOwnProperty(attr)) continue;
	            let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
	            attrVal = replaceEntitiesValue(attrVal, options);
	            if (attrVal === true && options.suppressBooleanAttributes) {
	                attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
	            } else {
	                attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
	            }
	        }
	    }
	    return attrStr;
	}

	function isStopNode(jPath, options) {
	    jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
	    let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
	    for (let index in options.stopNodes) {
	        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
	    }
	    return false;
	}

	function replaceEntitiesValue(textValue, options) {
	    if (textValue && textValue.length > 0 && options.processEntities) {
	        for (let i = 0; i < options.entities.length; i++) {
	            const entity = options.entities[i];
	            textValue = textValue.replace(entity.regex, entity.val);
	        }
	    }
	    return textValue;
	}
	orderedJs2Xml = toXml;
	return orderedJs2Xml;
}var json2xml;
var hasRequiredJson2xml;

function requireJson2xml () {
	if (hasRequiredJson2xml) return json2xml;
	hasRequiredJson2xml = 1;
	//parse Empty Node as self closing node
	const buildFromOrderedJs = requireOrderedJs2Xml();

	const defaultOptions = {
	  attributeNamePrefix: '@_',
	  attributesGroupName: false,
	  textNodeName: '#text',
	  ignoreAttributes: true,
	  cdataPropName: false,
	  format: false,
	  indentBy: '  ',
	  suppressEmptyNode: false,
	  suppressUnpairedNode: true,
	  suppressBooleanAttributes: true,
	  tagValueProcessor: function(key, a) {
	    return a;
	  },
	  attributeValueProcessor: function(attrName, a) {
	    return a;
	  },
	  preserveOrder: false,
	  commentPropName: false,
	  unpairedTags: [],
	  entities: [
	    { regex: new RegExp("&", "g"), val: "&amp;" },//it must be on top
	    { regex: new RegExp(">", "g"), val: "&gt;" },
	    { regex: new RegExp("<", "g"), val: "&lt;" },
	    { regex: new RegExp("\'", "g"), val: "&apos;" },
	    { regex: new RegExp("\"", "g"), val: "&quot;" }
	  ],
	  processEntities: true,
	  stopNodes: [],
	  // transformTagName: false,
	  // transformAttributeName: false,
	  oneListGroup: false
	};

	function Builder(options) {
	  this.options = Object.assign({}, defaultOptions, options);
	  if (this.options.ignoreAttributes || this.options.attributesGroupName) {
	    this.isAttribute = function(/*a*/) {
	      return false;
	    };
	  } else {
	    this.attrPrefixLen = this.options.attributeNamePrefix.length;
	    this.isAttribute = isAttribute;
	  }

	  this.processTextOrObjNode = processTextOrObjNode;

	  if (this.options.format) {
	    this.indentate = indentate;
	    this.tagEndChar = '>\n';
	    this.newLine = '\n';
	  } else {
	    this.indentate = function() {
	      return '';
	    };
	    this.tagEndChar = '>';
	    this.newLine = '';
	  }
	}

	Builder.prototype.build = function(jObj) {
	  if(this.options.preserveOrder){
	    return buildFromOrderedJs(jObj, this.options);
	  }else {
	    if(Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1){
	      jObj = {
	        [this.options.arrayNodeName] : jObj
	      };
	    }
	    return this.j2x(jObj, 0).val;
	  }
	};

	Builder.prototype.j2x = function(jObj, level) {
	  let attrStr = '';
	  let val = '';
	  for (let key in jObj) {
	    if(!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
	    if (typeof jObj[key] === 'undefined') {
	      // supress undefined node only if it is not an attribute
	      if (this.isAttribute(key)) {
	        val += '';
	      }
	    } else if (jObj[key] === null) {
	      // null attribute should be ignored by the attribute list, but should not cause the tag closing
	      if (this.isAttribute(key)) {
	        val += '';
	      } else if (key[0] === '?') {
	        val += this.indentate(level) + '<' + key + '?' + this.tagEndChar;
	      } else {
	        val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
	      }
	      // val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
	    } else if (jObj[key] instanceof Date) {
	      val += this.buildTextValNode(jObj[key], key, '', level);
	    } else if (typeof jObj[key] !== 'object') {
	      //premitive type
	      const attr = this.isAttribute(key);
	      if (attr) {
	        attrStr += this.buildAttrPairStr(attr, '' + jObj[key]);
	      }else {
	        //tag value
	        if (key === this.options.textNodeName) {
	          let newval = this.options.tagValueProcessor(key, '' + jObj[key]);
	          val += this.replaceEntitiesValue(newval);
	        } else {
	          val += this.buildTextValNode(jObj[key], key, '', level);
	        }
	      }
	    } else if (Array.isArray(jObj[key])) {
	      //repeated nodes
	      const arrLen = jObj[key].length;
	      let listTagVal = "";
	      let listTagAttr = "";
	      for (let j = 0; j < arrLen; j++) {
	        const item = jObj[key][j];
	        if (typeof item === 'undefined') ; else if (item === null) {
	          if(key[0] === "?") val += this.indentate(level) + '<' + key + '?' + this.tagEndChar;
	          else val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
	          // val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
	        } else if (typeof item === 'object') {
	          if(this.options.oneListGroup){
	            const result = this.j2x(item, level + 1);
	            listTagVal += result.val;
	            if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
	              listTagAttr += result.attrStr;
	            }
	          }else {
	            listTagVal += this.processTextOrObjNode(item, key, level);
	          }
	        } else {
	          if (this.options.oneListGroup) {
	            let textValue = this.options.tagValueProcessor(key, item);
	            textValue = this.replaceEntitiesValue(textValue);
	            listTagVal += textValue;
	          } else {
	            listTagVal += this.buildTextValNode(item, key, '', level);
	          }
	        }
	      }
	      if(this.options.oneListGroup){
	        listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
	      }
	      val += listTagVal;
	    } else {
	      //nested node
	      if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
	        const Ks = Object.keys(jObj[key]);
	        const L = Ks.length;
	        for (let j = 0; j < L; j++) {
	          attrStr += this.buildAttrPairStr(Ks[j], '' + jObj[key][Ks[j]]);
	        }
	      } else {
	        val += this.processTextOrObjNode(jObj[key], key, level);
	      }
	    }
	  }
	  return {attrStr: attrStr, val: val};
	};

	Builder.prototype.buildAttrPairStr = function(attrName, val){
	  val = this.options.attributeValueProcessor(attrName, '' + val);
	  val = this.replaceEntitiesValue(val);
	  if (this.options.suppressBooleanAttributes && val === "true") {
	    return ' ' + attrName;
	  } else return ' ' + attrName + '="' + val + '"';
	};

	function processTextOrObjNode (object, key, level) {
	  const result = this.j2x(object, level + 1);
	  if (object[this.options.textNodeName] !== undefined && Object.keys(object).length === 1) {
	    return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
	  } else {
	    return this.buildObjectNode(result.val, key, result.attrStr, level);
	  }
	}

	Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
	  if(val === ""){
	    if(key[0] === "?") return  this.indentate(level) + '<' + key + attrStr+ '?' + this.tagEndChar;
	    else {
	      return this.indentate(level) + '<' + key + attrStr + this.closeTag(key) + this.tagEndChar;
	    }
	  }else {

	    let tagEndExp = '</' + key + this.tagEndChar;
	    let piClosingChar = "";
	    
	    if(key[0] === "?") {
	      piClosingChar = "?";
	      tagEndExp = "";
	    }
	  
	    // attrStr is an empty string in case the attribute came as undefined or null
	    if ((attrStr || attrStr === '') && val.indexOf('<') === -1) {
	      return ( this.indentate(level) + '<' +  key + attrStr + piClosingChar + '>' + val + tagEndExp );
	    } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
	      return this.indentate(level) + `<!--${val}-->` + this.newLine;
	    }else {
	      return (
	        this.indentate(level) + '<' + key + attrStr + piClosingChar + this.tagEndChar +
	        val +
	        this.indentate(level) + tagEndExp    );
	    }
	  }
	};

	Builder.prototype.closeTag = function(key){
	  let closeTag = "";
	  if(this.options.unpairedTags.indexOf(key) !== -1){ //unpaired
	    if(!this.options.suppressUnpairedNode) closeTag = "/";
	  }else if(this.options.suppressEmptyNode){ //empty
	    closeTag = "/";
	  }else {
	    closeTag = `></${key}`;
	  }
	  return closeTag;
	};

	Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
	  if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
	    return this.indentate(level) + `<![CDATA[${val}]]>` +  this.newLine;
	  }else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
	    return this.indentate(level) + `<!--${val}-->` +  this.newLine;
	  }else if(key[0] === "?") {//PI tag
	    return  this.indentate(level) + '<' + key + attrStr+ '?' + this.tagEndChar; 
	  }else {
	    let textValue = this.options.tagValueProcessor(key, val);
	    textValue = this.replaceEntitiesValue(textValue);
	  
	    if( textValue === ''){
	      return this.indentate(level) + '<' + key + attrStr + this.closeTag(key) + this.tagEndChar;
	    }else {
	      return this.indentate(level) + '<' + key + attrStr + '>' +
	         textValue +
	        '</' + key + this.tagEndChar;
	    }
	  }
	};

	Builder.prototype.replaceEntitiesValue = function(textValue){
	  if(textValue && textValue.length > 0 && this.options.processEntities){
	    for (let i=0; i<this.options.entities.length; i++) {
	      const entity = this.options.entities[i];
	      textValue = textValue.replace(entity.regex, entity.val);
	    }
	  }
	  return textValue;
	};

	function indentate(level) {
	  return this.options.indentBy.repeat(level);
	}

	function isAttribute(name /*, options*/) {
	  if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
	    return name.substr(this.attrPrefixLen);
	  } else {
	    return false;
	  }
	}

	json2xml = Builder;
	return json2xml;
}var fxp;
var hasRequiredFxp;

function requireFxp () {
	if (hasRequiredFxp) return fxp;
	hasRequiredFxp = 1;

	const validator = requireValidator();
	const XMLParser = requireXMLParser();
	const XMLBuilder = requireJson2xml();

	fxp = {
	  XMLParser: XMLParser,
	  XMLValidator: validator,
	  XMLBuilder: XMLBuilder
	};
	return fxp;
}var fxpExports = requireFxp();const parseXmlBody = (streamBody, context) => index.aC(streamBody, context).then((encoded) => {
    if (encoded.length) {
        const parser = new fxpExports.XMLParser({
            attributeNamePrefix: "",
            htmlEntities: true,
            ignoreAttributes: false,
            ignoreDeclaration: true,
            parseTagValue: false,
            trimValues: false,
            tagValueProcessor: (_, val) => (val.trim() === "" && val.includes("\n") ? "" : undefined),
        });
        parser.addEntity("#xD", "\r");
        parser.addEntity("#10", "\n");
        let parsedObj;
        try {
            parsedObj = parser.parse(encoded, true);
        }
        catch (e) {
            if (e && typeof e === "object") {
                Object.defineProperty(e, "$responseBodyText", {
                    value: encoded,
                });
            }
            throw e;
        }
        const textNodeName = "#text";
        const key = Object.keys(parsedObj)[0];
        const parsedObjToReturn = parsedObj[key];
        if (parsedObjToReturn[textNodeName]) {
            parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
            delete parsedObjToReturn[textNodeName];
        }
        return getValueFromTextNode(parsedObjToReturn);
    }
    return {};
});
const parseXmlErrorBody = async (errorBody, context) => {
    const value = await parseXmlBody(errorBody, context);
    if (value.Error) {
        value.Error.message = value.Error.message ?? value.Error.Message;
    }
    return value;
};const defaultSTSHttpAuthSchemeParametersProvider = async (config, context, input) => {
    return {
        operation: index.q(context).operation,
        region: (await index.r(config.region)()) ||
            (() => {
                throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
            })(),
    };
};
function createAwsAuthSigv4HttpAuthOption(authParameters) {
    return {
        schemeId: "aws.auth#sigv4",
        signingProperties: {
            name: "sts",
            region: authParameters.region,
        },
        propertiesExtractor: (config, context) => ({
            signingProperties: {
                config,
                context,
            },
        }),
    };
}
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
    return {
        schemeId: "smithy.api#noAuth",
    };
}
const defaultSTSHttpAuthSchemeProvider = (authParameters) => {
    const options = [];
    switch (authParameters.operation) {
        case "AssumeRoleWithSAML": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        case "AssumeRoleWithWebIdentity": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        default: {
            options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
        }
    }
    return options;
};
const resolveStsAuthConfig = (input) => ({
    ...input,
    stsClientCtor: STSClient,
});
const resolveHttpAuthSchemeConfig = (config) => {
    const config_0 = resolveStsAuthConfig(config);
    const config_1 = index.u(config_0);
    return {
        ...config_1,
    };
};const resolveClientEndpointParameters = (options) => {
    return {
        ...options,
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        useGlobalEndpoint: options.useGlobalEndpoint ?? false,
        defaultSigningName: "sts",
    };
};
const commonParams = {
    UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
};var name = "@aws-sdk/client-sts";
var description = "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native";
var version = "3.665.0";
var scripts = {
	build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
	"build:cjs": "node ../../scripts/compilation/inline client-sts",
	"build:es": "tsc -p tsconfig.es.json",
	"build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
	"build:types": "rimraf ./dist-types tsconfig.types.tsbuildinfo && tsc -p tsconfig.types.json",
	"build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
	clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
	"extract:docs": "api-extractor run --local",
	"generate:client": "node ../../scripts/generate-clients/single-service --solo sts",
	test: "yarn test:unit",
	"test:unit": "jest"
};
var main = "./dist-cjs/index.js";
var types = "./dist-types/index.d.ts";
var module$1 = "./dist-es/index.js";
var sideEffects = false;
var dependencies = {
	"@aws-crypto/sha256-browser": "5.2.0",
	"@aws-crypto/sha256-js": "5.2.0",
	"@aws-sdk/client-sso-oidc": "3.665.0",
	"@aws-sdk/core": "3.665.0",
	"@aws-sdk/credential-provider-node": "3.665.0",
	"@aws-sdk/middleware-host-header": "3.664.0",
	"@aws-sdk/middleware-logger": "3.664.0",
	"@aws-sdk/middleware-recursion-detection": "3.664.0",
	"@aws-sdk/middleware-user-agent": "3.664.0",
	"@aws-sdk/region-config-resolver": "3.664.0",
	"@aws-sdk/types": "3.664.0",
	"@aws-sdk/util-endpoints": "3.664.0",
	"@aws-sdk/util-user-agent-browser": "3.664.0",
	"@aws-sdk/util-user-agent-node": "3.664.0",
	"@smithy/config-resolver": "^3.0.9",
	"@smithy/core": "^2.4.7",
	"@smithy/fetch-http-handler": "^3.2.9",
	"@smithy/hash-node": "^3.0.7",
	"@smithy/invalid-dependency": "^3.0.7",
	"@smithy/middleware-content-length": "^3.0.9",
	"@smithy/middleware-endpoint": "^3.1.4",
	"@smithy/middleware-retry": "^3.0.22",
	"@smithy/middleware-serde": "^3.0.7",
	"@smithy/middleware-stack": "^3.0.7",
	"@smithy/node-config-provider": "^3.1.8",
	"@smithy/node-http-handler": "^3.2.4",
	"@smithy/protocol-http": "^4.1.4",
	"@smithy/smithy-client": "^3.3.6",
	"@smithy/types": "^3.5.0",
	"@smithy/url-parser": "^3.0.7",
	"@smithy/util-base64": "^3.0.0",
	"@smithy/util-body-length-browser": "^3.0.0",
	"@smithy/util-body-length-node": "^3.0.0",
	"@smithy/util-defaults-mode-browser": "^3.0.22",
	"@smithy/util-defaults-mode-node": "^3.0.22",
	"@smithy/util-endpoints": "^2.1.3",
	"@smithy/util-middleware": "^3.0.7",
	"@smithy/util-retry": "^3.0.7",
	"@smithy/util-utf8": "^3.0.0",
	tslib: "^2.6.2"
};
var devDependencies = {
	"@tsconfig/node16": "16.1.3",
	"@types/node": "^16.18.96",
	concurrently: "7.0.0",
	"downlevel-dts": "0.10.1",
	rimraf: "3.0.2",
	typescript: "~4.9.5"
};
var engines = {
	node: ">=16.0.0"
};
var typesVersions = {
	"<4.0": {
		"dist-types/*": [
			"dist-types/ts3.4/*"
		]
	}
};
var files = [
	"dist-*/**"
];
var author = {
	name: "AWS SDK for JavaScript Team",
	url: "https://aws.amazon.com/javascript/"
};
var license = "Apache-2.0";
var browser = {
	"./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
};
var homepage = "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts";
var repository = {
	type: "git",
	url: "https://github.com/aws/aws-sdk-js-v3.git",
	directory: "clients/client-sts"
};
var packageInfo = {
	name: name,
	description: description,
	version: version,
	scripts: scripts,
	main: main,
	types: types,
	module: module$1,
	sideEffects: sideEffects,
	dependencies: dependencies,
	devDependencies: devDependencies,
	engines: engines,
	typesVersions: typesVersions,
	files: files,
	author: author,
	license: license,
	browser: browser,
	"react-native": {
	"./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
},
	homepage: homepage,
	repository: repository
};const F = "required", G = "type", H = "fn", I = "argv", J = "ref";
const a = false, b = true, c = "booleanEquals", d = "stringEquals", e = "sigv4", f = "sts", g = "us-east-1", h = "endpoint", i = "https://sts.{Region}.{PartitionResult#dnsSuffix}", j = "tree", k = "error", l = "getAttr", m = { [F]: false, [G]: "String" }, n = { [F]: true, "default": false, [G]: "Boolean" }, o = { [J]: "Endpoint" }, p = { [H]: "isSet", [I]: [{ [J]: "Region" }] }, q = { [J]: "Region" }, r = { [H]: "aws.partition", [I]: [q], "assign": "PartitionResult" }, s = { [J]: "UseFIPS" }, t = { [J]: "UseDualStack" }, u = { "url": "https://sts.amazonaws.com", "properties": { "authSchemes": [{ "name": e, "signingName": f, "signingRegion": g }] }, "headers": {} }, v = {}, w = { "conditions": [{ [H]: d, [I]: [q, "aws-global"] }], [h]: u, [G]: h }, x = { [H]: c, [I]: [s, true] }, y = { [H]: c, [I]: [t, true] }, z = { [H]: l, [I]: [{ [J]: "PartitionResult" }, "supportsFIPS"] }, A = { [J]: "PartitionResult" }, B = { [H]: c, [I]: [true, { [H]: l, [I]: [A, "supportsDualStack"] }] }, C = [{ [H]: "isSet", [I]: [o] }], D = [x], E = [y];
const _data = { version: "1.0", parameters: { Region: m, UseDualStack: n, UseFIPS: n, Endpoint: m, UseGlobalEndpoint: n }, rules: [{ conditions: [{ [H]: c, [I]: [{ [J]: "UseGlobalEndpoint" }, b] }, { [H]: "not", [I]: C }, p, r, { [H]: c, [I]: [s, a] }, { [H]: c, [I]: [t, a] }], rules: [{ conditions: [{ [H]: d, [I]: [q, "ap-northeast-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "ap-south-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "ap-southeast-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "ap-southeast-2"] }], endpoint: u, [G]: h }, w, { conditions: [{ [H]: d, [I]: [q, "ca-central-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-central-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-north-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-west-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-west-2"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "eu-west-3"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "sa-east-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, g] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "us-east-2"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "us-west-1"] }], endpoint: u, [G]: h }, { conditions: [{ [H]: d, [I]: [q, "us-west-2"] }], endpoint: u, [G]: h }, { endpoint: { url: i, properties: { authSchemes: [{ name: e, signingName: f, signingRegion: "{Region}" }] }, headers: v }, [G]: h }], [G]: j }, { conditions: C, rules: [{ conditions: D, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [G]: k }, { conditions: E, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [G]: k }, { endpoint: { url: o, properties: v, headers: v }, [G]: h }], [G]: j }, { conditions: [p], rules: [{ conditions: [r], rules: [{ conditions: [x, y], rules: [{ conditions: [{ [H]: c, [I]: [b, z] }, B], rules: [{ endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: h }], [G]: j }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [G]: k }], [G]: j }, { conditions: D, rules: [{ conditions: [{ [H]: c, [I]: [z, b] }], rules: [{ conditions: [{ [H]: d, [I]: [{ [H]: l, [I]: [A, "name"] }, "aws-us-gov"] }], endpoint: { url: "https://sts.{Region}.amazonaws.com", properties: v, headers: v }, [G]: h }, { endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}", properties: v, headers: v }, [G]: h }], [G]: j }, { error: "FIPS is enabled but this partition does not support FIPS", [G]: k }], [G]: j }, { conditions: E, rules: [{ conditions: [B], rules: [{ endpoint: { url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: h }], [G]: j }, { error: "DualStack is enabled but this partition does not support DualStack", [G]: k }], [G]: j }, w, { endpoint: { url: i, properties: v, headers: v }, [G]: h }], [G]: j }], [G]: j }, { error: "Invalid Configuration: Missing Region", [G]: k }] };
const ruleSet = _data;const cache = new index.y({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"],
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
    return cache.get(endpointParams, () => index.v(ruleSet, {
        endpointParams: endpointParams,
        logger: context.logger,
    }));
};
index.w.aws = index.x;const getRuntimeConfig$1 = (config) => {
    return {
        apiVersion: "2011-06-15",
        base64Decoder: config?.base64Decoder ?? index.i,
        base64Encoder: config?.base64Encoder ?? index.t,
        disableHostPrefix: config?.disableHostPrefix ?? false,
        endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
        extensions: config?.extensions ?? [],
        httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSTSHttpAuthSchemeProvider,
        httpAuthSchemes: config?.httpAuthSchemes ?? [
            {
                schemeId: "aws.auth#sigv4",
                identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
                signer: new index.A(),
            },
            {
                schemeId: "smithy.api#noAuth",
                identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                signer: new noAuth.N(),
            },
        ],
        logger: config?.logger ?? new index.z(),
        serviceId: config?.serviceId ?? "STS",
        urlParser: config?.urlParser ?? index.n,
        utf8Decoder: config?.utf8Decoder ?? index.B,
        utf8Encoder: config?.utf8Encoder ?? index.k,
    };
};const getRuntimeConfig = (config) => {
    index.D(process.version);
    const defaultsMode = index.V(config);
    const defaultConfigProvider = () => defaultsMode().then(index.W);
    const clientSharedValues = getRuntimeConfig$1(config);
    index.F(process.version);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        bodyLengthChecker: config?.bodyLengthChecker ?? index.G,
        credentialDefaultProvider: config?.credentialDefaultProvider ?? index.I,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            index.J({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
        httpAuthSchemes: config?.httpAuthSchemes ?? [
            {
                schemeId: "aws.auth#sigv4",
                identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4") ||
                    (async (idProps) => await index.I(idProps?.__config || {})()),
                signer: new index.A(),
            },
            {
                schemeId: "smithy.api#noAuth",
                identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                signer: new noAuth.N(),
            },
        ],
        maxAttempts: config?.maxAttempts ?? index.o(index.K),
        region: config?.region ?? index.o(index.M, index.L),
        requestHandler: index.N.create(config?.requestHandler ?? defaultConfigProvider),
        retryMode: config?.retryMode ??
            index.o({
                ...index.O,
                default: async () => (await defaultConfigProvider()).retryMode || index.Q,
            }),
        sha256: config?.sha256 ?? index.R.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? index.s,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? index.o(index.S),
        useFipsEndpoint: config?.useFipsEndpoint ?? index.o(index.T),
        userAgentAppId: config?.userAgentAppId ?? index.o(index.U),
    };
};const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
    const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
    let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
    let _credentials = runtimeConfig.credentials;
    return {
        setHttpAuthScheme(httpAuthScheme) {
            const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
            if (index === -1) {
                _httpAuthSchemes.push(httpAuthScheme);
            }
            else {
                _httpAuthSchemes.splice(index, 1, httpAuthScheme);
            }
        },
        httpAuthSchemes() {
            return _httpAuthSchemes;
        },
        setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
            _httpAuthSchemeProvider = httpAuthSchemeProvider;
        },
        httpAuthSchemeProvider() {
            return _httpAuthSchemeProvider;
        },
        setCredentials(credentials) {
            _credentials = credentials;
        },
        credentials() {
            return _credentials;
        },
    };
};
const resolveHttpAuthRuntimeConfig = (config) => {
    return {
        httpAuthSchemes: config.httpAuthSchemes(),
        httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
        credentials: config.credentials(),
    };
};const asPartial = (t) => t;
const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
    const extensionConfiguration = {
        ...asPartial(index.a0(runtimeConfig)),
        ...asPartial(index.X(runtimeConfig)),
        ...asPartial(index.Y(runtimeConfig)),
        ...asPartial(getHttpAuthExtensionConfiguration(runtimeConfig)),
    };
    extensions.forEach((extension) => extension.configure(extensionConfiguration));
    return {
        ...runtimeConfig,
        ...index.Z(extensionConfiguration),
        ...index._(extensionConfiguration),
        ...index.$(extensionConfiguration),
        ...resolveHttpAuthRuntimeConfig(extensionConfiguration),
    };
};class STSClient extends index.a1 {
    constructor(...[configuration]) {
        const _config_0 = getRuntimeConfig(configuration || {});
        const _config_1 = resolveClientEndpointParameters(_config_0);
        const _config_2 = index.a2(_config_1);
        const _config_3 = index.a3(_config_2);
        const _config_4 = index.a4(_config_3);
        const _config_5 = index.af(_config_4);
        const _config_6 = index.a5(_config_5);
        const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
        const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
        super(_config_8);
        this.config = _config_8;
        this.middlewareStack.use(index.a6(this.config));
        this.middlewareStack.use(index.a7(this.config));
        this.middlewareStack.use(index.a8(this.config));
        this.middlewareStack.use(index.a9(this.config));
        this.middlewareStack.use(index.aa(this.config));
        this.middlewareStack.use(index.ab(this.config));
        this.middlewareStack.use(index.ac(this.config, {
            httpAuthSchemeParametersProvider: defaultSTSHttpAuthSchemeParametersProvider,
            identityProviderConfigProvider: async (config) => new index.ad({
                "aws.auth#sigv4": config.credentials,
            }),
        }));
        this.middlewareStack.use(index.ae(this.config));
    }
    destroy() {
        super.destroy();
    }
}class STSServiceException extends index.ag {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, STSServiceException.prototype);
    }
}class ExpiredTokenException extends STSServiceException {
    constructor(opts) {
        super({
            name: "ExpiredTokenException",
            $fault: "client",
            ...opts,
        });
        this.name = "ExpiredTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ExpiredTokenException.prototype);
    }
}
class MalformedPolicyDocumentException extends STSServiceException {
    constructor(opts) {
        super({
            name: "MalformedPolicyDocumentException",
            $fault: "client",
            ...opts,
        });
        this.name = "MalformedPolicyDocumentException";
        this.$fault = "client";
        Object.setPrototypeOf(this, MalformedPolicyDocumentException.prototype);
    }
}
class PackedPolicyTooLargeException extends STSServiceException {
    constructor(opts) {
        super({
            name: "PackedPolicyTooLargeException",
            $fault: "client",
            ...opts,
        });
        this.name = "PackedPolicyTooLargeException";
        this.$fault = "client";
        Object.setPrototypeOf(this, PackedPolicyTooLargeException.prototype);
    }
}
class RegionDisabledException extends STSServiceException {
    constructor(opts) {
        super({
            name: "RegionDisabledException",
            $fault: "client",
            ...opts,
        });
        this.name = "RegionDisabledException";
        this.$fault = "client";
        Object.setPrototypeOf(this, RegionDisabledException.prototype);
    }
}
class IDPRejectedClaimException extends STSServiceException {
    constructor(opts) {
        super({
            name: "IDPRejectedClaimException",
            $fault: "client",
            ...opts,
        });
        this.name = "IDPRejectedClaimException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPRejectedClaimException.prototype);
    }
}
class InvalidIdentityTokenException extends STSServiceException {
    constructor(opts) {
        super({
            name: "InvalidIdentityTokenException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidIdentityTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidIdentityTokenException.prototype);
    }
}
class IDPCommunicationErrorException extends STSServiceException {
    constructor(opts) {
        super({
            name: "IDPCommunicationErrorException",
            $fault: "client",
            ...opts,
        });
        this.name = "IDPCommunicationErrorException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPCommunicationErrorException.prototype);
    }
}
class InvalidAuthorizationMessageException extends STSServiceException {
    constructor(opts) {
        super({
            name: "InvalidAuthorizationMessageException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidAuthorizationMessageException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidAuthorizationMessageException.prototype);
    }
}
const CredentialsFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.SecretAccessKey && { SecretAccessKey: noAuth.S }),
});
const AssumeRoleResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Credentials && { Credentials: CredentialsFilterSensitiveLog(obj.Credentials) }),
});
const AssumeRoleWithWebIdentityRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.WebIdentityToken && { WebIdentityToken: noAuth.S }),
});
const AssumeRoleWithWebIdentityResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Credentials && { Credentials: CredentialsFilterSensitiveLog(obj.Credentials) }),
});const se_AssumeRoleCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_AssumeRoleRequest(input),
        [_A]: _AR,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const se_AssumeRoleWithWebIdentityCommand = async (input, context) => {
    const headers = SHARED_HEADERS;
    let body;
    body = buildFormUrlencodedString({
        ...se_AssumeRoleWithWebIdentityRequest(input),
        [_A]: _ARWWI,
        [_V]: _,
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
const de_AssumeRoleCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await parseXmlBody(output.body, context);
    let contents = {};
    contents = de_AssumeRoleResponse(data.AssumeRoleResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_AssumeRoleWithWebIdentityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const data = await parseXmlBody(output.body, context);
    let contents = {};
    contents = de_AssumeRoleWithWebIdentityResponse(data.AssumeRoleWithWebIdentityResult);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return response;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseXmlErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
            throw await de_ExpiredTokenExceptionRes(parsedOutput);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            throw await de_RegionDisabledExceptionRes(parsedOutput);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
            throw await de_IDPRejectedClaimExceptionRes(parsedOutput);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
            throw await de_InvalidIdentityTokenExceptionRes(parsedOutput);
        case "IDPCommunicationError":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
            throw await de_IDPCommunicationErrorExceptionRes(parsedOutput);
        case "InvalidAuthorizationMessageException":
        case "com.amazonaws.sts#InvalidAuthorizationMessageException":
            throw await de_InvalidAuthorizationMessageExceptionRes(parsedOutput);
        default:
            const parsedBody = parsedOutput.body;
            return throwDefaultError({
                output,
                parsedBody: parsedBody.Error,
                errorCode,
            });
    }
};
const de_ExpiredTokenExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_ExpiredTokenException(body.Error);
    const exception = new ExpiredTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return index.as(exception, body);
};
const de_IDPCommunicationErrorExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_IDPCommunicationErrorException(body.Error);
    const exception = new IDPCommunicationErrorException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return index.as(exception, body);
};
const de_IDPRejectedClaimExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_IDPRejectedClaimException(body.Error);
    const exception = new IDPRejectedClaimException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return index.as(exception, body);
};
const de_InvalidAuthorizationMessageExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidAuthorizationMessageException(body.Error);
    const exception = new InvalidAuthorizationMessageException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return index.as(exception, body);
};
const de_InvalidIdentityTokenExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidIdentityTokenException(body.Error);
    const exception = new InvalidIdentityTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return index.as(exception, body);
};
const de_MalformedPolicyDocumentExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_MalformedPolicyDocumentException(body.Error);
    const exception = new MalformedPolicyDocumentException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return index.as(exception, body);
};
const de_PackedPolicyTooLargeExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_PackedPolicyTooLargeException(body.Error);
    const exception = new PackedPolicyTooLargeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return index.as(exception, body);
};
const de_RegionDisabledExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_RegionDisabledException(body.Error);
    const exception = new RegionDisabledException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return index.as(exception, body);
};
const se_AssumeRoleRequest = (input, context) => {
    const entries = {};
    if (input[_RA] != null) {
        entries[_RA] = input[_RA];
    }
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_PA] != null) {
        const memberEntries = se_policyDescriptorListType(input[_PA]);
        if (input[_PA]?.length === 0) {
            entries.PolicyArns = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_P] != null) {
        entries[_P] = input[_P];
    }
    if (input[_DS] != null) {
        entries[_DS] = input[_DS];
    }
    if (input[_T] != null) {
        const memberEntries = se_tagListType(input[_T]);
        if (input[_T]?.length === 0) {
            entries.Tags = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Tags.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_TTK] != null) {
        const memberEntries = se_tagKeyListType(input[_TTK]);
        if (input[_TTK]?.length === 0) {
            entries.TransitiveTagKeys = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `TransitiveTagKeys.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_EI] != null) {
        entries[_EI] = input[_EI];
    }
    if (input[_SN] != null) {
        entries[_SN] = input[_SN];
    }
    if (input[_TC] != null) {
        entries[_TC] = input[_TC];
    }
    if (input[_SI] != null) {
        entries[_SI] = input[_SI];
    }
    if (input[_PC] != null) {
        const memberEntries = se_ProvidedContextsListType(input[_PC]);
        if (input[_PC]?.length === 0) {
            entries.ProvidedContexts = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `ProvidedContexts.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_AssumeRoleWithWebIdentityRequest = (input, context) => {
    const entries = {};
    if (input[_RA] != null) {
        entries[_RA] = input[_RA];
    }
    if (input[_RSN] != null) {
        entries[_RSN] = input[_RSN];
    }
    if (input[_WIT] != null) {
        entries[_WIT] = input[_WIT];
    }
    if (input[_PI] != null) {
        entries[_PI] = input[_PI];
    }
    if (input[_PA] != null) {
        const memberEntries = se_policyDescriptorListType(input[_PA]);
        if (input[_PA]?.length === 0) {
            entries.PolicyArns = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input[_P] != null) {
        entries[_P] = input[_P];
    }
    if (input[_DS] != null) {
        entries[_DS] = input[_DS];
    }
    return entries;
};
const se_policyDescriptorListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_PolicyDescriptorType(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_PolicyDescriptorType = (input, context) => {
    const entries = {};
    if (input[_a] != null) {
        entries[_a] = input[_a];
    }
    return entries;
};
const se_ProvidedContext = (input, context) => {
    const entries = {};
    if (input[_PAro] != null) {
        entries[_PAro] = input[_PAro];
    }
    if (input[_CA] != null) {
        entries[_CA] = input[_CA];
    }
    return entries;
};
const se_ProvidedContextsListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_ProvidedContext(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_Tag = (input, context) => {
    const entries = {};
    if (input[_K] != null) {
        entries[_K] = input[_K];
    }
    if (input[_Va] != null) {
        entries[_Va] = input[_Va];
    }
    return entries;
};
const se_tagKeyListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_tagListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_Tag(entry);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const de_AssumedRoleUser = (output, context) => {
    const contents = {};
    if (output[_ARI] != null) {
        contents[_ARI] = index.an(output[_ARI]);
    }
    if (output[_Ar] != null) {
        contents[_Ar] = index.an(output[_Ar]);
    }
    return contents;
};
const de_AssumeRoleResponse = (output, context) => {
    const contents = {};
    if (output[_C] != null) {
        contents[_C] = de_Credentials(output[_C]);
    }
    if (output[_ARU] != null) {
        contents[_ARU] = de_AssumedRoleUser(output[_ARU]);
    }
    if (output[_PPS] != null) {
        contents[_PPS] = index.aD(output[_PPS]);
    }
    if (output[_SI] != null) {
        contents[_SI] = index.an(output[_SI]);
    }
    return contents;
};
const de_AssumeRoleWithWebIdentityResponse = (output, context) => {
    const contents = {};
    if (output[_C] != null) {
        contents[_C] = de_Credentials(output[_C]);
    }
    if (output[_SFWIT] != null) {
        contents[_SFWIT] = index.an(output[_SFWIT]);
    }
    if (output[_ARU] != null) {
        contents[_ARU] = de_AssumedRoleUser(output[_ARU]);
    }
    if (output[_PPS] != null) {
        contents[_PPS] = index.aD(output[_PPS]);
    }
    if (output[_Pr] != null) {
        contents[_Pr] = index.an(output[_Pr]);
    }
    if (output[_Au] != null) {
        contents[_Au] = index.an(output[_Au]);
    }
    if (output[_SI] != null) {
        contents[_SI] = index.an(output[_SI]);
    }
    return contents;
};
const de_Credentials = (output, context) => {
    const contents = {};
    if (output[_AKI] != null) {
        contents[_AKI] = index.an(output[_AKI]);
    }
    if (output[_SAK] != null) {
        contents[_SAK] = index.an(output[_SAK]);
    }
    if (output[_STe] != null) {
        contents[_STe] = index.an(output[_STe]);
    }
    if (output[_E] != null) {
        contents[_E] = index.ak(index.aE(output[_E]));
    }
    return contents;
};
const de_ExpiredTokenException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = index.an(output[_m]);
    }
    return contents;
};
const de_IDPCommunicationErrorException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = index.an(output[_m]);
    }
    return contents;
};
const de_IDPRejectedClaimException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = index.an(output[_m]);
    }
    return contents;
};
const de_InvalidAuthorizationMessageException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = index.an(output[_m]);
    }
    return contents;
};
const de_InvalidIdentityTokenException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = index.an(output[_m]);
    }
    return contents;
};
const de_MalformedPolicyDocumentException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = index.an(output[_m]);
    }
    return contents;
};
const de_PackedPolicyTooLargeException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = index.an(output[_m]);
    }
    return contents;
};
const de_RegionDisabledException = (output, context) => {
    const contents = {};
    if (output[_m] != null) {
        contents[_m] = index.an(output[_m]);
    }
    return contents;
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const throwDefaultError = index.ar(STSServiceException);
const buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const contents = {
        protocol,
        hostname,
        port,
        method: "POST",
        path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
        headers,
    };
    if (body !== undefined) {
        contents.body = body;
    }
    return new index.H(contents);
};
const SHARED_HEADERS = {
    "content-type": "application/x-www-form-urlencoded",
};
const _ = "2011-06-15";
const _A = "Action";
const _AKI = "AccessKeyId";
const _AR = "AssumeRole";
const _ARI = "AssumedRoleId";
const _ARU = "AssumedRoleUser";
const _ARWWI = "AssumeRoleWithWebIdentity";
const _Ar = "Arn";
const _Au = "Audience";
const _C = "Credentials";
const _CA = "ContextAssertion";
const _DS = "DurationSeconds";
const _E = "Expiration";
const _EI = "ExternalId";
const _K = "Key";
const _P = "Policy";
const _PA = "PolicyArns";
const _PAro = "ProviderArn";
const _PC = "ProvidedContexts";
const _PI = "ProviderId";
const _PPS = "PackedPolicySize";
const _Pr = "Provider";
const _RA = "RoleArn";
const _RSN = "RoleSessionName";
const _SAK = "SecretAccessKey";
const _SFWIT = "SubjectFromWebIdentityToken";
const _SI = "SourceIdentity";
const _SN = "SerialNumber";
const _STe = "SessionToken";
const _T = "Tags";
const _TC = "TokenCode";
const _TTK = "TransitiveTagKeys";
const _V = "Version";
const _Va = "Value";
const _WIT = "WebIdentityToken";
const _a = "arn";
const _m = "message";
const buildFormUrlencodedString = (formEntries) => Object.entries(formEntries)
    .map(([key, value]) => noAuth.e(key) + "=" + noAuth.e(value))
    .join("&");
const loadQueryErrorCode = (output, data) => {
    if (data.Error?.Code !== undefined) {
        return data.Error.Code;
    }
    if (output.statusCode == 404) {
        return "NotFound";
    }
};class AssumeRoleCommand extends index.at
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        index.au(config, this.serialize, this.deserialize),
        index.av(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("AWSSecurityTokenServiceV20110615", "AssumeRole", {})
    .n("STSClient", "AssumeRoleCommand")
    .f(void 0, AssumeRoleResponseFilterSensitiveLog)
    .ser(se_AssumeRoleCommand)
    .de(de_AssumeRoleCommand)
    .build() {
}class AssumeRoleWithWebIdentityCommand extends index.at
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        index.au(config, this.serialize, this.deserialize),
        index.av(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {})
    .n("STSClient", "AssumeRoleWithWebIdentityCommand")
    .f(AssumeRoleWithWebIdentityRequestFilterSensitiveLog, AssumeRoleWithWebIdentityResponseFilterSensitiveLog)
    .ser(se_AssumeRoleWithWebIdentityCommand)
    .de(de_AssumeRoleWithWebIdentityCommand)
    .build() {
}const ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
const getAccountIdFromAssumedRoleUser = (assumedRoleUser) => {
    if (typeof assumedRoleUser?.Arn === "string") {
        const arnComponents = assumedRoleUser.Arn.split(":");
        if (arnComponents.length > 4 && arnComponents[4] !== "") {
            return arnComponents[4];
        }
    }
    return undefined;
};
const resolveRegion = async (_region, _parentRegion, credentialProviderLogger) => {
    const region = typeof _region === "function" ? await _region() : _region;
    const parentRegion = typeof _parentRegion === "function" ? await _parentRegion() : _parentRegion;
    credentialProviderLogger?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${region} (provider)`, `${parentRegion} (parent client)`, `${ASSUME_ROLE_DEFAULT_REGION} (STS default)`);
    return region ?? parentRegion ?? ASSUME_ROLE_DEFAULT_REGION;
};
const getDefaultRoleAssumer$1 = (stsOptions, stsClientCtor) => {
    let stsClient;
    let closureSourceCreds;
    return async (sourceCreds, params) => {
        closureSourceCreds = sourceCreds;
        if (!stsClient) {
            const { logger = stsOptions?.parentClientConfig?.logger, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, } = stsOptions;
            const resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger);
            const isCompatibleRequestHandler = !isH2(requestHandler);
            stsClient = new stsClientCtor({
                credentialDefaultProvider: () => async () => closureSourceCreds,
                region: resolvedRegion,
                requestHandler: isCompatibleRequestHandler ? requestHandler : undefined,
                logger: logger,
            });
        }
        const { Credentials, AssumedRoleUser } = await stsClient.send(new AssumeRoleCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
            throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
        }
        const accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser);
        return {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            expiration: Credentials.Expiration,
            ...(Credentials.CredentialScope && { credentialScope: Credentials.CredentialScope }),
            ...(accountId && { accountId }),
        };
    };
};
const getDefaultRoleAssumerWithWebIdentity$1 = (stsOptions, stsClientCtor) => {
    let stsClient;
    return async (params) => {
        if (!stsClient) {
            const { logger = stsOptions?.parentClientConfig?.logger, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, } = stsOptions;
            const resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger);
            const isCompatibleRequestHandler = !isH2(requestHandler);
            stsClient = new stsClientCtor({
                region: resolvedRegion,
                requestHandler: isCompatibleRequestHandler ? requestHandler : undefined,
                logger: logger,
            });
        }
        const { Credentials, AssumedRoleUser } = await stsClient.send(new AssumeRoleWithWebIdentityCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
            throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
        }
        const accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser);
        return {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            expiration: Credentials.Expiration,
            ...(Credentials.CredentialScope && { credentialScope: Credentials.CredentialScope }),
            ...(accountId && { accountId }),
        };
    };
};
const isH2 = (requestHandler) => {
    return requestHandler?.metadata?.handlerProtocol === "h2";
};const getCustomizableStsClientCtor = (baseCtor, customizations) => {
    if (!customizations)
        return baseCtor;
    else
        return class CustomizableSTSClient extends baseCtor {
            constructor(config) {
                super(config);
                for (const customization of customizations) {
                    this.middlewareStack.use(customization);
                }
            }
        };
};
const getDefaultRoleAssumer = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumer$1(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));
const getDefaultRoleAssumerWithWebIdentity = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumerWithWebIdentity$1(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));exports.$Command=index.at;exports.__Client=index.a1;exports.AssumeRoleCommand=AssumeRoleCommand;exports.AssumeRoleResponseFilterSensitiveLog=AssumeRoleResponseFilterSensitiveLog;exports.AssumeRoleWithWebIdentityCommand=AssumeRoleWithWebIdentityCommand;exports.AssumeRoleWithWebIdentityRequestFilterSensitiveLog=AssumeRoleWithWebIdentityRequestFilterSensitiveLog;exports.AssumeRoleWithWebIdentityResponseFilterSensitiveLog=AssumeRoleWithWebIdentityResponseFilterSensitiveLog;exports.CredentialsFilterSensitiveLog=CredentialsFilterSensitiveLog;exports.ExpiredTokenException=ExpiredTokenException;exports.IDPCommunicationErrorException=IDPCommunicationErrorException;exports.IDPRejectedClaimException=IDPRejectedClaimException;exports.InvalidAuthorizationMessageException=InvalidAuthorizationMessageException;exports.InvalidIdentityTokenException=InvalidIdentityTokenException;exports.MalformedPolicyDocumentException=MalformedPolicyDocumentException;exports.PackedPolicyTooLargeException=PackedPolicyTooLargeException;exports.RegionDisabledException=RegionDisabledException;exports.STSClient=STSClient;exports.STSServiceException=STSServiceException;exports.getDefaultRoleAssumer=getDefaultRoleAssumer;exports.getDefaultRoleAssumerWithWebIdentity=getDefaultRoleAssumerWithWebIdentity;