(function() {
  var key, site, sw, value;

  site = 'http://192.168.1.8/~yuji/safari-park/';

  document.body.style['-webkit-transform-style'] = 'preserve-3d';

  sw = document.createElement('div');

  sw.id = 'backstage';

  sw.className = 'backstage-switch';

  sw.innerHTML = 'b';

  sw.style['position'] = 'absolute';

  sw.style['width'] = '13px';

  sw.style['height'] = '13px';

  sw.style['line-height'] = '13px';

  sw.style['text-align'] = 'center';

  sw.style['color'] = 'white';

  sw.style['font-size'] = '13px';

  sw.style['font-style'] = 'italic';

  sw.style['background-color'] = 'gray';

  sw.style['-webkit-border-radius'] = '50%';

  if (typeof backstageConfig !== "undefined" && backstageConfig !== null) {
    for (key in backstageConfig) {
      value = backstageConfig[key];
      sw.style[key] = value;
    }
  }

  if (sw.style['right'] === '' && sw.style['left'] === '') {
    sw.style['right'] = '10px';
  }

  if (sw.style['top'] === '' && sw.style['bottom'] === '') {
    sw.style['top'] = '10px';
  }

  document.body.appendChild(document.createTextNode('\n'));

  document.body.appendChild(sw);

  sw.addEventListener('click', function() {
    var script;
    if (typeof Backstage !== "undefined" && Backstage !== null) {
      return Backstage.toggle();
    } else {
      script = document.createElement('script');
      script.src = site + 'lib/backstage.js?time=' + (new Date).valueOf();
      return document.body.appendChild(script);
    }
  });

}).call(this);
