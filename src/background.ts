import { storage } from "@extend-chrome/storage"

chrome.runtime.onInstalled.addListener(() => {
  storage.sync.set({ hideTip: false })
})
