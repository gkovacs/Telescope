Package.describe {summary: "Telescope Need Comments View"}

Package.on_use (api) ->
  api.use ['telescope-lib', 'telescope-base'], ['client', 'server']
  api.add_files ['lib/needcomments.js'], ['client', 'server']
  api.add_files ['lib/client/routes.js'], ['client']
