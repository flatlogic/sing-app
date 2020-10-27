Widgster
======================

Small jQuery plugin that provides an easy way to handle basic widget functions like collapsing, closing, ajax-refreshing & fullsreening.

**[Demo](http://widgster.flatlogic.com/demo/index.html)**

**[Advanced Demo](http://demo.flatlogic.com/sing-wrapbootstrap-2/ajax/grid.html)**

Use
------------


To apply all these features to your default widget you have to add appropriate links (or buttons) to it:

    <section class="widget">
        <header>
            <h3>Header</h3>
            <div class="widget-controls">
                <a data-widgster="load" href="#">Reload</a>
                <a data-widgster="expand" href="#">Expand</a>
                <a data-widgster="collapse" href="#">Collapse</a>
                <a data-widgster="fullscreen" href="#">Fullscreen</a>
                <a data-widgster="restore" href="#">Restore</a>
                <a data-widgster="close" href="#">Close</a>
            </div>
        </header>
        <div class="widget-body">
            Body
        </div>
    </section>

In the example above links are put into a `.widget-controls` but you can put them anywhere inside of widget.

Then widgster needs to be initialized via javascript:

    $('.widget').widgster();
    
As you could guess `data-widgster` attribute defines widget action to be performed when link is clicked.

Actions
------------

*   **close** - closes the widget;
*   **collapse** - collapses (minimizes) the widget. An element holding this data attribute will be hidden when widget gets expanded;
*   **expand** - expands the widget. An element holding this data attribute will be hidden when widget gets collapsed;
*   **fullscreen** - fullscreens the widget. An element holding this data attribute will be hidden when widget gets restored;
*   **restore** - restores the widget back to its position. An element holding this data attribute will be hidden when widget gets fullscreened;
*   **load** - reloads widget content from the url provided with `data-widget-load` attribute.

All actions may be called via js:

    $('.widget').widgster('close');
    
Options
------------

*   **collapsed** - if true collapses widget after page load;
*   **fullscreened** - if true fullscreens widget after page load;
*   **bodySelector** - widget body selector. Used for loading and collapsing. Default is `.body`;
*   **load** - an url to fetch widget body from. Default is `undefined`;
*   **showLoader** - whether to show a loader when ajax refresh performed. Default is `true`;
*   **autoload** - whether to automatically perform ajax refresh after page load. May be set to an integer value. If set, for example, to 2000 will refresh the widget every 2 seconds. Default is `false`;
*   **closePrompt(callback)** - a function to be called when closing. Closing is only performed when `callback` is called.

Widgster accepts an object with options:

    $('.widget').widgster({
        collapsed: true
    });
    
Events
------------

Each action fires both before and after event. Events have the same names as actions. Before event may be canceled.

For example, to make refresh button spin:

    $('.widget').on("load.widgster", function(){
        $(this).find('[data-widgster="load"] > i').addClass('fa-spin')
    }).on("loaded.widgster", function(){
        $(this).find('[data-widgster="load"] > i').removeClass('fa-spin')
    });
