require 'dotenv'
require 'active_support/core_ext/string/strip'
require 'active_support/core_ext/string/inflections'
I18n.enforce_available_locales = true

task default: :build

def configs
  configs = ['_config.yml']
  if env = ENV['JEKYLL_ENV']
    configs << "_config.#{env}.yml"
  end
  configs.join(',')
end

desc 'build jekyll site'
task build: :env do
  system('jekyll', 'build', '-c', configs)
end

desc 'start server'
task server: :env do
  puts "Starting server for #{ENV['JEKYLL_ENV']}"
  system('jekyll', 'serve', '-w', '-c',configs)
end

namespace :new do
  def ask(label)
    print "#{label}: "
    input = $stdin.gets

    if input
      input.strip!
      input.empty? ? nil : input
    else
      exit(1)
    end
  end

  def input(label)
    begin
      input = ask(label)
    end until input

    input
  end

  def post_template(title, author, github)
    <<-TEMPLATE.strip_heredoc
      ---
      layout: blog
      title: "#{title}"
      author: "#{author}"
      description: ""
      gh-author: #{github}
      categories: blog
      ---

      ## Your subtitle

      And content.
    TEMPLATE
  end

  desc 'create new post'
  task :post do
    title = input('Title')
    author = input('Author')
    github = input('GitHub')


    posts = Pathname.new('_posts')

    filename = title.parameterize
    date = Date.today.to_s

    post = [date, filename].join('-') + '.md'

    post = posts.join(post)
    post.open 'w' do |file|
      file.puts post_template(title, author, github)
    end

    puts "Created #{post}"
  end
end

task :env do
  env = ENV['JEKYLL_ENV'] ||= 'development'
  Dotenv.load('.env', ".env.#{env}")
end

task :production do
  ENV['JEKYLL_ENV'] = 'production'
  Rake::Task['env'].invoke
end

task :preview do
  ENV['JEKYLL_ENV'] = 'preview'
  Rake::Task['env'].invoke
end

namespace :setup do
  task production: 'rake:production' do
    system('s3_website', 'cfg', 'apply')
  end

  task preview: 'rake:preview' do
    system('s3_website', 'cfg', 'apply')
  end
end

namespace :deploy do
  desc 'push site to preview'
  task preview: ['rake:preview', :build] do
    system('s3_website', 'push')
  end

  desc 'push site to production'
  task production: ['rake:production', :build] do
    system('s3_website', 'push')
  end
end

namespace :test do
  desc 'druy run deploy'
  task production: ['rake:production', :build] do
    system('s3_website', 'push', '--dry-run')
  end

  desc 'druy run deploy'
  task preview: ['rake:preview', :build] do
    system('s3_website', 'push', '--dry-run')
  end
end
