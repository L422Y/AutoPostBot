
<div align="center">
<h1 align="center">
<br>AutoPostBot
</h1>
<h3></h3>Automate, Innovate, Postulate!</h3>

<p align="center">
<img src="https://img.shields.io/badge/Axios-5A29E4.svg?style&logo=Axios&logoColor=white" alt="Axios" />
<img src="https://img.shields.io/badge/Electron-47848F.svg?style&logo=Electron&logoColor=white" alt="Electron" />
<img src="https://img.shields.io/badge/Puppeteer-40B5A4.svg?style&logo=Puppeteer&logoColor=white" alt="Puppeteer" />
<img src="https://img.shields.io/badge/tsnode-3178C6.svg?style&logo=ts-node&logoColor=white" alt="tsnode" />
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style&logo=TypeScript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Markdown-000000.svg?style&logo=Markdown&logoColor=white" alt="Markdown" />
<img src="https://img.shields.io/badge/JSON-000000.svg?style&logo=JSON&logoColor=white" alt="JSON" />
</p>
<img src="https://img.shields.io/github/languages/top/l422y/AutoPostBot?style&color=5D6D7E" alt="GitHub top language" />
<img src="https://img.shields.io/github/languages/code-size/l422y/AutoPostBot?style&color=5D6D7E" alt="GitHub code size in bytes" />
<img src="https://img.shields.io/github/commit-activity/m/l422y/AutoPostBot?style&color=5D6D7E" alt="GitHub commit activity" />
<img src="https://img.shields.io/github/license/l422y/AutoPostBot?style&color=5D6D7E" alt="GitHub license" />
</div>



## 📍 Overview

AutoPostBot is designed to automate the process of generating and posting content to different social media platforms. It achieves this by providing a framework for integrating generator and destination plugins. Generator plugins handle the generation of content, while destination plugins handle posting to specific platforms. The project's value proposition lies in its ability to streamline the content creation and posting process, saving time and effort for social media managers and individuals looking to automate their content strategy.

---

## ✨ Features

### ⚙️ Architecture
- Follows a modular architecture with generator and destination plugins.
- Abstracts the logic for generating and sending posts, allowing for easy extensibility and customization.

### 🔗 Dependencies
- Relies on external libraries such as OpenAI, Puppeteer, and Twitter API.
- Adds additional functionality and integration capabilities to the system.

### 🧩 Modularity
- Adopts a modular approach by implementing generator and destination plugins.
- Enables flexibility in adding new sources for post generation and destinations for posting.
- Promotes code reusability through the use of composables.

### 🔌 Integrations
- Integrates with multiple external systems like OpenAI, Puppeteer (for Twitter automation), and Twitter APIv2.
- Enhances the system's capabilities, allowing it to interact with various platforms.

### 📶 Scalability
- Has the potential for scalability due to its modular architecture.
- Easily accommodates growth and handles increased requirements by adding new generator and destination plugins.

---

## 🧩 Modules

<details closed><summary>Root</summary>

