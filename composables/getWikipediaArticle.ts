import axios from "axios"
import * as cheerio from "cheerio"
import * as url from "url"


export const getRandomWikipediaArticle = async (categories: string[]) => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    console.log(`Random Category: ${randomCategory}`)
    const articleURL = await getWikipediaArticleFromCategory(randomCategory)
    if (!articleURL) {
        return null
    }
    const article = await getArticleFromURL(articleURL)
    if (!article) {
        return null
    }
    return {body: article, url: articleURL, category: randomCategory, title: getArticleTitleFromURL(articleURL)}
}

export const getWikipediaArticleFromCategory = async (category: string) => {
    try {
        // Make an API request to get a list of pages in the category
        const response = await axios.get("https://en.wikipedia.org/w/api.php", {
            params: {
                action: "query",
                list: "categorymembers",
                cmtitle: `Category:${category}`,
                cmlimit: 500, // you can adjust this limit
                format: "json",
            },
        })

        const pages = response.data.query.categorymembers

        // Filter out pages that are not articles (namespace 0 is for articles)
        const articles = pages.filter((page: any) => page.ns === 0)

        if (articles.length === 0) {
            console.log("No articles found.")
            return
        }

        // Randomly select an article
        const randomArticle = articles[Math.floor(Math.random() * articles.length)]

        // Create the URL for the article
        const articleURL = `https://en.wikipedia.org/wiki/${encodeURIComponent(randomArticle.title)}`
        console.log(`Random Article URL: ${articleURL}`)

        return articleURL
    } catch (error) {
        console.error(`Failed to get articles: ${error}`)
    }

    return null
}
export const getArticleTitleFromURL = (articleURL: string) => {
    const parsedURL = url.parse(articleURL)
    const title = decodeURIComponent(parsedURL.pathname?.split("/wiki/")[1] || "")

    if (!title) {
        console.error("Invalid Wikipedia URL")
        return null
    }

    return title
}
export const getArticleFromURL = async (articleURL: string) => {
    const title = getArticleTitleFromURL(articleURL)
    try {
        const response = await axios.get("https://en.wikipedia.org/w/api.php", {
            params: {
                action: "parse",
                page: title,
                format: "json",
                prop: "text",
                disabletoc: true, // disables table of contents in the output
            },
        })

        const htmlContent = response.data.parse.text["*"]
        const $ = cheerio.load(htmlContent)

        // get text all content from html, filter out unwanted elements, remove references
        let body = $(".mw-parser-output")
            .children("p,  h2, h3, h4, h5, h6, blockquote, pre")
            .not("#See_also, #References, #External_links, #Further_reading, #Notes, .mw-empty-elt, .mw-editsection, .toc, .thumb, .tright, .infobox, .navbox, .vertical-navbox, .mw-jump-link, .mw-references-wrap, .mw-references-wrap, .mw-cite-backlink, .mw-editsection-bracket, .mw-editsection-divider, .mw-editsection-like, .mw-editsection-like")
            .text()
            .replace(/\[\d+\]/g, "")
            .replace(/\[\w+\]/g, "")

        return body

    } catch (error) {
        console.error(`Failed to get article body: ${error}`)
        return null
    }
}

