# drunken-donuts
We &lt;3 support.

# Script to embed on wepow side:

```javascript
(function() {
    'use strict';

    // Document Ready function
    // From https://github.com/jfriend00/docReady
    var drunkenDonuts = window.drunkenDonuts = {};
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    function ready() {
        if (!readyFired) {
            readyFired = true;

            for (var i = 0; i < readyList.length; i++) {
                readyList[i].fn.call(window, readyList[i].ctx);
            }

            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === 'complete' ) {
            ready();
        }
    }

    function appendIframe() {
        var frame = document.createElement('iframe');

        frame.setAttribute('src', 'https://drunken-donuts.herokuapp.com/chat');
        frame.style.width = '300px';
        frame.style.height = '545px';
        frame.style.position = 'fixed';
        frame.style.bottom = '90px';
        frame.style.right = '35px';
        frame.style.zIndex = '99999999';

        frame.onload = function() {
            frame.contentWindow.postMessage({
                user: wepow.user.toJSON(),
                organization: wepow.organization.toJSON()
            }, '*');
        };

        document.body.appendChild(frame);
    }

    drunkenDonuts.ready = function(callback, context) {
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            readyList.push({fn: callback, ctx: context});
        }

        if (document.readyState === 'complete' || (!document.attachEvent && document.readyState === 'interactive')) {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', ready, false);
                window.addEventListener('load', ready, false);
            } else {
                document.attachEvent('onreadystatechange', readyStateChange);
                window.attachEvent('onload', ready);
            }
            readyEventHandlersInstalled = true;
        }
    };

    drunkenDonuts.init = function() {
        drunkenDonuts.ready(appendIframe);
    };
})();

window.drunkenDonuts.init();
```