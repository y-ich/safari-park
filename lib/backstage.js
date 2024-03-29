
/*
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
*/

(function() {
  var base, baseOf, defaultCMOptions, dependencies, fileOf, get, layout, loadBackstage, loadCSS, loadCodeMirror, loadScript, overwrite, preventPageScroll, ready, setBackstage, site, sourceTargets, typeOf,
    __hasProp = Object.prototype.hasOwnProperty,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  site = 'http://y-ich.github.com/safari-park';

  dependencies = {};

  defaultCMOptions = {
    lineNumbers: true,
    lineWrapping: false,
    readOnly: 'nocursor'
  };

  typeOf = function(url) {
    if (!/\./.test(url)) return 'html';
    switch (url.replace(/^.*\./, '').replace(/\?.*/, '')) {
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'coffee':
        return 'coffeescript';
      default:
        return 'html';
    }
  };

  baseOf = function(url) {
    return url.replace(/\/[^\/]*$/, '');
  };

  base = baseOf(window.location.href);

  fileOf = function(url) {
    return url.replace(/^.*\//, '');
  };

  get = function(url, type, callback) {
    var req;
    req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', type);
    req.onreadystatechange = function() {
      var _ref;
      if (req.readyState === 4) {
        if ((200 <= (_ref = req.status) && _ref < 300)) {
          return callback(req.responseText);
        } else {
          return console.log('get error: ' + req.status);
        }
      }
    };
    return req.send();
  };

  overwrite = function(obj1, obj2) {
    var key, keys, obj, value, _i, _len, _ref;
    obj = {};
    keys = (function() {
      var _results;
      _results = [];
      for (key in obj1) {
        if (!__hasProp.call(obj1, key)) continue;
        value = obj1[key];
        _results.push(key);
      }
      return _results;
    })();
    for (key in obj2) {
      if (!__hasProp.call(obj2, key)) continue;
      value = obj2[key];
      if (__indexOf.call(obj1, key) < 0) keys.push(key);
    }
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      obj[key] = (_ref = obj2[key]) != null ? _ref : obj1[key];
    }
    return obj;
  };

  loadCSS = function(url, callback) {
    var count, css, interval;
    css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = url + '?time=' + (new Date).valueOf();
    document.head.appendChild(css);
    count = 50;
    return interval = setInterval(function() {
      var i, sheets, _ref, _results;
      if (--count <= 0) {
        clearInterval(interval);
        callback();
        return;
      }
      sheets = document.styleSheets;
      _results = [];
      for (i = 0, _ref = sheets.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        if (sheets[i].href === css.href) {
          clearInterval(interval);
          callback();
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }, 100);
  };

  loadScript = function(url, callback) {
    var script;
    script = document.createElement('script');
    script.onload = callback;
    script.src = url + '?time=' + (new Date).valueOf();
    return document.head.appendChild(script);
  };

  setBackstage = function() {
    return window.Backstage = {
      editors: [],
      "switch": function(index) {
        var div, e, file, i, tabs, type, _i, _len, _ref, _ref2;
        tabs = document.getElementById('backstage-tabs').children;
        for (i = 0, _ref = tabs.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          tabs[i].className = '';
        }
        tabs[index].className = 'none';
        _ref2 = this.editors;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          e = _ref2[_i];
          if (e != null) e.getWrapperElement().style.display = 'none';
        }
        if (this.editors[index] != null) {
          return this.editors[index].getWrapperElement().style.display = 'block';
        } else {
          div = document.createElement('div');
          div.id = 'backstage-editor-' + index;
          div.className = 'backstage-editor';
          document.getElementById('backstage-editors').appendChild(div);
          file = tabs[index].children[0].dataset.src;
          type = typeOf(file);
          this.editors[index] = CodeMirror(div, overwrite(defaultCMOptions, {
            mode: type === 'html' ? 'xml' : type
          }));
          preventPageScroll(this.editors[index]);
          return get(file, "text/" + type, (function(cm) {
            return function(result) {
              return cm.setValue(result);
            };
          })(this.editors[index]));
        }
      },
      toggle: function() {
        return document.body.className = /opened/.test(document.body.className) ? document.body.className.replace(' opened', '') : document.body.className + ' opened';
      }
    };
  };

  loadCodeMirror = function() {
    dependencies.cmcss = false;
    loadCSS("" + site + "/lib/codemirror.css", function() {
      dependencies.cmcss = true;
      return ready();
    });
    dependencies.cmscript = false;
    return loadScript("" + site + "/lib/codemirror.min.js", function() {
      dependencies.cmscript = true;
      return ready();
    });
  };

  loadBackstage = function() {
    dependencies.bscss = false;
    return loadCSS("" + site + "/lib/backstage.css", function() {
      dependencies.bscss = true;
      return ready();
    });
  };

  sourceTargets = function() {
    var i, list, result, url, _ref, _ref2, _ref3;
    result = [window.location.href.replace(/^.*\//, '')];
    list = document.getElementsByTagName('script');
    for (i = 0, _ref = list.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      url = (_ref2 = list[i].dataset.source) != null ? _ref2 : list[i].src;
      if (url === '') continue;
      if (!/\//.test(url) || baseOf(url) === base) result.push(fileOf(url));
    }
    list = document.getElementsByTagName('link');
    for (i = 0, _ref3 = list.length; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      if (list[i].rel === 'stylesheet' && (!/\//.test(list[i].href) || baseOf(list[i].href) === base)) {
        result.push(fileOf(list[i].href));
      }
    }
    return result;
  };

  preventPageScroll = function(codemirror) {
    codemirror.bodyTop = 0;
    codemirror.getInputField().addEventListener('mousedown', function() {
      return codemirror.bodyTop = document.body.scrollTop;
    });
    return codemirror.getInputField().addEventListener('focus', function() {
      return window.scrollTo(0, codemirror.bodyTop);
    });
  };

  ready = function() {
    var key, value;
    for (key in dependencies) {
      value = dependencies[key];
      if (!value) return;
    }
    layout(sourceTargets());
    window.Backstage["switch"](0);
    return window.Backstage.toggle();
  };

  layout = function(files) {
    var container, htmlTabOf, htmlTabs, i, tabs, _ref, _ref2;
    htmlTabOf = function(file, number) {
      return '<li' + (number === 0 ? ' class="none"' : '') + '><a id="backstage-tab-' + number + '" href="#" data-src="' + file + '">' + (file === '' ? '&lt;main&gt;' : file.replace(/\?.*/, '')) + '</a></li>\n';
    };
    container = document.createElement('div');
    container.id = 'backstage-back';
    container.innerHTML = '<ul class="tab clearfix">\n</ul>\n<div id="backstage-editors">\n</div>';
    tabs = container.children[0];
    tabs.id = 'backstage-tabs';
    htmlTabs = '';
    for (i = 0, _ref = files.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      htmlTabs += htmlTabOf(files[i], i);
    }
    tabs.innerHTML = htmlTabs;
    document.body.appendChild(container);
    document.body.appendChild(document.createTextNode('\n'));
    for (i = 0, _ref2 = files.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      document.getElementById('backstage-tab-' + i).addEventListener('click', (function(i) {
        return function(event) {
          event.preventDefault();
          return Backstage["switch"](i);
        };
      })(i));
    }
    return document.getElementById('backstage-editors').addEventListener('touchmove', function(event) {
      return event.stopPropagation();
    });
  };

  if (typeof Backstage === "undefined" || Backstage === null) {
    setBackstage();
    loadCodeMirror();
    loadBackstage();
  }

}).call(this);
