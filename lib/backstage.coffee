###
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
###

site = 'http://localhost/~yuji/safari-park'

get = (url, type, callback) ->
  req = new XMLHttpRequest();
  req.open 'GET', url, true
  req.setRequestHeader 'Content-Type', type
  req.onreadystatechange = ->
    if req.readyState is 4
      if 200 <= req.status < 300
        callback req.responseText
      else
        console.log req.status
  req.send()


unless @Backstage?
  @Backstage = 
    editor : null
    script : null
    html : null
    css : null
    toBackstage : ->
      page = document.getElementById 'backstage-page'
      page.className = 'flipped'

    toFrontstage : ->
      page = document.getElementById 'backstage-page'
      page.className = ''

    toScript : ->
      # @editor.setValue @script ? ''
      # @editor.setOption 'mode', 'javascript'
    toHtml : ->
      @html = CodeMirror document.getElementById('backstage-editor-html'),
      value : document.documentElement.innerHTML
      mode : 'xml'
      lineNumbers : true
    toCss : ->
      @css = CodeMirror document.getElementById('backstage-editor-css'),
        value : @css
        mode : 'css'
        lineNumbers : true


  get window.location.href.replace(/\.html?$/, '.js'), 'text/html', (result) -> Backstage.script = result
  get window.location.href.replace(/\.html?$/, '.css'), 'text/css', (result) -> Backstage.css = result

  # cm means CodeMirror, bs means backstage
  cmcss = document.createElement 'link'
  cmcss.rel = 'stylesheet'
  cmcss.href = site + '/lib/codemirror.css'
  document.head.appendChild cmcss

  bscss = document.createElement 'link'
  bscss.rel = 'stylesheet'
  bscss.href = site + '/lib/backstage.css'
  document.head.appendChild bscss

  cmscript = document.createElement 'script'
  cmscript.onload = ->
    Backstage.script = CodeMirror document.getElementById('backstage-editor-script'),
      value : Backstage.script 
      mode : 'javascript'
      lineNumbers : true

    setTimeout Backstage.toBackstage, 100

  cmscript.src = site + '/lib/codemirror.js'
  document.head.appendChild cmscript

  container = document.createElement 'div'
  container.id = 'backstage-container'

  container.appendChild document.createTextNode '\n'

  page = document.createElement 'div'
  page.id = 'backstage-page'
  container.appendChild page

  container.appendChild document.createTextNode '\n'
  page.appendChild document.createTextNode '\n'
  
  front = document.createElement 'div'
  front.id = 'backstage-front'
  cs = document.body.children
  count = cs.length
  while --count >= 0
    child = cs[0]
    if child.tagName isnt 'SCRIPT'
      front.appendChild child
      front.appendChild document.createTextNode '\n'
  page.appendChild front

  page.appendChild document.createTextNode '\n'

  back = document.createElement 'div'
  back.id = 'backstage-back'
  page.appendChild back

  page.appendChild document.createTextNode '\n'
  back.appendChild document.createTextNode '\n'

  tab = document.createElement 'ul'
  tab.className = 'tab clear'
  tab.innerHTML =
    '''
    <li class="none"><a id="backstage-script" href="#script" class="blue">Script</a></li>
    <li><a id="backstage-html" href="#html" class="red">HTML</a></li>
    <li><a id="backstage-css" href="#css" class="green">CSS</a></li>
    '''
  back.appendChild tab

  editor = document.createElement 'div'
  editor.id = 'backstage-editor'
  editor.innerHTML =
    '''
    <div id="backstage-editor-script" class="backstage-editor"></div>
    <div id="backstage-editor-html" class="backstage-editor"></div>
    <div id="backstage-editor-css" class="backstage-editor"></div>
    '''
  back.appendChild editor

  back.appendChild document.createTextNode '\n'

  frontsw = document.createElement 'div'
  frontsw.id = 'frontstage'
  frontsw.className = 'backstage-switch'
  frontsw.innerHTML = 'f'
  back.appendChild frontsw

  document.body.appendChild container
  document.body.appendChild document.createTextNode '\n'

  document.getElementById('backstage-script').addEventListener 'click', (event) ->
    event.preventDefault()
    Backstage.toScript()

  document.getElementById('backstage-html').addEventListener 'click', (event) ->
    event.preventDefault()
    Backstage.toHtml()

  document.getElementById('backstage-css').addEventListener 'click', (event) ->
    event.preventDefault()
    Backstage.toCss()

  document.getElementById('frontstage').addEventListener 'click', (event) ->
    Backstage.toFrontstage()
    
