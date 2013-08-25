if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('afterBody', function(name, options) {
    $('body').flowtype({
     fontRatio : 30,
     lineRatio : 1.45
    });
  });
}

if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('loadMedium', function(name, options) {
    new Medium({
      element: document.getElementById('editor'),
      mode: 'rich'
    });
  });
}