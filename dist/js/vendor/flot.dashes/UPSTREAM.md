# flot.dashes

Flot plugin to provide dashed lines

## Usage

```javascript
options = {
    series: {
        dashes: {
            
            // show
            // default: false
            // Whether to show dashed line for the series
            show: <boolean>,

            // lineWidth
            // default: 2
            // Width of the dashed line in pixels
            lineWidth: <number>,

            // dashLength
            // default: 10
            // Controls the length of the invdividual dashes and the amount of
            // space between them.
            // If this is a number, the dashes and spaces will have that length.
            // If this is an array, it is read as [ dashLength, spaceLength ]
            dashLength: <number> or <array[2]>
        }
    }
}
```