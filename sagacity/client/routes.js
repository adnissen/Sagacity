Meteor.Router.add({
  '/' : 'editor',

  '/:author': function(author){
    if (Meteor.users.find({'services.twitter.screenName': author}).count() !== 0)
    {
      Session.set('currentAuthorPage', author);
      return 'authorPage';
    }
    else
      return '404';
  },

  '/:author/:title': function(author, title){
    if (Posts.find({author: escape(author), urlsafetitle: escape(title)}).count() !== 0)
    {
      console.log("page found");
      Session.set('currentPostAuthor', author);
      Session.set('currentPostTitle', title);
      return 'showPost';
    }
    else
      return '404';
  },

  '*' : '404'
});