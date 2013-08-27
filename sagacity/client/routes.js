Meteor.Router.add({
  '/' : 'editor',

  '/:author/:title': function(author, title){
    if (Posts.find({author: escape(author), urlsafetitle: escape(title)}).count() !== 0)
    {
      console.log("page found");
      Session.set('currentPostAuthor', author);
      Session.set('currentPostTitle', title);
      return 'showPost';
    }
    else
      Meteor.Router.to('/');
  }
});