| File                                                              | Summary                                                                                                                                                                                             |
| ---                                                               | ---                                                                                                                                                                                                 |
| [main.ts](https://github.com/l422y/AutoPostBot/blob/main/main.ts) | The code sets up an AutoPostBot that can be used to automate posting tasks. It listens for app readiness and initializes the bot. It also handles SIGINT and SIGTERM signals for graceful shutdown. |

</details>

<details closed><summary>Composables</summary>

| File                                                                                              | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---                                                                                               | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [useOpenAI.ts](https://github.com/l422y/AutoPostBot/blob/main/composables/useOpenAI.ts)           | This code snippet is responsible for generating a social media post using an AI language model from OpenAI. It retrieves an initial prompt from the environment variables and validates the OpenAI API key. It then sends a request to the OpenAI API to generate the content of the post based on the provided input. The generated content is limited to 200 characters, and if it exceeds 280 characters, it is condensed further. The generated post is then returned. There is also a commented-out function for generating images using the OpenAI API. |
| [useRandomDelay.ts](https://github.com/l422y/AutoPostBot/blob/main/composables/useRandomDelay.ts) | The code snippet defines a function that generates a random delay between a specified minimum and maximum value. The function uses Math.random() to generate a random number within the provided range and returns the value.                                                                                                                                                                                                                                                                                                                                 |
| [useWikipedia.ts](https://github.com/l422y/AutoPostBot/blob/main/composables/useWikipedia.ts)     | The provided code snippet includes functionalities to fetch a random Wikipedia article based on specified categories. The code selects a random category from the given list, retrieves a list of pages from that category, filters out non-article pages, and randomly selects an article URL. It then fetches the article body by parsing the HTML content of the article page and filtering out unwanted elements and references. The final result includes the article body, URL, category, and title.                                                    |
| [useMouseHelper.ts](https://github.com/l422y/AutoPostBot/blob/main/composables/useMouseHelper.ts) | This code snippet provides a mouse helper functionality for debugging purposes. It injects a box into the page that moves with the mouse cursor. It exposes functions to get and set the mouse position. It also captures mouse events and updates the position of the box accordingly. The box's appearance changes based on the mouse button pressed.                                                                                                                                                                                                       |
| [useMoveToClick.ts](https://github.com/l422y/AutoPostBot/blob/main/composables/useMoveToClick.ts) | The code snippet defines a function called useMoveToClick that moves the mouse pointer to a specified element on a web page and clicks on it. It calculates the start and end coordinates for the movement, divides it into multiple small steps, and then performs the movement with a small delay between each step. Finally, it triggers a click event on the element's coordinates. The getRandom function is a helper function that generates a random number within a specified range.                                                                  |

</details>

<details closed><summary>Posts</summary>

| File                                                                                                          | Summary                                                                                                                                                                                                           |
| ---                                                                                                           | ---                                                                                                                                                                                                               |
| [example-posts.json.example](https://github.com/l422y/AutoPostBot/blob/main/posts/example-posts.json.example) | The provided code snippet contains a JSON object with key-value pairs representing humorous programming-related quotes. Each key represents the quote number, while the value represents the actual quote itself. |

</details>

<details closed><summary>Types</summary>

| File                                                                                                | Summary                                                                                                                                                                                                                                                                                                                                     |
| ---                                                                                                 | ---                                                                                                                                                                                                                                                                                                                                         |
| [IGeneratorPlugin.ts](https://github.com/l422y/AutoPostBot/blob/main/types/IGeneratorPlugin.ts)     | The code snippet defines an interface "IGeneratorPlugin" with properties "chance" and "name" representing chances of occurrence and name respectively. It also includes methods "generatePost()" and "confirmPostSent()" which return promises for generating posts and confirming their delivery. The "log()" method logs given arguments. |
| [IDestinationPlugin.ts](https://github.com/l422y/AutoPostBot/blob/main/types/IDestinationPlugin.ts) | The code snippet defines an interface called IDestinationPlugin with a set of core functionalities including initializing the plugin, sending a post, and logging information.                                                                                                                                                              |

</details>

<details closed><summary>Generators</summary>

| File                                                                                           | Summary                                                                                                                                                                                                                                                                                                                                                                          |
| ---                                                                                            | ---                                                                                                                                                                                                                                                                                                                                                                              |
| [RSSFeed.ts](https://github.com/l422y/AutoPostBot/blob/main/plugins/generators/RSSFeed.ts)     | The provided code snippet is an RSSFeed class that extends a BaseGeneratorPlugin class. Its core functionality includes parsing an RSS feed, retrieving and storing post data, generating a random unsent post, confirming sent posts, and refreshing the list of available posts.                                                                                               |
| [FileBased.ts](https://github.com/l422y/AutoPostBot/blob/main/plugins/generators/FileBased.ts) | The provided code snippet is for a class called "FileBased" that extends the "BaseGeneratorPlugin" class. It represents a plugin that generates posts based on data stored in files. The code loads posts from a directory, selects a random post that hasn't been sent before, and keeps track of sent posts. The plugin also writes sent posts to a file for future reference. |
| [Wikipedia.ts](https://github.com/l422y/AutoPostBot/blob/main/plugins/generators/Wikipedia.ts) | The code snippet defines a class called Wikipedia that extends a BaseGeneratorPlugin. It provides a method to generate a random Wikipedia article and then uses another function to generate a post based on the article's content. The generated post is then returned as a string.                                                                                             |

</details>

<details closed><summary>Destinations</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                                                                                                                                                                          |
| ---                                                                                                            | ---                                                                                                                                                                                                                                                                                                                                                              |
| [TwitterPuppeteer.ts](https://github.com/l422y/AutoPostBot/blob/main/plugins/destinations/TwitterPuppeteer.ts) | The provided code snippet is implementing the TwitterPuppeteer class, which is a plugin used for automating interactions with the Twitter website using Puppeteer. It includes functionalities such as initializing Puppeteer with specific options, logging in to a Twitter account, deleting singleton files, sending posts, and simulating human-like typing. |
| [TwitterAPIv2.ts](https://github.com/l422y/AutoPostBot/blob/main/plugins/destinations/TwitterAPIv2.ts)         | The code snippet is a TypeScript class that extends a base destination plugin. It creates a Twitter v2 API client and provides a method to send a post. It uses environment variables for app key, app secret, access token, and access secret.                                                                                                                  |

</details>

<details closed><summary>Lib</summary>

| File                                                                                                    | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---                                                                                                     | ---                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| [BaseGeneratorPlugin.ts](https://github.com/l422y/AutoPostBot/blob/main/lib/BaseGeneratorPlugin.ts)     | The provided code snippet defines a class called BaseGeneratorPlugin, which implements the IGeneratorPlugin interface. The class has properties like chance and name, and it can be initialized with an optional options object. It also has methods for generating a post, confirming that a post has been sent, and logging messages.                                                                                                         |
| [AutoPostBot.ts](https://github.com/l422y/AutoPostBot/blob/main/lib/AutoPostBot.ts)                     | This code snippet defines a class called AutoPostBot that automates the process of generating and posting content to different destinations (e.g., social media platforms). It loads generator and destination plugins based on configuration, randomly selects a generator plugin, generates a post using that plugin, sends the post to the configured destinations, and repeats the process at a random time within a specified delay range. |
| [BaseDestinationPlugin.ts](https://github.com/l422y/AutoPostBot/blob/main/lib/BaseDestinationPlugin.ts) | The code snippet defines a base class for destination plugins. It implements the IDestinationPlugin interface and provides core functionalities such as initialization, sending post content, confirming post sent, and logging.                                                                                                                                                                                                                |

</details>

<details closed><summary>Variables</summary>

| File                                                                                          | Summary                                                                                                                                                                                                                              
| ---                                                                                           |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| [.env.example](.env.example)                                                                 | The provided code snippet is an example of an environment file. It contains environment variables for enabling generator and destination plugins, setting up the Twitter and OpenAI API keys, configuring the Wikipedia plugin, etc. |

</details>

---



## Requirements

- Node.js (I use `ts-node` to run the bot, but you can compile it to JavaScript if you want)
- pnpm, yarn or npm
- OpenAI API key if you want to use the Wikipedia plugin
- Twitter API keys (with read and write access) if you want to use the TwitterAPIv2 plugin
- If you want to run the bot with puppeteered destinations: Xvfb/Chromium/Electron


### Notes for running with puppeteered destinations

#### macOS
>If you are using a puppeteer plugin, You will need to install chromium using `brew install chromium` and set the `PUPPETEER_EXEC_PATH` environment variable to the path of the chromium executable, on an M1 Mac this will
be:
`PUPPETEER_EXEC_PATH="/opt/homebrew/bin/chromium"`

#### Linux (headless w/ Xvfb) (tested on Ubuntu Desktop on OrangePi 5+)

>You will need to install chromium:
`sudo apt install chromium-browser` and set the `PUPPETEER_EXEC_PATH` environment variable to the path of the chromium executable: `PUPPETEER_EXEC_PATH="/usr/bin/chromium-browser"` 
>
> You will also need to install Xvfb:
>
>```bash
>sudo apt install xvfb
>``` 
>
>Run the bot using the following command (this is already done in the `start-electron` script in `package.json`):
>
>```bash
>xvfb-run electron -r ts-node/register main.ts
>```

## 📝 Setup

1. Clone the repository.

   ```bash
   git clone https://github.com/l422y/AutoPostBot.git
   ```
   
2. Install dependencies:

   ```bash
   cd AutoPostBot
   pnpm i
   ```

3. Copy `.env.example` to `.env` and set up the environment variables


### 💾 Environment Variables


#### Global Settings
- `POST_MIN_DELAY_HOURS` and `POST_MAX_DELAY_HOURS`: Time delay in hours between posts.
- `ENABLED_DESTINATIONS`: Platforms where the posts will be published. For example, `TwitterAPIv2`.
- `ENABLED_GENERATORS`: Comma-separated list of content generators and their probabilities. For example, `FileBased:0.1,Wikipedia:0.9`.

```env
POST_MIN_DELAY_HOURS=0.5
POST_MAX_DELAY_HOURS=5
ENABLED_DESTINATIONS="TwitterAPIv2"
ENABLED_GENERATORS="FileBased:0.1,Wikipedia:0.9"
```

#### RSS Plugin
- `RSS_FEED_URL`: URL of the RSS feed to use with the content generator.

```env
RSS_FEED_URL=https://website.com/feed/
```

#### TwitterPuppeteer Plugin
- `TWITTER_USERNAME` and `TWITTER_PASSWORD`: Twitter login details.
- `PUPPETEER_EXEC_PATH`: Path to the Chromium executable. On macOS, it's `/opt/homebrew/bin/chromium`, and on Linux, it's `/usr/bin/chromium-browser`.

```env
TWITTER_USERNAME=username
TWITTER_PASSWORD=pw
PUPPETEER_EXEC_PATH="/opt/homebrew/bin/chromium"
#PUPPETEER_EXEC_PATH="/usr/bin/chromium-browser" // on linux
```

#### TwitterAPIv2 Plugin
- `TWITTER_APP_KEY`, `TWITTER_APP_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_TOKEN_SECRET`: Twitter API keys and tokens for OAuth. These can be generated by creating a Twitter developer account and creating an app with read and write access.

```env
TWITTER_APP_KEY=__TWITTER_APP_KEY__
TWITTER_APP_SECRET=__TWITTER_APP_SECRET__
TWITTER_ACCESS_TOKEN=__TWITTER_ACCESS_TOKEN__
TWITTER_ACCESS_TOKEN_SECRET=__TWITTER_ACCESS_TOKEN_SECRET__
```

#### Wikipedia Plugin with OpenAI
- `WIKIPEDIA_LANG` and `WIKIPEDIA_CATEGORIES`: Wikipedia language and category preferences.
- `OPENAI_KEY`: API key for OpenAI.
- `OPENAI_INITIAL_PROMPT`: Initial prompt for generating posts via OpenAI, along with specific guidelines.


```env
WIKIPEDIA_LANG=en
WIKIPEDIA_CATEGORIES="Technology,Science,Philosophy,Mythology,Mathematics,Music,Computing,Engineering,Communication,Education,Weather,Energy,Materials,Chemistry,Physics,Biology,Earth,Space,Universe"
OPENAI_KEY=sk-eoirgheorihgoiwerhgoiehwrgoihwreoghj
OPENAI_INITIAL_PROMPT="Generate a 200 character Post like one of these:

`New electronic waste from discarded gadgets makes up for 70% of all toxic waste. Let's consider recycling and upcycling our tech to create a healthier environment for us all.`
`In the realm of technology, the first alarm clock could only ring at 4am! Created by Levi Hutchins in 1787, its sole purpose was to wake him for his pre-dawn job. Truly an early bird that transformed the way we start our days.`
`The first computer mouse was made of wood! Created by Douglas Engelbart in 1964, it was a simple wooden shell with two metal wheels. It was later patented in 1970.`

Do not make it a question, avoid using or featuring gender or politics, do not use phrases like `Did you know`. The simple Post should include a single interesting fact about the following:"

```


## 🚦 Running the Bot

Run the bot using the following command:

```bash
pnpm start
```
or, if using a puppeteer plugin:
```bash
pnpm start-electron
```


If you make updates to plugins, you will need to rebuild the project:

```bash
pnpm build
```
or watch the project for changes:
```bash
pnpm watch
```




## 🔌 Generator Plugins

Generator plugins are used to generate Posts. You can enable/disable generator plugins via the `ENABLED_GENERATORS`

### \> FileBased

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

### \> Wikipedia

Post a random article from Wikipedia. You can control the language and categories of the articles via the environment.
OpenAI will be used to generate a Post based on the article's content.

### \> RSSFeed

Post a random article from an RSS feed. You can control the URL of the RSS feed via the environment.
Posted posts will be saved in the `sent-posts.txt` file in the root directory, so they will not be Posted again.

## 🔌 Destinations Plugins

Destination plugins are used to Post content to a destination. You can enable/disable destination plugins via the `ENABLED_DESTINATIONS` environment variable.

You can also control the chance of a destination plugin being used by adding a colon and a number after the plugin name. For example, `TwitterAPIv2:0.5` will enable the `TwitterAPIv2` plugin and give it a 50% chance of being used.

### \> TwitterAPIv2

Post content to Twitter using the Twitter API v2. You will need to set up a Twitter developer account and create an app to get the required keys.

### \> TwitterPuppeteer

Post content to Twitter using Puppeteer. This plugin will open a browser window and log in to Twitter using your username and password. It will then Post the content and close the browser window. This plugin is not recommended for use in production, as it is not very reliable and may be detected by Twitter as a bot. Use at your own risk.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for more information.

## 🤝 Contributing
Contributions are always welcome! Please follow these steps:
1. Fork the project repository. This creates a copy of the project on your account that you can modify without affecting the original project.
2. Clone the forked repository to your local machine using a Git client like Git or GitHub Desktop.
3. Create a new branch with a descriptive name (e.g., `new-feature-branch` or `bugfix-issue-123`).
```sh
git checkout -b new-feature-branch
```
4. Make changes to the project's codebase.
5. Commit your changes to your local branch with a clear commit message that explains the changes you've made.
```sh
git commit -m 'Implemented new feature.'
```
6. Push your changes to your forked repository on GitHub using the following command
```sh
git push origin new-feature-branch
```
7. Create a new pull request to the original project repository. In the pull request, describe the changes you've made and why they're necessary.
   The project maintainers will review your changes and provide feedback or merge them into the main branch.

---
## 📜 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).

- **Attribution**: You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- **NonCommercial**: You may not use the material for commercial purposes.

For more details, refer to the [`LICENSE`](./LICENSE) file in this repository, or check the [Creative Commons CC BY-NC 4.0 page](https://creativecommons.org/licenses/by-nc/4.0/).

### Commercial Use

For commercial licensing options, please contact the author.
