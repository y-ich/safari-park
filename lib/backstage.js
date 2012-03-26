
/*
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
*/

(function() {
  var back, bscss, cmcss, cmscript, container, editor, front, get, page, site, tab;

  site = 'http://localhost/~yuji/safari-park';

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

  if (this.Backstage == null) {
    this.Backstage = {
      editor: null,
      script: null,
      css: null,
      toBackstage: function() {
        var page;
        page = document.getElementById('backstage-page');
        return page.className = 'flipped';
      },
      toFrontstage: function() {
        var page;
        page = document.getElementById('backstage-page');
        return page.className = '';
      },
      toScript: function() {
        var _ref;
        this.editor.setValue((_ref = this.script) != null ? _ref : '');
        return this.editor.setOption('mode', 'javascript');
      },
      toHtml: function() {
        this.editor.setValue(document.documentElement.innerHTML);
        return this.editor.setOption('mode', 'xml');
      },
      toCss: function() {
        var _ref;
        this.editor.setValue((_ref = this.css) != null ? _ref : '');
        return this.editor.setOption('mode', 'css');
      }
    };
    get(window.location.href.replace(/\.html?$/, '.js'), 'text/html', function(result) {
      return Backstage.script = result;
    });
    get(window.location.href.replace(/\.html?$/, '.css'), 'text/css', function(result) {
      return Backstage.css = result;
    });
    cmcss = document.createElement('link');
    cmcss.rel = 'stylesheet';
    cmcss.href = site + '/lib/codemirror.css';
    document.head.appendChild(cmcss);
    bscss = document.createElement('link');
    bscss.rel = 'stylesheet';
    bscss.href = site + '/lib/backstage.css';
    document.head.appendChild(bscss);
    cmscript = document.createElement('script');
    cmscript.onload = function() {
      Backstage.editor = CodeMirror(document.getElementById('backstage-editor'), {
        value: Backstage.script,
        mode: 'javascript',
        lineNumbers: true
      });
      return setTimeout(Backstage.toBackstage, 100);
    };
    cmscript.src = site + '/lib/codemirror.js';
    document.head.appendChild(cmscript);
    container = document.createElement('div');
    container.id = 'backstage-container';
    container.appendChild(document.createTextNode('\n'));
    page = document.createElement('div');
    page.id = 'backstage-page';
    container.appendChild(page);
    container.appendChild(document.createTextNode('\n'));
    page.appendChild(document.createTextNode('\n'));
    front = document.createElement('div');
    front.id = 'backstage-front';
    front.innerHTML = document.body.innerHTML + '\n';
    document.body.innerHTML = '';
    page.appendChild(front);
    page.appendChild(document.createTextNode('\n'));
    back = document.createElement('div');
    back.id = 'backstage-back';
    page.appendChild(back);
    page.appendChild(document.createTextNode('\n'));
    back.appendChild(document.createTextNode('\n'));
    tab = document.createElement('ul');
    tab.className = 'tab clear';
    tab.innerHTML = '<li class="none"><a id="backstage-script" href="#script" class="blue">Script</a></li>\n<li><a id="backstage-html" href="#html" class="red">HTML</a></li>\n<li><a id="backstage-css" href="#css" class="green">CSS</a></li>';
    back.appendChild(tab);
    editor = document.createElement('div');
    editor.id = 'backstage-editor';
    back.appendChild(editor);
    back.appendChild(document.createTextNode('\n'));
    document.body.appendChild(container);
    document.body.appendChild(document.createTextNode('\n'));
    document.getElementById('backstage-script').addEventListener('click', function(event) {
      event.preventDefault();
      return Backstage.toScript();
    });
    document.getElementById('backstage-html').addEventListener('click', function(event) {
      event.preventDefault();
      return Backstage.toHtml();
    });
    document.getElementById('backstage-css').addEventListener('click', function(event) {
      event.preventDefault();
      return Backstage.toCss();
    });
  }

}).call(this);
