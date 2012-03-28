###
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
###


site = 'http://localhost/~yuji/safari-park'

dependencies = {}

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

loadCSS = (url, callback) ->
    css = document.createElement 'link'
    css.rel = 'stylesheet'
    css.href = url + '?time=' + (new Date).valueOf()
    document.head.appendChild css
    count = 20
    interval = setInterval ->
            if --count <= 0
                clearInterval interval
                callback()
                return
            sheets = document.styleSheets
            for i in [0...sheets.length]
                if sheets[i].href is url
                    clearInterval interval
                    callback()
                    break
        , 50


loadScript = (url, callback) ->
    script = document.createElement 'script'
    script.onload = callback
    script.src = url + '?time=' + (new Date).valueOf()
    document.head.appendChild script


setBackstage = ->
    window.Backstage =
        editors : []
        switch : (index) ->
            for e in @editors
                e.getWrapperElement().style.display = 'none'
            @editors[index].getWrapperElement().style.display = 'block'

        toBackstage : ->
            document.getElementById('backstage-page').className = 'flipped'

        toFrontstage : ->
            document.getElementById('backstage-page').className = ''


switchTab = (elem) ->
    tabs = elem.parentElement.parentElement.children
    for i in [0...tabs.length]
        tabs[i].className = ''

    elem.parentElement.className = 'none'


loadCodeMirror = ->
    dependencies.cmcss = false
    loadCSS  "#{site}/lib/codemirror.css", ->
        dependencies.cmcss = true
        ready()

    dependencies.cmscript = false    
    loadScript "#{site}/lib/codemirror.min.js", ->
        dependencies.cmscript = true
        ready()


loadBackstage = ->
    dependencies.bscss = false
    loadCSS "#{site}/lib/backstage.css", ->
        dependencies.bscss = true
        ready()

loadTargets = ->
    list = document.getElementsByTagName('script')
    for i in [0...list.length]
        url = list[i].dataset.source ? list[i].src

        switch url.replace(/^.*\./, '')
            when 'js'
                type = 'text/javascript'
            when 'coffee'
                type = 'text/coffeescript'
        get url, type, (result) ->

        list[i].src
    get window.location.href.replace(/\.html?$/, '.js'), 'text/html', (result) ->
        window.Backstage.script = result
        ready()

    get window.location.href.replace(/\.html?$/, '.css'), 'text/css', (result) ->
        window.Backstage.css = result


ready = ->
    for key, value of dependencies
        return unless value

    document.getElementById('backstage-container').style.visibility = 'hidden'

    window.Backstage.editors[0] = CodeMirror document.getElementById('backstage-editor-script'),
        value : Backstage.script 
        mode : 'javascript'
        lineNumbers : true
        lineWrapping : true

    window.Backstage.editors[1] = CodeMirror document.getElementById('backstage-editor-html'),
        value : document.documentElement.innerHTML
        mode : 'xml'
        lineNumbers : true
        lineWrapping : true

    window.Backstage.editors[2] = CodeMirror document.getElementById('backstage-editor-css'),
        value : Backstage.css
        mode : 'css'
        lineNumbers : true
        lineWrapping : true

    window.Backstage.switch 0

    document.getElementById('backstage-container').style.visibility = 'visible'
    window.Backstage.toBackstage()


layout = ->
    container = document.createElement 'div'
    container.id = 'backstage-container'
    container.innerHTML =
        '''
            <div id="backstage-page">
                <div id="backstage-front">
                </div>
                <div id="backstage-back">
                    <ul class="tab clear">
                    </ul>
                    <div id="backstage-editors">
                    </div>
                    <div id="frontstage" class="backstage-switch">f</div>
                </div>
            </div>
        '''   
    front = container.children[0].children[0]
    childNodes = document.body.childNodes
    count = childNodes.length
    while --count >= 0
        child = childNodes[0]
        front.appendChild  document.createTextNode '            \n'
        front.appendChild child
    front.appendChild  document.createTextNode '        \n'

    tab = container.children[0].children[1].children[0]
    tab.innerHTML =
        '''
        <li class="none"><a id="backstage-script" href="#script" class="blue">Script</a></li>
        <li><a id="backstage-html" href="#html" class="red">HTML</a></li>
        <li><a id="backstage-css" href="#css" class="green">CSS</a></li>
        '''

    editor = container.children[0].children[1].children[1]
    editor.innerHTML =
        '''
        <div id="backstage-editor-script" class="backstage-editor"></div>
        <div id="backstage-editor-html" class="backstage-editor"></div>
        <div id="backstage-editor-css" class="backstage-editor"></div>
        '''

    document.body.appendChild container
    document.body.appendChild document.createTextNode '\n'

    document.getElementById('backstage-script').addEventListener 'click', (event) ->
        event.preventDefault()
        switchTab this
        Backstage.switch 0

    document.getElementById('backstage-html').addEventListener 'click', (event) ->
        event.preventDefault()
        switchTab this
        Backstage.switch 1

    document.getElementById('backstage-css').addEventListener 'click', (event) ->
        event.preventDefault()
        switchTab this
        Backstage.switch 2

    document.getElementById('frontstage').addEventListener 'click', (event) ->
        Backstage.toFrontstage()


# initiailize

unless Backstage?
    setBackstage()
    loadCodeMirror()
    loadBackstage()
    loadTargets()
    layout()


