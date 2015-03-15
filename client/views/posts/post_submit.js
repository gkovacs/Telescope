AutoForm.hooks({
  submitPostForm: {

    before: {
      submitPost: function(doc, template) {

        if (doc.url == null) {
          flashMessage('URL is required', 'error')
          return false
        }
        if (doc.url.indexOf('http://crowdresearch.stanford.edu') != 0) {
          flashMessage('URL must start with http://crowdresearch.stanford.edu', 'error')
          return false
        }
        /*
        try {
          var duplicate_post = null
          if (Posts != null && Posts.findOne != null) {
            duplicate_post = Posts.findOne({url: doc.url}).fetch()
          }
          if (duplicate_post != null && duplicate_post._id != null && duplicate_post._id.length > 0) {
            flashMessage('Already posted at http://' + window.location.host + '/posts/' + duplicate_post._id)
            return false
          }
        } catch (err) {

        }
        */

        template.$('button[type=submit]').addClass('loading');

        var post = doc;

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          flashMessage(i18n.t('you_must_be_logged_in'), 'error');
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        // run all post submit client callbacks on properties object successively
        post = postSubmitClientCallbacks.reduce(function(result, currentFunction) {
            return currentFunction(result);
        }, post);

        return post;
      }
    },

    onSuccess: function(operation, post, template) {
      template.$('button[type=submit]').removeClass('loading');
      trackEvent("new post", {'postId': post._id});
      Router.go('post_page', {_id: post._id});
      if (post.status === STATUS_PENDING) {
        flashMessage(i18n.t('thanks_your_post_is_awaiting_approval'), 'success');
      }
    },

    onError: function(operation, error, template) {
      template.$('button[type=submit]').removeClass('loading');
      flashMessage(error.message.split('|')[0], 'error'); // workaround because error.details returns undefined
      clearSeenMessages();
      // $(e.target).removeClass('disabled');
      if (error.error == 603) {
        var dupePostId = error.reason.split('|')[1];
        Router.go('post_page', {_id: dupePostId});
      }
    }

  }
});