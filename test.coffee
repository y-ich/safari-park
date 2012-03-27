# test.coffee

$('#backstage').bind 'click', ->
  if Backstage?
    Backstage.toBackstage()
  else
    script = document.createElement 'script'
    script.src = 'lib/backstage.js?time=' + (new Date).valueOf() # prevent to use a cache.
    document.body.appendChild script
