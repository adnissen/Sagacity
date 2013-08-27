Posts = new Meteor.Collection("posts");

Meteor.publish("directory", function(){
  return Meteor.users.find({_id: this.userId}, {fields: {'services': 1}});
});

Meteor.publish("posts", function() {
  return Posts.find();
});

Meteor.methods({
  publishPost: function(_title, _content){
    if (Meteor.user() !== null)
    {
      var _author = Meteor.user()._id;
      var time = new Date();
      var timestamp = time.getTime();
      Posts.insert({title: _title, urlsafetitle: encode(_title), content: _content, author: _author, time: timestamp});
    }
  }
});