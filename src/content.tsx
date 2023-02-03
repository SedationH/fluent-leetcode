import ReactDOM from "react-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import classNames from "classnames"
import { useState } from "react"
import { getAnswerMarkdown, getQuestionMarkdown } from "./parseDOMHelper"
import style from "./content.module.less"

const $fluentLeetcodeRoot = document.createElement("div")
$fluentLeetcodeRoot.id = "fluent-leetcode-root"
document.body.append($fluentLeetcodeRoot)

const getAnswerMarkdownWithToast = async () => {
  try {
    return await getAnswerMarkdown()
  } catch (error) {
    toast.error("答案复制失败, 请授予 Clipboard 相关权限", {
      autoClose: 1000,
    })
    throw new Error(error)
  }
}

const App = () => {
  const [isHide, setIsHide] = useState(false)
  return (
    <div>
      <div className={style["app"]}>
        <div className={classNames("action-wrapper", isHide && "hide")}>
          <button
            onClick={async () => {
              const questionMarkdown = getQuestionMarkdown()
              await navigator.clipboard.writeText(questionMarkdown)
              toast.success("「题目」复制成功", {
                autoClose: 1000,
              })
            }}
          >
            复制题目
          </button>
          <div className="tip">Tip: 「复制答案」和 「复制题目和答案」需要保证剪贴板中有且仅有题解的代码</div>
          <button
            onClick={async () => {
              const answerMarkdown = await getAnswerMarkdownWithToast()
              await navigator.clipboard.writeText(answerMarkdown)
              toast.success("「答案」复制成功", {
                autoClose: 1000,
              })
            }}
          >
            复制答案
          </button>
          <button
            onClick={async () => {
              const questionMarkdown = getQuestionMarkdown()
              const answerMarkdown = await getAnswerMarkdownWithToast()
              const markdown = `${questionMarkdown}\n\n${answerMarkdown}`
              await navigator.clipboard.writeText(markdown)
              toast.success("「题目和答案」 复制成功", {
                autoClose: 1000,
              })
            }}
          >
            复制题目和答案
          </button>
        </div>
        <button className={classNames("hide-btn", isHide && "hide")} onClick={() => setIsHide(!isHide)}>
          隐藏
        </button>
      </div>
      <ToastContainer />
    </div>
  )
}

ReactDOM.render(<App />, $fluentLeetcodeRoot)
