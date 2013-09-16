Posts = new Meteor.Collection("posts");
Meteor.autosubscribe(function () {
  Meteor.subscribe("directory");
  Meteor.subscribe("restrictiveUsers");
  Meteor.subscribe("posts");
});

if (typeof Handlebars !== 'undefined') {
  Handlebars.registerHelper('afterBody', function(name, options) {
    $('body').flowtype({
     fontRatio : 55,
     minFont : 18,

     lineRatio : 1.45
    });
  });
}

Template.editor.rendered = function() {
  if(typeof(Storage)!=="undefined")
  {
    if (localStorage.editor !== "" || localStorage.title !== "")
    {
      $('#title').html(localStorage.title);
      $('#editor').html(localStorage.editor);
    }
  }
  else
  {
  // Sorry! No web storage support..
  }
  if (Meteor.user() !== null)
  {
    new Medium({
      element: document.getElementById('editor'),
      modifier: 'auto',
      placeholder: "",
      autofocus: false,
      autoHR: false,
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
      maxLength: 100,
      placeholder: ''
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
  'click button.minimal.btnPublish': function () {
    var title = $('#title').text();
    var content = $('#editor').html();
    console.log(content);
    Meteor.call("publishPost", title, content, function (err, data){
      console.log("waiting for callback");
      console.log("data: " + data);
      console.log("err: " + err);
      if (typeof err == 'undefined'){
        console.log("clear");
        var author = Meteor.user().services.twitter.screenName;
        //clear localStorage
        //if they don't have it, there's nothing to be cleared because they suck
        if(typeof(Storage)!=="undefined")
        {
          localStorage.title = "";
          localStorage.editor = "";
        }
        Meteor.Router.to('/' + author + '/' + escape(title));
      }
      else
        alert("You already have a post with this name!");
      
    });
  },

    'click button.help.btnHelp': function() {
      var el = document.getElementById('helpModal');
      if (el.style.visibility == "visible"){
        el.style.visibility = "hidden";
      }
      else
        el.style.visibility = "visible";
      },

  'keyup' : function () {
    if(typeof(Storage)!=="undefined")
    {
      localStorage.title = $('#title').html();
      localStorage.editor = $('#editor').html();
    }
  }
});

Template.showPost.events({
  'click button.minimal.btnUpdate': function () {
    var id = Session.get("currentPostId");
    var content = $('#content').html();
    Meteor.call("updatePost", id, content, function (data, err){
      var author = Meteor.user().services.twitter.screenName;
      Meteor.Router.to('/' + author + '/' + escape(Session.get('currentPostTitle')));
    });
  },

  'click button.minimal.btnDelete': function () {
    var confirm = window.confirm("Are you sure you want to delete this post? This cannot be undone later.");
    if (confirm === true){
      Meteor.call("deletePost", Session.get('currentPostId'));
      Meteor.Router.to('/' + Meteor.user().services.twitter.screenName);
    }
  }
});

Template.authorPage.events({
  'click button.minimal.btnSubscribe': function() {
    var author = Session.get("currentAuthorPage");
    if (Meteor.user() !== null){
      if (typeof Meteor.user().email !== 'undefined')
        Meteor.call("subscribeToAuthor", author);
      else{
        var newMail = prompt("It doesn't look like your account has an email associated with it. If you want to subscribe to email updates for this author, enter it below:", "awesomedude@sagacityapp.com");
        if (newMail !== null){
          Meteor.call("changeEmail", newMail);
          Meteor.call("subscribeToAuthor", author);
        }
      }
    }
  },
  'click button.minimal.btnUnSubscribe': function() {
    var author = Session.get("currentAuthorPage");
    if (Meteor.user() !== null){
      Meteor.call("unSubscribeFromAuthor", author);
    }
  }
});

Template.authorPage.isSubscribed = function() {
  var author = Session.get("currentAuthorPage");
  if (Meteor.user() !== null){
    if (typeof Meteor.user().subscriptions !== 'undefined'){
      if (Meteor.user().subscriptions.indexOf(author) !== -1)
        return true;
    }
    else
      return false;
  }
}

Template.showPost.created = function() {
  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
}

Template.showPost.rendered = function () {
  if (Meteor.user() !== null)
  {
    if (Meteor.user().services.twitter.screenName === Session.get('currentPostAuthor')){
      new Medium({
      element: document.getElementById('content'),
      modifier: 'auto',
      placeholder: "",
      autofocus: false,
      autoHR: false,
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
    }
  }
};

Template.showPost.isOwner = function() {
  if (Meteor.user() !== null)
  {
    return (Meteor.user().services.twitter.screenName === Session.get('currentPostAuthor'));
  }
  else
    return false;
};

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

Template.showPost.pageUrl = function() {
  return window.location.pathname;
};

Template.showPost.content = function() {
  Session.set('currentPostContent', "loading...");
  Session.set('currentPostContent', Posts.findOne({author: escape(Session.get('currentPostAuthor')), urlsafetitle: escape(Session.get('currentPostTitle'))}).content);
  //we sneak the id of the post into the page, since we need it later. really has nothing to do with the author
  Session.set('currentPostId', Posts.findOne({author: escape(Session.get('currentPostAuthor')), urlsafetitle: escape(Session.get('currentPostTitle'))})._id);
  return Session.get('currentPostContent');
};

Template.authorPage.author = function () {
  return Session.get('currentAuthorPage');
};

Template.authorPage.post = function() {
  return Posts.find({author: Session.get('currentAuthorPage')}, {sort: {time: -1}});
};

Template.authorPage.isLoggedIn = function() {
  if (Meteor.user() !== null)
  {
    if (Meteor.user().services.twitter.screenName === Session.get('currentAuthorPage'))
      return false;
    else
      return true;
  }
  else
    return false;
};
