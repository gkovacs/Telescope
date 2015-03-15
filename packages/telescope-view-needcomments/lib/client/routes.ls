Meteor.startup ->
  export PostsNeedcommentsController = PostsListController.extend {
    view: 'needcomments'
  }
  Router.route '/needcomments/:limit?', {
    name: 'posts_needcomments'
    controller: PostsNeedcommentsController
  }

viewsMenu.push {
  route: 'posts_needcomments'
  label: 'needcomments'
  description: 'Posts that need comments'
}