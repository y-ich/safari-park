# test.coffee

$('#backstage').bind 'click', ->
  if $('#backstage-script').length == 0
    script = document.createElement 'script'
    script.src = 'lib/backstage.js?time=' + (new Date).valueOf()
    document.body.appendChild script
  else
    Backstage.toBackstage()
