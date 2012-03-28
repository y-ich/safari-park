(function() {
  var site, sw;

  console.log('pass');

  site = 'http://192.168.1.8/~yuji/safari-park/';

  sw = document.createElement('div');

  sw.id = 'backstage';

  sw.className = 'backstage-switch';

  sw.innerHTML = 'b';

  sw.style['position'] = 'absolute';

  sw.style['right'] = '10px';

  sw.style['top'] = '10px';

  sw.style['width'] = '13px';

  sw.style['height'] = '13px';

  sw.style['line-height'] = '13px';

  sw.style['text-align'] = 'center';

  sw.style['color'] = 'white';

  sw.style['font-size'] = '13px';

  sw.style['font-style'] = 'italic';

  sw.style['background-color'] = 'gray';

  sw.style['-webkit-border-radius'] = '50%';

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
