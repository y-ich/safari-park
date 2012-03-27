###
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
###

site = 'http://localhost/~yuji/safari-park'

loadCM = false

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
  # cm means CodeMirror, bs means backstage
  cmcss = document.createElement 'link'
  cmcss.rel = 'stylesheet'
  cmcss.href = site + '/lib/codemirror.css'
  document.head.appendChild cmcss

  bscss = document.createElement 'link'
  bscss.rel = 'stylesheet'
  bscss.href = site + '/lib/backstage.css?time=' + (new Date).valueOf()
  document.head.appendChild bscss

  @Backstage = 
    scriptEditor : ->
      # @editor.setValue @script ? ''
      # @editor.setOption 'mode', 'javascript'
    htmlEditor : ->
      @html = CodeMirror document.getElementById('backstage-editor-html'),
        value : document.documentElement.innerHTML
        mode : 'xml'
        lineNumbers : true
        lineWrapping : true

    cssEditor : ->
      @css = CodeMirror document.getElementById('backstage-editor-css'),
        value : @css
        mode : 'css'
        lineNumbers : true
        lineWrapping : true

    switch : (editor) ->
      @scriptEditor.getWrapperElement().style.display = 'none'
      @htmlEditor.getWrapperElement().style.display = 'none'
      @cssEditor.getWrapperElement().style.display = 'none'
      this[editor].getWrapperElement().style.display = 'block'

    toBackstage : ->
      page = document.getElementById 'backstage-page'
      page.className = 'flipped'

    toFrontstage : ->
      page = document.getElementById 'backstage-page'
      page.className = ''


  cmscript = document.createElement 'script'
  cmscript.onload = ->
    loadCM = true
    initialize()

  get window.location.href.replace(/\.html?$/, '.js'), 'text/html', (result) ->
    Backstage.script = result
    initialize()

  get window.location.href.replace(/\.html?$/, '.css'), 'text/css', (result) ->
    Backstage.css = result

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
  cs = document.body.childNodes
  count = cs.length
  while --count >= 0
    child = cs[0]
    front.appendChild child
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
    switchTab this
    Backstage.switch 'scriptEditor'

  document.getElementById('backstage-html').addEventListener 'click', (event) ->
    event.preventDefault()
    switchTab this
    Backstage.switch 'htmlEditor'

  document.getElementById('backstage-css').addEventListener 'click', (event) ->
    event.preventDefault()
    switchTab this
    Backstage.switch 'cssEditor'

  document.getElementById('frontstage').addEventListener 'click', (event) ->
    Backstage.toFrontstage()


switchTab = (elem) ->
  tabs = elem.parentElement.parentElement.children
  for i in [0...tabs.length]
    tabs[i].className = ''

  elem.parentElement.className = 'none'

initialize = ->
  return unless loadCM and Backstage.script?

  document.getElementById('backstage-container').style.visibility = 'hidden'

  Backstage.scriptEditor = CodeMirror document.getElementById('backstage-editor-script'),
    value : Backstage.script 
    mode : 'javascript'
    lineNumbers : true
    lineWrapping : true

  Backstage.htmlEditor = CodeMirror document.getElementById('backstage-editor-html'),
    value : document.documentElement.innerHTML
    mode : 'xml'
    lineNumbers : true
    lineWrapping : true

  Backstage.cssEditor = CodeMirror document.getElementById('backstage-editor-css'),
    value : Backstage.css
    mode : 'css'
    lineNumbers : true
    lineWrapping : true

  Backstage.switch 'scriptEditor'

  setTimeout ->
      document.getElementById('backstage-container').style.visibility = 'visible'
      Backstage.toBackstage()
    , 100 # wait for loading css.