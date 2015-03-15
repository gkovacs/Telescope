Meteor.startup ->
  PostsNeedViewsController = PostsListController.extend {
    view: 'needviews'
  }
  Router.route '/needviews/:limit?', {
    name: 'posts_needviews'
    controller: PostsNeedViewsController
  }

viewsMenu.push {
  route: 'posts_needviews'
  label: 'Need Views'
}