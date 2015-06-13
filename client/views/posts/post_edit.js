AutoForm.hooks({
  editPostForm: {

    before: {
      editPost: function(doc, template) {

        clearSeenMessages()
        if (typeof(disablepostchecks) == 'undefined' || !disablepostchecks) {
          if (doc.url == null) {
            flashMessage('URL is required', 'error')
            window.scrollTo(0, 0)
            return false
          }
          if (doc.url.indexOf('http://crowdresearch.stanford.edu') != 0 && doc.url.indexOf('http://github.com') != 0 && doc.url.indexOf('https://github.com') != 0 && doc.url.indexOf('http://www.github.com') != 0 && doc.url.indexOf('https://www.github.com') != 0 && doc.url.indexOf('http://trello.com') != 0 && doc.url.indexOf('https://trello.com') != 0) {
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
          var orig_post_url = doc.url
          if (Posts != null && Posts.find != null) {
            var orig_post = Posts.findOne({_id: doc._id})
            if (orig_post != null) {
              orig_post_url = orig_post.url
              if (orig_post_url != doc.url) {
                flashMessage('Cannot change URL for posts', 'error')
                return false
              }
            }
          }
        } catch (err) {

        }
        */

        var post = doc;

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          flashMessage(i18n.t('you_must_be_logged_in'), "");
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        // run all post edit client callbacks on post object successively
        post = postEditClientCallbacks.reduce(function(result, currentFunction) {
            return currentFunction(result);
        }, post);

        return post;
      }
    },

    onSuccess: function(operation, post, template) {
      trackEvent("edit post", {'postId': post._id});
      Router.go('post_page', {_id: post._id});
    },

    onError: function(operation, error, template) {
      console.log(error)
      flashMessage(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
      clearSeenMessages();
    }

  }
});

// delete link
Template[getTemplate('post_edit')].events({
  'click .delete-link': function(e){
    var post = this.post;

    e.preventDefault();
    
    if(confirm("Are you sure?")){
      Router.go("/");
      Meteor.call("deletePostById", post._id, function(error) {
        if (error) {
          console.log(error);
          flashMessage(error.reason, 'error');
        } else {
          flashMessage(i18n.t('your_post_has_been_deleted'), 'success');
        }
      });
    }
  }
});