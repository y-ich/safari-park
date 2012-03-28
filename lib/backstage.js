
/*
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
*/

(function() {
  var dependencies, get, layout, loadBackstage, loadCSS, loadCodeMirror, loadScript, loadTargets, ready, setBackstage, site, sourceTargets, targets, typeOf;

  site = 'http://localhost/~yuji/safari-park';

  dependencies = {};

  typeOf = function(url) {
    switch (url.replace(/^.*\./, '')) {
      case '':
        return 'html';
      case 'htm':
        return 'html';
      case 'html':
        return 'html';
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'coffee':
        return 'coffeescript';
    }
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
          return console.log(req.status);
        }
      }
    };
    return req.send();
  };

  loadCSS = function(url, callback) {
    var count, css, interval;
    css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = url + '?time=' + (new Date).valueOf();
    document.head.appendChild(css);
    count = 20;
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
        if (sheets[i].href === url) {
          clearInterval(interval);
          callback();
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }, 50);
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
          document.getElementById('backstage-editors').appendChild(div);
          file = tabs[index].children[0].innerHTML;
          type = typeOf(file);
          this.editors[index] = CodeMirror(div, {
            mode: type,
            lineNumbers: true,
            lineWrapping: true
          });
          return get(file, "text/" + type, (function(cm) {
            return function(result) {
              return cm.setValue(result);
            };
          })(this.editors[index]));
        }
      },
      toBackstage: function() {
        return document.getElementById('backstage-page').className = 'flipped';
      },
      toFrontstage: function() {
        return document.getElementById('backstage-page').className = '';
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
      if (!/\//.test(url)) result.push(url);
    }
    list = document.getElementsByTagName('link');
    for (i = 0, _ref3 = list.length; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      if (list[i].rel === 'stylesheet' && !/\//.test(list[i].href)) {
        result.push(list[i].href);
      }
    }
    return result;
  };

  loadTargets = function(files) {
    var i, list, type, url, _ref, _ref2;
    list = document.getElementsByTagName('script');
    for (i = 0, _ref = list.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      url = (_ref2 = list[i].dataset.source) != null ? _ref2 : list[i].src;
      switch (url.replace(/^.*\./, '')) {
        case 'js':
          type = 'text/javascript';
          break;
        case 'coffee':
          type = 'text/coffeescript';
      }
      get(url, type, function(result) {});
    }
    get(window.location.href.replace(/\.html?$/, '.js'), 'text/html', function(result) {
      window.Backstage.script = result;
      return ready();
    });
    return get(window.location.href.replace(/\.html?$/, '.css'), 'text/css', function(result) {
      return window.Backstage.css = result;
    });
  };

  ready = function() {
    var key, value;
    for (key in dependencies) {
      value = dependencies[key];
      if (!value) return;
    }
    document.getElementById('backstage-container').style.visibility = 'hidden';
    window.Backstage.editors[0] = CodeMirror(document.getElementById('backstage-editor-0'), {
      value: document.documentElement.innerHTML,
      mode: 'xml',
      lineNumbers: true,
      lineWrapping: true
    });
    window.Backstage["switch"](0);
    document.getElementById('backstage-container').style.visibility = 'visible';
    return window.Backstage.toBackstage();
  };

  layout = function(files) {
    var child, childNodes, container, count, editor, front, i, tab, _ref, _ref2, _results;
    container = document.createElement('div');
    container.id = 'backstage-container';
    container.innerHTML = '<div id="backstage-page">\n    <div id="backstage-front">\n    </div>\n    <div id="backstage-back">\n        <ul class="tab clear">\n        </ul>\n        <div id="backstage-editors">\n        </div>\n        <div id="frontstage" class="backstage-switch">f</div>\n    </div>\n</div>';
    front = container.children[0].children[0];
    childNodes = document.body.childNodes;
    count = childNodes.length;
    while (--count >= 0) {
      child = childNodes[0];
      front.appendChild(document.createTextNode('            \n'));
      front.appendChild(child);
    }
    front.appendChild(document.createTextNode('        \n'));
    tab = container.children[0].children[1].children[0];
    tab.id = 'backstage-tabs';
    tab.innerHTML = '<li class="none"><a id="backstage-tab-0" href="#">' + files[0] + '</a></li>\n';
    for (i = 1, _ref = files.length; 1 <= _ref ? i < _ref : i > _ref; 1 <= _ref ? i++ : i--) {
      tab.innerHTML += '<li><a id="backstage-tab-' + i + '" href="#">' + files[i] + '</a></li>\n';
    }
    editor = container.children[0].children[1].children[1];
    editor.innerHTML = '<div id="backstage-editor-0" class="backstage-editor"></div>';
    document.body.appendChild(container);
    document.body.appendChild(document.createTextNode('\n'));
    _results = [];
    for (i = 0, _ref2 = files.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      _results.push(document.getElementById('backstage-tab-' + i).addEventListener('click', (function(i) {
        return function(event) {
          event.preventDefault();
          return Backstage["switch"](i);
        };
      })(i)));
    }
    return _results;
  };

  if (typeof Backstage === "undefined" || Backstage === null) {
    setBackstage();
    loadCodeMirror();
    loadBackstage();
    targets = sourceTargets();
    loadTargets(targets);
    layout(targets);
  }

}).call(this);
