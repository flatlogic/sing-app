
$(function(){
    /**
     * A global object containing theme specific colors, screen variables & color functions.
     * @type Object
     */
    window.Sing = {
        colors: {
            'white': '#fff',
            'black': '#000',
            'gray-100': '#f8f9fa',
            'gray-200': '#e9ecef',
            'gray-300': '#dee2e6',
            'gray-400': '#ced4da',
            'gray-500': '#adb5bd',
            'gray-600': '#6c757d',
            'gray-700': '#495057',
            'gray-800': '#343a40',
            'gray-900': '#212529',
            'brand-primary': '#005792',
            'brand-success': '#21ae8c',
            'brand-warning': '#Fda700',
            'brand-danger': '#fd5f00',
            'brand-info': '#1a86d0',
            'brand-inverse': '#002B49',
            'body-bg': '#fafbff'
        },

        // Brand colors modifications
        palette: {
            'brand-primary-light': '#547fff',
            'brand-primary-pale': '#3abf94',
            'brand-info-light': '#1a86d0',
            'brand-info-pale': '#fd5f00',
            'brand-danger-light': '#005792',
            'brand-green': '#68ca66',
            'brand-danger-pale': '#fd5f00',
            'brand-success-light': '#8fe5d4',
            'brand-success-pale': '#ace5d1',
            'brand-warning-light': '#ffebb2',
            'brand-warning-pale': '#fff8e3',
        },

        newPalette: {
            'brand-primary': '#005792',
            'brand-success': '#21ae8c',
            'brand-warning': '#Fda700',
            'brand-danger': '#fd5f00',
            'brand-info': '#1a86d0',
            'brand-inverse': '#002B49',
        },

        screens: {
            'xs-max': 575,
            'sm-min': 576,
            'sm-max': 767,
            'md-min': 768,
            'md-max': 991,
            'lg-min': 992,
            'lg-max': 1199,
            'xl-min': 1200
        },

        isScreen: function(size){
            var screenPx = window.innerWidth;
            return (screenPx >= this.screens[size + '-min'] || size == 'xs') && (screenPx <= this.screens[size + '-max'] || size == 'xl');
        },

        getScreenSize: function(){
            var screenPx = window.innerWidth;
            if (screenPx <= this.screens['xs-max']) return 'xs';
            if ((screenPx >= this.screens['sm-min']) && (screenPx <= this.screens['sm-max'])) return 'sm';
            if ((screenPx >= this.screens['md-min']) && (screenPx <= this.screens['md-max'])) return 'md';
            if ((screenPx >= this.screens['lg-min']) && (screenPx <= this.screens['lg-max'])) return 'lg';
            if (screenPx >= this.screens['xl-min']) return 'xl';
        },

        //credit http://stackoverflow.com/questions/1507931/generate-lighter-darker-color-in-css-using-javascript
        changeColor: function(color, ratio, darker) {
            var pad = function(num, totalChars) {
                var pad = '0';
                num = num + '';
                while (num.length < totalChars) {
                    num = pad + num;
                }
                return num;
            };
            // Trim trailing/leading whitespace
            color = color.replace(/^\s*|\s*$/, '');

            // Expand three-digit hex
            color = color.replace(
                /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
                '#$1$1$2$2$3$3'
            );

            // Calculate ratio
            var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
            // Determine if input is RGB(A)
                rgb = color.match(new RegExp('^rgba?\\(\\s*' +
                    '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                    '\\s*,\\s*' +
                    '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                    '\\s*,\\s*' +
                    '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                    '(?:\\s*,\\s*' +
                    '(0|1|0?\\.\\d+))?' +
                    '\\s*\\)$'
                    , 'i')),
                alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

            // Convert hex to decimal
                decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
                    /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
                    function() {
                        return parseInt(arguments[1], 16) + ',' +
                            parseInt(arguments[2], 16) + ',' +
                            parseInt(arguments[3], 16);
                    }
                ).split(/,/),
                returnValue;

            // Return RGB(A)
            return !!rgb ?
                'rgb' + (alpha !== null ? 'a' : '') + '(' +
                    Math[darker ? 'max' : 'min'](
                        parseInt(decimal[0], 10) + difference, darker ? 0 : 255
                    ) + ', ' +
                    Math[darker ? 'max' : 'min'](
                        parseInt(decimal[1], 10) + difference, darker ? 0 : 255
                    ) + ', ' +
                    Math[darker ? 'max' : 'min'](
                        parseInt(decimal[2], 10) + difference, darker ? 0 : 255
                    ) +
                    (alpha !== null ? ', ' + alpha : '') +
                    ')' :
                // Return hex
                [
                    '#',
                    pad(Math[darker ? 'max' : 'min'](
                        parseInt(decimal[0], 10) + difference, darker ? 0 : 255
                    ).toString(16), 2),
                    pad(Math[darker ? 'max' : 'min'](
                        parseInt(decimal[1], 10) + difference, darker ? 0 : 255
                    ).toString(16), 2),
                    pad(Math[darker ? 'max' : 'min'](
                        parseInt(decimal[2], 10) + difference, darker ? 0 : 255
                    ).toString(16), 2)
                ].join('');
        },
        lighten: function(color, ratio) {
            return this.changeColor(color, ratio, false);
        },
        darken: function(color, ratio) {
            return this.changeColor(color, ratio, true);
        }
    };

    /**
     * SingSettingsBundle provides a convenient way to access Sing related localStorage options.
     * Settings should be explicitly saved by calling save() method after changing some property
     * @constructor
     * @example
     * SingSettings.set('nav-static', false);
     * SingSettings.save();
     */
    var SingSettingsBundle = function(){
        var defaultSettings =  {
            /**
             * whether navigation is static (does not collapse automatically)
             */
            'nav-static': true
        };
        this.settingName = 'sing-app-settings';
        this._settings = JSON.parse(localStorage.getItem(this.settingName)) || defaultSettings;
    };

    SingSettingsBundle.prototype.save = function(){
        localStorage.setItem(this.settingName, JSON.stringify(this._settings));
        return this;
    };

    SingSettingsBundle.prototype.get = function(key){
        return this._settings[key];
    };

    SingSettingsBundle.prototype.set = function(key, value){
        this._settings[key] = value;
        return this;
    };

    window.SingSettings = new SingSettingsBundle();
});
