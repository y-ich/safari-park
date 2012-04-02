###
# Backstage: web console for iOS
# author: ICHIKAWA, Yuji
# Copyright (C) 2012 ICHIKAWA, Yuji (New 3 Rs)
###


site = 'http://y-ich.github.com/safari-park'

dependencies = {}

defaultCMOptions =
    lineNumbers : true
    lineWrapping : false
    readOnly : 'nocursor'

typeOf = (url) ->
    return 'html' unless /\./.test url # no extensions
    switch url.replace(/^.*\./, '').replace(/\?.*/, '')
        when 'js'
            'javascript'
        when 'css'
            'css'
        when 'coffee'
            'coffeescript'
        else
            'html'


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
                console.log 'get error: ' + req.status
    req.send()


overwrite = (obj1, obj2) ->
    obj = {}
    keys = (key for own key, value of obj1)
    for own key, value of obj2
        keys.push key unless key in obj1
    for key in keys
        obj[key] = obj2[key] ? obj1[key]
    obj


loadCSS = (url, callback) ->
    css = document.createElement 'link'
    css.rel = 'stylesheet'
    css.href = url + '?time=' + (new Date).valueOf()
    document.head.appendChild css
    count = 50
    interval = setInterval ->
            if --count <= 0
                clearInterval interval
                callback()
                return
            sheets = document.styleSheets
            for i in [0...sheets.length]
                if sheets[i].href is css.href
                    clearInterval interval
                    callback()
                    break
        , 100


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
                file = tabs[index].children[0].dataset.src
                type = typeOf file
                @editors[index] = CodeMirror div,
                    overwrite(defaultCMOptions, { mode : if type is 'html' then 'xml' else type }) # assuming file is not html
                preventPageScroll @editors[index]
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


preventPageScroll = (codemirror) ->
    codemirror.bodyTop = 0
    codemirror.getInputField().addEventListener 'mousedown', ->
        codemirror.bodyTop = document.body.scrollTop
    codemirror.getInputField().addEventListener 'focus', ->
        window.scrollTo 0, codemirror.bodyTop


ready = ->
    for key, value of dependencies
        return unless value
    layout sourceTargets()
    window.Backstage.switch 0
    window.Backstage.toggle()


layout = (files) ->
    htmlTabOf = (file, number) ->
        '<li' + (if number == 0 then ' class="none"' else '') +
        '><a id="backstage-tab-' + number + '" href="#" data-src="' + file + '">' +
        (if file is'' then '&lt;main&gt;' else file.replace(/\?.*/, '')) +
        '</a></li>\n'

    container = document.createElement 'div'
    container.id = 'backstage-back'
    container.innerHTML =
        '''
            <ul class="tab clearfix">
            </ul>
            <div id="backstage-editors">
            </div>
        '''

    tabs = container.children[0]
    tabs.id = 'backstage-tabs'
    htmlTabs = ''
    for i in [0...files.length]
        htmlTabs += htmlTabOf files[i], i
    tabs.innerHTML = htmlTabs

    document.body.appendChild container
    document.body.appendChild document.createTextNode '\n'

    for i in [0...files.length]
        document.getElementById('backstage-tab-' + i).addEventListener 'click', ((i) ->
                (event) ->
                    event.preventDefault()
                    Backstage.switch i
            )(i)

    document.getElementById('backstage-editors').addEventListener 'touchmove', (event) ->
        event.stopPropagation()


# initiailize

unless Backstage?
    setBackstage()
    loadCodeMirror()
    loadBackstage()

