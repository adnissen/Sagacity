if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('afterBody', function(name, options) {
    
    $('body').flowtype({
     fontRatio : 30,
     lineRatio : 1.45
    });
  });
}

Template.editor.rendered = function() {
  new Medium({
      element: document.getElementById('editor'),
      autofocus: true
    });
};