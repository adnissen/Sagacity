if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('afterBody', function(name, options) {

  });
}

Template.editor.rendered = function() {

};

Template.editor.isLoggedIn = function() {
  return (Meteor.userId() !== null);
};

Template.editor.profileImage = function() {
  if (Meteor.user())
    return Meteor.user().services.twitter.profile_image_url;
};