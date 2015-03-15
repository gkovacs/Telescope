Meteor.startup ->
  export PostsNeedviewsController = PostsListController.extend {
    view: 'needviews'
  }
  Router.route '/needviews/:limit?', {
    name: 'posts_needviews'
    controller: PostsNeedviewsController
  }

viewsMenu.push {
  route: 'posts_needviews'
  label: 'needviews'
  description: 'Posts that need views'
}