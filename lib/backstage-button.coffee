# test.coffee

site = 'http://192.168.1.8/~yuji/safari-park/'

document.body.style['-webkit-transform-style'] = 'preserve-3d'
# This is a work around against flicker at switching GPU for rendering.
# As a result, flicker appears when executing this script, doesn't appear when pushing the button.

sw = document.createElement 'div'
sw.id = 'backstage'
sw.className = 'backstage-switch'
sw.innerHTML = 'b'
sw.style['position'] = 'absolute'
sw.style['width'] = '13px'
sw.style['height'] = '13px'
sw.style['line-height'] = '13px'
sw.style['text-align'] = 'center'
sw.style['color'] = 'white'
sw.style['font-size'] = '13px'
sw.style['font-style'] = 'italic'
sw.style['background-color'] = 'gray'
sw.style['-webkit-border-radius'] = '50%'
if backstageConfig?
    for key, value of backstageConfig
        sw.style[key] = value
sw.style['right'] = '10px' if sw.style['right'] is '' and sw.style['left'] is ''
sw.style['top'] = '10px' if sw.style['top'] is '' and sw.style['bottom'] is ''

document.body.appendChild document.createTextNode '\n'
document.body.appendChild sw

sw.addEventListener 'click', ->
  if Backstage?
    Backstage.toggle()
  else
    script = document.createElement 'script'
    script.src = site + 'lib/backstage.js?time=' + (new Date).valueOf() # prevent to use a cache.
    document.body.appendChild script
