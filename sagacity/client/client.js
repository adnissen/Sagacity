Meteor.autosubscribe(function () {
  Meteor.subscribe("directory");
  Meteor.subscribe("posts");
});

Template.editor.rendered = function() {

};

Template.editor.isLoggedIn = function() {
  return (Meteor.user() !== null);
};

Template.editor.profileImage = function() {
  if (Meteor.user())
    return Meteor.user().services.twitter.profile_image_url;
};