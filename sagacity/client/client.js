if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('afterBody', function(name, options) {

  });
}

Template.editor.rendered = function() {

};

Template.editor.isLoggedIn = function() {
  return (Meteor.userId());
};