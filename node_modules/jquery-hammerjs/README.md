jquery.hammer.js
==============

This jQuery plugin is just a small wrapper around the `Hammer()` class.
It also extends the `Manager.emit` method by triggering jQuery events.

 ````js
$(element).hammer(options).bind("pan", myPanHandler);
````

The Hammer instance is stored at `$element.data("hammer")`.

