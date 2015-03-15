Meteor.startup ->
  PostsNeedCommentsController = PostsListController.extend {
    view: 'needcomments'
  }
  Router.route '/needcomments/:limit?', {
    name: 'posts_needcomments'
    controller: PostsNeedCommentsController
  }

viewsMenu.push {
  route: 'posts_needcomments'
  label: 'Need Comments'
}