(function() {

  $('#backstage').bind('click', function() {
    var script;
    if ($('#backstage-script').length === 0) {
      script = document.createElement('script');
      script.src = 'lib/backstage.js?time=' + (new Date).valueOf();
      return document.body.appendChild(script);
    } else {
      return Backstage.toBackstage();
    }
  });

}).call(this);
