module.exports = {
  activeClass: function(currentPartialName, partialNamesStr, options) {
    return partialNamesStr.split(' ').indexOf(currentPartialName) !== -1 ? options.fn(this) : '';
  },
  
  // Other helpers goes here
};