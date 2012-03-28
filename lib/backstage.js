
/*
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
*/

(function() {
  var dependencies, get, layout, loadBackstage, loadCSS, loadCodeMirror, loadScript, loadTargets, ready, setBackstage, site, switchTab;

  site = 'http://localhost/~yuji/safari-park';

  dependencies = {};

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
        var e, _i, _len, _ref;
        _ref = this.editors;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          e.getWrapperElement().style.display = 'none';
        }
        return this.editors[index].getWrapperElement().style.display = 'block';
      },
      toBackstage: function() {
        return document.getElementById('backstage-page').className = 'flipped';
      },
      toFrontstage: function() {
        return document.getElementById('backstage-page').className = '';
      }
    };
  };

  switchTab = function(elem) {
    var i, tabs, _ref;
    tabs = elem.parentElement.parentElement.children;
    for (i = 0, _ref = tabs.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      tabs[i].className = '';
    }
    return elem.parentElement.className = 'none';
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

  loadTargets = function() {
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
      list[i].src;
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
    window.Backstage.editors[0] = CodeMirror(document.getElementById('backstage-editor-script'), {
      value: Backstage.script,
      mode: 'javascript',
      lineNumbers: true,
      lineWrapping: true
    });
    window.Backstage.editors[1] = CodeMirror(document.getElementById('backstage-editor-html'), {
      value: document.documentElement.innerHTML,
      mode: 'xml',
      lineNumbers: true,
      lineWrapping: true
    });
    window.Backstage.editors[2] = CodeMirror(document.getElementById('backstage-editor-css'), {
      value: Backstage.css,
      mode: 'css',
      lineNumbers: true,
      lineWrapping: true
    });
    window.Backstage["switch"](0);
    document.getElementById('backstage-container').style.visibility = 'visible';
    return window.Backstage.toBackstage();
  };

  layout = function() {
    var child, childNodes, container, count, editor, front, tab;
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
    tab.innerHTML = '<li class="none"><a id="backstage-script" href="#script" class="blue">Script</a></li>\n<li><a id="backstage-html" href="#html" class="red">HTML</a></li>\n<li><a id="backstage-css" href="#css" class="green">CSS</a></li>';
    editor = container.children[0].children[1].children[1];
    editor.innerHTML = '<div id="backstage-editor-script" class="backstage-editor"></div>\n<div id="backstage-editor-html" class="backstage-editor"></div>\n<div id="backstage-editor-css" class="backstage-editor"></div>';
    document.body.appendChild(container);
    document.body.appendChild(document.createTextNode('\n'));
    document.getElementById('backstage-script').addEventListener('click', function(event) {
      event.preventDefault();
      switchTab(this);
      return Backstage["switch"](0);
    });
    document.getElementById('backstage-html').addEventListener('click', function(event) {
      event.preventDefault();
      switchTab(this);
      return Backstage["switch"](1);
    });
    document.getElementById('backstage-css').addEventListener('click', function(event) {
      event.preventDefault();
      switchTab(this);
      return Backstage["switch"](2);
    });
    return document.getElementById('frontstage').addEventListener('click', function(event) {
      return Backstage.toFrontstage();
    });
  };

  if (typeof Backstage === "undefined" || Backstage === null) {
    setBackstage();
    loadCodeMirror();
    loadBackstage();
    loadTargets();
    layout();
  }

}).call(this);
