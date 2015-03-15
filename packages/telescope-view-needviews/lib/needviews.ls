viewParameters.needviews = ->
  return {
    options: {
      find: {url: {$exists: true}}
      sort: {viewCount: 1, clickCount: 1, postedAt: -1}
    }
  }