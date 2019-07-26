/***
 * WebId v2.0.0-rc.1 (https://github.com/sh0ji/web-id#readme)
 * Built for the browser (UMD)
 * Copyright 2017-2019 Evan Yamanishi
 * Licensed under MIT
 ***/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.WebId = factory());
}(this, function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  // Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

  var seed = 1;
  /**
   * return a random number based on a seed
   * @param seed
   * @returns {number}
   */

  function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
  }

  function setSeed(_seed_) {
    seed = _seed_;
  }

  var randomFromSeed = {
    nextValue: getNextValue,
    seed: setSeed
  };

  var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
  var alphabet;
  var previousSeed;
  var shuffled;

  function reset() {
    shuffled = false;
  }

  function setCharacters(_alphabet_) {
    if (!_alphabet_) {
      if (alphabet !== ORIGINAL) {
        alphabet = ORIGINAL;
        reset();
      }

      return;
    }

    if (_alphabet_ === alphabet) {
      return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
      throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function (item, ind, arr) {
      return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
      throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
  }

  function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
  }

  function setSeed$1(seed) {
    randomFromSeed.seed(seed);

    if (previousSeed !== seed) {
      reset();
      previousSeed = seed;
    }
  }

  function shuffle() {
    if (!alphabet) {
      setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
      r = randomFromSeed.nextValue();
      characterIndex = Math.floor(r * sourceArray.length);
      targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }

    return targetArray.join('');
  }

  function getShuffled() {
    if (shuffled) {
      return shuffled;
    }

    shuffled = shuffle();
    return shuffled;
  }
  /**
   * lookup shuffled letter
   * @param index
   * @returns {string}
   */


  function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
  }

  function get() {
    return alphabet || ORIGINAL;
  }

  var alphabet_1 = {
    get: get,
    characters: characters,
    seed: setSeed$1,
    lookup: lookup,
    shuffled: getShuffled
  };

  var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};



  var random = /*#__PURE__*/Object.freeze({

  });

  var randomByte = random;

  /**
   * Secure random string generator with custom alphabet.
   *
   * Alphabet must contain 256 symbols or less. Otherwise, the generator
   * will not be secure.
   *
   * @param {generator} random The random bytes generator.
   * @param {string} alphabet Symbols to be used in new random string.
   * @param {size} size The number of symbols in new random string.
   *
   * @return {string} Random string.
   *
   * @example
   * const format = require('nanoid/format')
   *
   * function random (size) {
   *   const result = []
   *   for (let i = 0; i < size; i++) {
   *     result.push(randomByte())
   *   }
   *   return result
   * }
   *
   * format(random, "abcdef", 5) //=> "fbaef"
   *
   * @name format
   * @function
   */
  var format = function (random, alphabet, size) {
    var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
    var step = Math.ceil(1.6 * mask * size / alphabet.length);
    size = +size;
    var id = '';

    while (true) {
      var bytes = random(step);

      for (var i = 0; i < step; i++) {
        var byte = bytes[i] & mask;

        if (alphabet[byte]) {
          id += alphabet[byte];
          if (id.length === size) return id;
        }
      }
    }
  };

  function generate(number) {
    var loopCounter = 0;
    var done;
    var str = '';

    while (!done) {
      str = str + format(randomByte, alphabet_1.get(), 1);
      done = number < Math.pow(16, loopCounter + 1);
      loopCounter++;
    }

    return str;
  }

  var generate_1 = generate;

  // This number should be updated every year or so to keep the generated id short.
  // To regenerate `new Date() - 0` and bump the version. Always bump the version!


  var REDUCE_TIME = 1459707606518; // don't change unless we change the algos or REDUCE_TIME
  // must be an integer and less than 16

  var version = 6; // Counter is used when shortid is called multiple times in one second.

  var counter; // Remember the last time shortid was called in case counter is needed.

  var previousSeconds;
  /**
   * Generate unique id
   * Returns string id
   */

  function build(clusterWorkerId) {
    var str = '';
    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
      counter++;
    } else {
      counter = 0;
      previousSeconds = seconds;
    }

    str = str + generate_1(version);
    str = str + generate_1(clusterWorkerId);

    if (counter > 0) {
      str = str + generate_1(counter);
    }

    str = str + generate_1(seconds);
    return str;
  }

  var build_1 = build;

  function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6) {
      return false;
    }

    var nonAlphabetic = new RegExp('[^' + alphabet_1.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') + ']');
    return !nonAlphabetic.test(id);
  }

  var isValid = isShortId;

  if (typeof global$1.setTimeout === 'function') ;

  if (typeof global$1.clearTimeout === 'function') ;

  var performance = global$1.performance || {};

  var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
    return new Date().getTime();
  }; // generate timestamp or delta

  var cluster = require('cluster');

  var clusterId = 0;

  if (!cluster.isMaster && cluster.worker) {
    clusterId = cluster.worker.id;
  }

  module.exports = parseInt( clusterId, 10);

  var clusterWorkerId = /*#__PURE__*/Object.freeze({

  });

  var lib = createCommonjsModule(function (module) {
    // has a unique value for worker
    // Note: I don't know if this is automatically set when using third
    // party cluster solutions such as pm2.

    var clusterWorkerId$1 = clusterWorkerId || 0;
    /**
     * Set the seed.
     * Highly recommended if you don't want people to try to figure out your id schema.
     * exposed as shortid.seed(int)
     * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
     */

    function seed(seedValue) {
      alphabet_1.seed(seedValue);
      return module.exports;
    }
    /**
     * Set the cluster worker or machine id
     * exposed as shortid.worker(int)
     * @param workerId worker must be positive integer.  Number less than 16 is recommended.
     * returns shortid module so it can be chained.
     */


    function worker(workerId) {
      clusterWorkerId$1 = workerId;
      return module.exports;
    }
    /**
     *
     * sets new characters to use in the alphabet
     * returns the shuffled alphabet
     */


    function characters(newCharacters) {
      if (newCharacters !== undefined) {
        alphabet_1.characters(newCharacters);
      }

      return alphabet_1.shuffled();
    }
    /**
     * Generate unique id
     * Returns string id
     */


    function generate() {
      return build_1(clusterWorkerId$1);
    } // Export all other functions as properties of the generate function


    module.exports = generate;
    module.exports.generate = generate;
    module.exports.seed = seed;
    module.exports.worker = worker;
    module.exports.characters = characters;
    module.exports.isValid = isValid;
  });
  var lib_1 = lib.generate;
  var lib_2 = lib.seed;
  var lib_3 = lib.worker;
  var lib_4 = lib.characters;
  var lib_5 = lib.isValid;

  var shortid = lib;

  var slugify = createCommonjsModule(function (module, exports) {

    (function (name, root, factory) {
      {
        module.exports = factory();
        module.exports['default'] = factory();
      }
    })('slugify', commonjsGlobal, function () {
      /* eslint-disable */
      var charMap = JSON.parse('{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","џ":"dz","Ґ":"G","ґ":"g","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₹":"indian rupee","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial"}');
      /* eslint-enable */

      function replace(string, options) {
        if (typeof string !== 'string') {
          throw new Error('slugify: string argument expected');
        }

        options = typeof options === 'string' ? {
          replacement: options
        } : options || {};
        var slug = string.split('').reduce(function (result, ch) {
          return result + (charMap[ch] || ch). // allowed
          replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]/g, '');
        }, '') // trim leading/trailing spaces
        .trim() // convert spaces
        .replace(/[-\s]+/g, options.replacement || '-');
        return options.lower ? slug.toLowerCase() : slug;
      }

      replace.extend = function (customMap) {
        for (var key in customMap) {
          charMap[key] = customMap[key];
        }
      };

      return replace;
    });
  });

  const getCharacters = delimiter => {
    const standard = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
    const replacement = '~';
    return standard.replace(delimiter, replacement);
  };
  const DefaultOptions = {
    delimiter: '-',
    lower: true,
    maxLength: 128,
    remove: null,
    strict: true
  };
  const Private = {
    delimiter: new WeakMap(),
    prefix: new WeakMap(),
    suffix: new WeakMap()
  };
  const Errors = {
    TYPE_IS_STRING: str => ({
      assertion: typeof str === 'string',
      error: new TypeError("Expected a string. Received ".concat(typeof str, "."))
    }),
    STRICT_DELIMITER: value => ({
      assertion: /^[\w-._~]*$/.test(value),
      error: new Error("".concat(value, " is not a safe delimiter."))
    }),
    NON_STRICT_DELIMITER: value => ({
      assertion: /^\S*$/g.test(value),
      error: new Error('The delimiter cannot be a space.')
    }),
    VALID_PREFIX: value => ({
      assertion: /^[a-z]+/i.test(value),
      error: new Error('prefix must begin with a letter (a-z).')
    })
  };
  const Assertions = (() => {
    const obj = {};
    Object.keys(Errors).forEach(a => {
      obj[a] = v => {
        const err = Errors[a](v);

        if (!err.assertion) {
          throw err.error;
        }
      };
    });
    return obj;
  })();

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  class WebId {
    constructor(opts = {}) {
      this.configure(opts);
    }

    get delimiter() {
      return Private.delimiter.get(this);
    }

    set delimiter(value) {
      if (this.options.strict) {
        Assertions.STRICT_DELIMITER(value);
      } else {
        Assertions.NON_STRICT_DELIMITER(value);
      }

      Private.delimiter.set(this, value);
    }

    get prefix() {
      return Private.prefix.get(this);
    }

    set prefix(value) {
      if (!value) {
        Private.prefix.set(this, '');
        return;
      }

      Assertions.TYPE_IS_STRING(value);
      if (this.options.strict) Assertions.VALID_PREFIX(value);
      let prefix = this.createSlug(value.trim(), null);

      if (prefix && !prefix.endsWith(this.delimiter)) {
        prefix += this.delimiter;
      }

      Private.prefix.set(this, prefix);
    }

    get suffix() {
      return Private.suffix.get(this);
    }

    set suffix(value) {
      if (!value) {
        Private.suffix.set(this, '');
        return;
      }

      Assertions.TYPE_IS_STRING(value);
      let suffix = this.createSlug(value.trim(), null);

      if (suffix && !suffix.startsWith(this.delimiter)) {
        suffix = this.delimiter + suffix;
      }

      Private.suffix.set(this, suffix);
    }

    slugifyOpts(replacement) {
      return {
        replacement,
        remove: this.options.remove,
        lower: this.options.lower
      };
    }

    createSlug(str, delim = this.delimiter) {
      const slug = str ? slugify(str, this.slugifyOpts(delim)) : '';

      if (this.options.strict) {
        /** enable strict mode (html 4 / xhtml) */
        return slug
        /** allowed characters: a-z, A-Z, 0-9, _, :, ., - */
        .replace(/[^\w_:.-]/ig, this.delimiter)
        /** must start with letter */
        .replace(/^[^a-z]+/, '');
      }

      return slug;
    }

    configure(opts = {}) {
      this.options = _objectSpread({}, DefaultOptions, {}, opts);
      this.delimiter = this.options.delim || this.options.delimiter;
      this.prefix = this.options.pre || this.options.prefix;
      this.suffix = this.options.suf || this.options.suffix;
    }

    parse(_str, _options) {
      const str = typeof _str === 'string' ? _str : '';
      const options = typeof _str === 'object' ? _str : _options;
      if (options) this.configure(options);
      const slug = this.createSlug(str);
      shortid.characters(getCharacters(this.delimiter));
      const shortid$1 = shortid.generate();
      const maxLength = this.options.maxLength - this.prefix.length - this.suffix.length;
      const uniqueSlug = slug ? [slug.substr(0, maxLength - shortid$1.length), shortid$1].join(this.delimiter) : shortid$1;
      return {
        id: this.prefix + (slug.substr(0, maxLength) || shortid$1) + this.suffix,
        unique: this.prefix + uniqueSlug + this.suffix,
        original: str,
        slug,
        shortid: shortid$1,
        delimiter: this.delimiter,
        prefix: this.prefix,
        suffix: this.suffix
      };
    }

    generate(str, options) {
      return this.parse(str, options).id;
    }

    generateUnique(str, options) {
      return this.parse(str, options).unique;
    }

  }

  return WebId;

}));
//# sourceMappingURL=webid.umd.js.map
