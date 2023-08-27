# Auto Post Bot

## Description

This bot automates social media posts. It's capable of posting from a list of predefined Posts, generating new Posts
using OpenAI and Wikipedia, and posting from an RSS feed. 


It's built on Electron, Puppeteer, and Node.js.

Currently, instead of the Twitter API, it uses Puppeteer to automate the Twitter website. This means that it can be used
with any Twitter account, and it can be used to post Posts with images (once that is implemented). It also means that
it's not limited by the Twitter API rate limits or fees. This is against Twitter's terms of service, so use at your own
risk.

It moves the mouse around randomly to avoid detection by Twitter's bot detection system. It also uses a random delay
between Posts to avoid detection. The delay is configurable via environment variables.

Multiple plugins can be enabled, and each plugin has a chance of being used. For example, you can enable the `Wikipedia`
plugin with a 80% chance of being used, and the `RSSFeed` plugin with a 20% chance of being used.

TODO: posting images, and possibly videos.
TODO: add support for posting from other sources, such as Reddit, and possibly
other social media platforms.
TODO: add support for using the Twitter API instead of Puppeteer.
TODO: add support for posting to other social media platforms, such as Facebook, Instagram, etc.

## Requirements

- Node.js
- pnpm, yarn or npm

## Running on macOS/dev mode

You will need to install chromium:

```bash
brew install chromium
```

and set the `PUPPETEER_EXEC_PATH` environment variable to the path of the chromium executable, on an M1 Mac this will
be:

```bash
PUPPETEER_EXEC_PATH="/opt/homebrew/bin/chromium"
```

## Running on Linux (headless w/ Xvfb)

You will need to install chromium:

```bash
sudo apt install chromium-browser
``` 

and set the `PUPPETEER_EXEC_PATH` environment variable to the path of the chromium executable:

```bash
PUPPETEER_EXEC_PATH="/usr/bin/chromium-browser"
``` 

You will also need to install Xvfb:

```bash
sudo apt install xvfb
``` 

and run the bot using the following command (this is already done in the `start` script in `package.json`):

```bash
xvfb-run electron -r ts-node/register main.ts
```

## Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory and set up the environment variables:

   ```env
   TWITTER_USERNAME=username
   TWITTER_PASSWORD=pw
   Post_MIN_DELAY_HOURS=0.5
   Post_MAX_DELAY_HOURS=5
   
   WIKIPEDIA_LANG=en
   WIKIPEDIA_CATEGORIES="Technology,Science,Philosophy,Mythology,Mathematics,Music,Computing,Engineering,Communication,Education,Weather,Energy,Materials,Chemistry,Physics,Biology,Earth,Space,Universe"
   OPENAI_KEY=sk-eoirgheorihgoiwerhgoiehwrgoihwreoghj
   PUPPETEER_EXEC_PATH="/opt/homebrew/bin/chromium"
   #PUPPETEER_EXEC_PATH="/usr/bin/chromium-browser" // on linux
   OPENAI_INITIAL_PROMPT="Generate a 200 character Post like one of these:
   
   "Wow this is a great article about Pizza #PIZZAPARTY"
   "What's for dinner? Pizza, obviously. #CowabungaDude"
   "I love pizza. It's the best food ever. #PizzaIsLife"
   
   Make them sound like they were written by a ninja turtle. Don't use @mentions, the Posts should be about the following:
   "
   
   ENABLED_PLUGINS="FileBased:0.1,Wikipedia:0.9"
   RSS_FEED_URL=https://website.com/feed/

   ```

## Running the Bot

Run the bot using the following command:

```bash
pnpm start
```

## Features

### Environment Variables

You can control several aspects of the bot via environment variables in the `.env` file:

- `TWITTER_USERNAME` and `TWITTER_PASSWORD`: Twitter login details.
- `Post_MIN_DELAY_HOURS` and `Post_MAX_DELAY_HOURS`: Time delay in hours between Posts.
- `WIKIPEDIA_LANG` and `WIKIPEDIA_CATEGORIES`: Wikipedia settings for fetching random articles.
- `OPENAI_KEY`: API key for OpenAI.
- `PUPPETEER_EXEC_PATH`: Path to Chromium executable.
- `OPENAI_INITIAL_PROMPT`: Initial prompt for generating Posts via OpenAI.
- `ENABLED_PLUGINS`: Comma separated list of plugins to enable, with their chance of being used. For example:
  `Wikipedia:0.8,RSSFeed:0.2` will enable the `Wikipedia` plugin with a 80% chance of being used,
  and the `RSSFeed` plugin with a 20% chance of being used. Options are `Wikipedia`, `RSSFeed`, or `FileBased`
- `RSS_FEED_URL`: URL of the RSS feed to use with the `RSSFeed` plugin.

### Plugin: FileBased

Post from a list of predefined Posts. You can add new Posts by adding a new JSON file to the
`Posts` directory. The JSON file should contain an object of the following format:

```json
{
  "1": "This is a Post.",
  "2": "This is another Post."
}
```

The keys are used to reference the Posts in the bot's internal database. You can add as many Posts as you like to a
single JSON file, and you can add as many JSON files as you like to the `Posts` directory. The bot will pick a random
Post from the database and Post it. The bot will not Post the same Post twice, unless you delete
the `sent-Posts.txt` file in the root directory.

### Plugin: Wikipedia

Post a random article from Wikipedia. You can control the language and categories of the articles via the environment.
OpenAI will be used to generate a Post based on the article's content.

### Plugin: RSSFeed

Post a random article from an RSS feed. You can control the URL of the RSS feed via the environment.
Posted posts will be saved in the `sent-posts.txt` file in the root directory, so they will not be Posted again.

