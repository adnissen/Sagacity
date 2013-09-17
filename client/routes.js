Meteor.Router.add({
  '/' : function(){
    document.title = "Sagacity";
    return 'editor';
  },

  '/tos': 'ToS',

  '/settings': 'settings',

  '/:author': function(author){
    Meteor.subscribe("restrictiveUsers", author);
    Meteor.subscribe("posts", author);
    if (Meteor.users.find({'services.twitter.screenName': author}).count() !== 0)
    {
      Session.set('currentAuthorPage', author);
      document.title = author;
      return 'authorPage';
    }
  },

  '/:author/:title': function(author, title){
    Meteor.subscribe("posts", author);
    if (Posts.find({author: escape(author), urlsafetitle: escape(title)}).count() !== 0)
    {
      Session.set('currentPostAuthor', author);
      Session.set('currentPostTitle', title);
      document.title = title;
      return 'showPost';
    }
    else if (Posts.find({author: escape(author), urlsafetitle: escape(title + ".")}).count() !== 0)
    {
      title = title + ".";
      Session.set('currentPostAuthor', author);
      Session.set('currentPostTitle', title);
      document.title = title;
      return 'showPost';
    }
  },

  
  '*' : '404'
});
