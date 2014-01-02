Meteor.Router.add({
  '/' : function(){
    document.title = "Sagacity";
    return 'editor';
  },

  '/tos': 'ToS',

  '/settings': 'settings',

  '/collections/new': 'newCollectionPage',

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

  '/:author/recent': function(author){
    Meteor.subscribe("restrictiveUsers", author);
    Meteor.subscribe("posts",   author);
    if (Meteor.users.find({'services.twitter.screenName': author}).count() !== 0)
    {
      Meteor.Router.to('/' + author + '/' + Posts.findOne({author: escape(author)}, {sort: {time: -1}}).urlsafetitle);
      return 'showPost';
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

  '/collections/:author/:name': function(author, name){
    Meteor.subscribe("ownCollections", Meteor.user());
    Meteor.subscribe("collections", name);
    name = unescape(name);
    if (Collections.find({owner: author, name: name}).count() === 1){
      document.title = name;
      Session.set("currentCollectionTitle", name);
      Session.set("currentCollectionAuthor", author);
      return 'showCollection';
    }
  },

  
  '*' : '404'
});
