AUTHOR = 'Simon Popelier'
SITENAME = 'The Lanterns'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'Europe/Paris'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
AUTHOR_BIO='Data Scientist and graph lover.'

# Blogroll
LINKS = (('GitHub', 'https://github.com/SimonPop'),
         ('LinkedIn', 'https://www.linkedin.com/in/simon-popelier/'),
         )

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

THEME = 'themes/svbtle'
OUTPUT_PATH = 'output'

STATIC_PATHS = ['imgs', 'extra']
EXTRA_PATH_METADATA = {'extra/lantern.ico': {'path': 'favicon.ico'}}

PLUGIN_PATHS = ['plugins']
PLUGINS = ['pelican-js', 'render_math'] # You may have more plugins
