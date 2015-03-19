AutoForm.hooks({
  submitPostForm: {

    before: {
      submitPost: function(doc, template) {

        clearSeenMessages()
        if (typeof(disablepostchecks) == 'undefined' || !disablepostchecks) {
          if (doc.url == null) {
            flashMessage('URL is required', 'error')
            window.scrollTo(0, 0)
            return false
          }
          if (doc.url.indexOf('http://crowdresearch.stanford.edu') != 0) {
            flashMessage('URL must start with http://crowdresearch.stanford.edu', 'error')
            window.scrollTo(0, 0)
            return false
          }
          if (doc.title == null) {
            flashMessage('Title is required')
            window.scrollTo(0, 0)
            return false
          }
          var title_words = doc.title.toLowerCase().split('-').join(' ').split('_').join(' ').split('%20').join(' ').split('=').join(' ').split(':').join(' ').split(',').join(' ').split(';').join(' ').split('/').join(' ').split('?').join(' ').split('!').join(' ').split('.').join(' ').split('&').join(' ').split(' ')
          var banned_words = ['milestone', 'crowdresearch', 'trustidea', 'darkhorseidea', 'poweridea', 'yourteamname']
          for (var i = 0; i < banned_words.length; ++i) {
           if (title_words.indexOf(banned_words[i]) != -1) {
              flashMessage('Title should describe the content of your post. Do not include the words Milestone, TrustIdea, PowerIdea, DarkHorseIdea, YourTeamName, or crowdresearch in it.')
              window.scrollTo(0, 0)
              return false
            }
          }
          var checkboxes = $('div.checkbox')
          var categories = []
          for (var i = 0; i < checkboxes.length; ++i) {
            var cur_checkbox = $(checkboxes[i])
            var checkbox_input = cur_checkbox.find('input')
            var checkbox_type = checkbox_input.attr('name')
            if (checkbox_type != 'categories') continue
            if (!checkbox_input.is(':checked')) continue
            var checkbox_text = cur_checkbox.find('label').text().trim()
            categories.push(checkbox_text)
          }
          if (categories.length != 1) {
            flashMessage('Please select exactly 1 category', 'error')
            window.scrollTo(0, 0)
            return false
          }
          if (doc.body == null) {
            flashMessage('Body is required', 'error')
            window.scrollTo(0, 0)
            return false
          }
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