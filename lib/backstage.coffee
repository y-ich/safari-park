###
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
###


site = 'http://192.168.1.8/~yuji/safari-park'

dependencies = {}

typeOf = (url) ->
    switch url.replace(/^.*\./, '')
        when ''
            'html'
        when 'htm'
            'html'
        when 'html'
            'html'
        when 'js'
            'javascript'
        when 'css'
            'css'
        when 'coffee'
            'coffeescript'


baseOf = (url) ->
    url.replace /\/[^\/]*$/, ''

base = baseOf(window.location.href)


fileOf = (url) ->
    url.replace /^.*\//, ''


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
            tabs = document.getElementById('backstage-tabs').children
            tabs[i].className = '' for i in [0...tabs.length]
            tabs[index].className = 'none'

            e.getWrapperElement().style.display = 'none' for e in @editors when e?
            if @editors[index]?
                @editors[index].getWrapperElement().style.display = 'block'
            else
                div = document.createElement 'div'
                div.id = 'backstage-editor-' + index
                div.className = 'backstage-editor'
                document.getElementById('backstage-editors').appendChild div
                file = tabs[index].children[0].innerHTML
                type = typeOf file
                @editors[index] = CodeMirror div,
                    mode : type # assuming file is not html
                    lineNumbers : true
                    lineWrapping : true
                get file, "text/#{type}", ((cm) ->
                        (result) ->
                            cm.setValue result
                    )(@editors[index])
        toggle : ->
            document.body.className = if /opened/.test document.body.className
                    document.body.className.replace ' opened', ''
                else
                    document.body.className + ' opened'


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


sourceTargets = ->
    result = [window.location.href.replace(/^.*\//, '')]

    list = document.getElementsByTagName('script')
    for i in [0...list.length]
        url = list[i].dataset.source ? list[i].src
        continue if url is '' # internal script
        if not /\//.test(url) or baseOf(url) is base
            result.push fileOf url

    list = document.getElementsByTagName('link')
    for i in [0...list.length]
        if list[i].rel is 'stylesheet' and
            (not /\//.test(list[i].href) or baseOf(list[i].href) is base)
                result.push fileOf list[i].href
    result


loadTargets = (files) ->
    list = document.getElementsByTagName('script')
    for i in [0...list.length]
        url = list[i].dataset.source ? list[i].src

        switch url.replace(/^.*\./, '')
            when 'js'
                type = 'text/javascript'
            when 'coffee'
                type = 'text/coffeescript'
        get url, type, (result) ->

    get window.location.href.replace(/\.html?$/, '.js'), 'text/html', (result) ->
        window.Backstage.script = result
        ready()

    get window.location.href.replace(/\.html?$/, '.css'), 'text/css', (result) ->
        window.Backstage.css = result


ready = ->
    for key, value of dependencies
        return unless value

    window.Backstage.editors[0] = CodeMirror document.getElementById('backstage-editor-0'),
        value : document.documentElement.innerHTML
        mode : 'xml'
        lineNumbers : true
        lineWrapping : true

    window.Backstage.switch 0

    window.Backstage.toggle()


layout = (files) ->
    container = document.createElement 'div'
    container.id = 'backstage-back'
    container.innerHTML =
        '''
            <ul class="tab clear">
            </ul>
            <div id="backstage-editors">
            </div>
        '''

    tabs = container.children[0]
    tabs.id = 'backstage-tabs'
    tabs.innerHTML = '<li class="none"><a id="backstage-tab-0" href="#">' +
        files[0] + '</a></li>\n'

    for i in [1...files.length]
        tabs.innerHTML += '<li><a id="backstage-tab-' + i + '" href="#">' +
            files[i] + '</a></li>\n'

    editor = container.children[1]
    editor.innerHTML = '<div id="backstage-editor-0" class="backstage-editor"></div>'

    document.body.appendChild container
    document.body.appendChild document.createTextNode '\n'

    for i in [0...files.length]
        document.getElementById('backstage-tab-' + i).addEventListener 'click', ((i) ->
                (event) ->
                    event.preventDefault()
                    Backstage.switch i
            )(i)


# initiailize

unless Backstage?
    setBackstage()
    loadCodeMirror()
    loadBackstage()
    targets = sourceTargets()
    loadTargets(targets)
    layout(targets)
