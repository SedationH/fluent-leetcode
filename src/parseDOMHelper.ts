import TurndownService from "turndown"

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
}).keep(["sup"])

export const $: (selectors: string) => HTMLElement = document.querySelector.bind(document)

export const getQuestionMarkdown = () => {
  const questionMarkdownArray = []
  // 表题
  questionMarkdownArray.push(
    `<h1><a href="${window.location.href}">${$("[data-cypress=QuestionTitle]")?.textContent}</a></h1>`
  )
  // 题目描述
  questionMarkdownArray.push("<h2>Description</h2>")
  // 难度
  questionMarkdownArray.push(`<div>Difficulty: <strong>${$("[data-degree]")?.textContent}</strong></div>`)
  // 类型
  const $tags = $("[class^=topic-tags]")
  if ($tags) {
    const tagsMarkdownArray = []
    $tags.childNodes.forEach((node) => {
      // TODO: 下次看看怎么把这个类型转换的问题解决掉
      tagsMarkdownArray.push(`<a href="${(node as HTMLLinkElement).href}">${node.textContent}</a>`)
    })
    questionMarkdownArray.push(`<div>Related Topics: ${tagsMarkdownArray.join(", ")}</div>`)
  }
  // 题目内容
  const content = $("[class=notranslate]")
    .innerHTML.replace(/\<pre\>/g, "<pre><code>")
    .replace(/\<\/pre\>/g, "</code></pre>")
  questionMarkdownArray.push(content)
  return questionMarkdownArray.map(turndownService.turndown.bind(turndownService)).join("\n\n")
}

export const getAnswerMarkdown = async () => {
  const language = $("#lang-select").textContent
  try {
    const answer = await navigator.clipboard.readText()
    return [
      `<div>Language: <strong>${language}</strong></div>`,
      `<pre><code class="language-${language}">${answer}</code></pre>`,
    ]
      .map(turndownService.turndown.bind(turndownService))
      .join("\n\n")
  } catch (error) {
    console.log(error, "用户没有授权")
    throw new Error("用户没有授权")
  }
}
