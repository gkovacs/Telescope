viewParameters.needcomments = ->
  return {
    options: {
      find: {url: {$exists: true}}
      sort: {commentCount: 1, viewCount: 1, clickCount: 1, postedAt: -1}
    }
  }