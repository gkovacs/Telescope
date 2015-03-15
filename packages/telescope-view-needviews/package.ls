Package.describe {summary: "Telescope Need Views View"}

Package.on_use (api) ->
  api.use ['telescope-lib', 'telescope-base'], ['client', 'server']
  api.add_files ['lib/needviews.js'], ['client', 'server']
  api.add_files ['lib/client/routes.js'], ['client']
