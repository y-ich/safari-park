# test.coffee

$('#backstage').bind 'click', ->
  if $('#backstage-script').length == 0
    script = document.createElement 'script'
    script.id = 'backstage-script'
    script.src = 'lib/backstage.js'
    document.body.appendChild script
  else
    Backstage.toBackstage()
