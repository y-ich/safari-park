
/*
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
*/

(function() {
  var back, bscss, child, cmcss, cmscript, container, count, cs, editor, front, frontsw, get, page, site, tab;

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
      scriptEditor: function() {},
      htmlEditor: function() {
        return this.html = CodeMirror(document.getElementById('backstage-editor-html'), {
          value: document.documentElement.innerHTML,
          mode: 'xml',
          lineNumbers: true,
          lineWrapping: true
        });
      },
      cssEditor: function() {
        return this.css = CodeMirror(document.getElementById('backstage-editor-css'), {
          value: this.css,
          mode: 'css',
          lineNumbers: true,
          lineWrapping: true
        });
      },
      "switch": function(editor) {
        this.scriptEditor.getWrapperElement().style.display = 'none';
        this.htmlEditor.getWrapperElement().style.display = 'none';
        this.cssEditor.getWrapperElement().style.display = 'none';
        return this[editor].getWrapperElement().style.display = 'block';
      },
      toBackstage: function() {
        var page;
        page = document.getElementById('backstage-page');
        return page.className = 'flipped';
      },
      toFrontstage: function() {
        var page;
        page = document.getElementById('backstage-page');
        return page.className = '';
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
      Backstage.scriptEditor = CodeMirror(document.getElementById('backstage-editor-script'), {
        value: Backstage.script,
        mode: 'javascript',
        lineNumbers: true,
        lineWrapping: true
      });
      Backstage.htmlEditor = CodeMirror(document.getElementById('backstage-editor-html'), {
        value: document.documentElement.innerHTML,
        mode: 'xml',
        lineNumbers: true,
        lineWrapping: true
      });
      Backstage.cssEditor = CodeMirror(document.getElementById('backstage-editor-css'), {
        value: Backstage.css,
        mode: 'css',
        lineNumbers: true,
        lineWrapping: true
      });
      Backstage["switch"]('scriptEditor');
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
    cs = document.body.children;
    count = cs.length;
    while (--count >= 0) {
      child = cs[0];
      if (child.tagName !== 'SCRIPT') {
        front.appendChild(child);
        front.appendChild(document.createTextNode('\n'));
      }
    }
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
    editor.innerHTML = '<div id="backstage-editor-script" class="backstage-editor"></div>\n<div id="backstage-editor-html" class="backstage-editor"></div>\n<div id="backstage-editor-css" class="backstage-editor"></div>';
    back.appendChild(editor);
    back.appendChild(document.createTextNode('\n'));
    frontsw = document.createElement('div');
    frontsw.id = 'frontstage';
    frontsw.className = 'backstage-switch';
    frontsw.innerHTML = 'f';
    back.appendChild(frontsw);
    document.body.appendChild(container);
    document.body.appendChild(document.createTextNode('\n'));
    document.getElementById('backstage-script').addEventListener('click', function(event) {
      event.preventDefault();
      return Backstage["switch"]('scriptEditor');
    });
    document.getElementById('backstage-html').addEventListener('click', function(event) {
      event.preventDefault();
      return Backstage["switch"]('htmlEditor');
    });
    document.getElementById('backstage-css').addEventListener('click', function(event) {
      event.preventDefault();
      return Backstage["switch"]('cssEditor');
    });
    document.getElementById('frontstage').addEventListener('click', function(event) {
      return Backstage.toFrontstage();
    });
  }

}).call(this);
