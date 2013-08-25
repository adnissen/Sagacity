if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('afterBody', function(name, options) {
    $('body').flowtype({
     fontRatio : 30,
     lineRatio : 1.45
    });

    
  });
}
