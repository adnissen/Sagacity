Posts = new Meteor.Collection("posts");
Meteor.autosubscribe(function () {
  Meteor.subscribe("directory");
  Meteor.subscribe("posts");
});

Template.editor.rendered = function() {
  if (Meteor.user() !== null)
  {
    new Medium({
      element: document.getElementById('editor'),
      modifier: 'auto',
      placeholder: "Write!",
      autofocus: false,
      autoHR: true,
      mode: 'rich',
      maxLength: -1,
      modifiers: {
          66: 'bold',
          73: 'italicize',
          85: 'underline',
          86: 'paste'
      },
      tags: {
          paragraph: 'p',
          outerLevel: ['pre','blockquote', 'figure', 'hr'],
          innerLevel: ['a', 'b', 'u', 'i', 'img', 'strong']
      },
      cssClasses: {
          editor: 'Medium',
          pasteHook: 'Medium-paste-hook',
          placeholder: 'Medium-placeholder'
      }
    });
    new Medium({
      element: document.getElementById('title'),
      mode: 'inline',
      maxLength: 25,
      placeholder: 'Your Title'
    });
  }
};

Template.editor.isLoggedIn = function() {
  return (Meteor.user() !== null);
};

Template.editor.profileImage = function() {
  if (Meteor.user())
    return Meteor.user().services.twitter.profile_image_url;
};

Template.editor.events({
  'click button.minimal': function () {
    var title = $('#title').text();
    var content = $('#editor').text();
    Meteor.call("publishPost", title, content, function (data, err){
      console.log("waiting for callback");
      console.log(data);
      var author = Meteor.user().services.twitter.screenName;
      Meteor.Router.to('/' + author + '/' + escape(title));
    });
  }
});

Template.showPost.author = function() {
  return Session.get('currentPostAuthor');
};

Template.showPost.title = function() {
  return Session.get('currentPostTitle');
};

Template.showPost.screenName = function() {
  Session.set('currentPostScreenName', "loading...");
  Session.set('currentPostScreenName', Posts.findOne({author: escape(Session.get('currentPostAuthor')), urlsafetitle: escape(Session.get('currentPostTitle'))}).name);
  return Session.get('currentPostScreenName');
};

Template.showPost.content = function() {
  Session.set('currentPostContent', "loading...");
  Session.set('currentPostContent', Posts.findOne({author: escape(Session.get('currentPostAuthor')), urlsafetitle: escape(Session.get('currentPostTitle'))}).content);
  return Session.get('currentPostContent');
};