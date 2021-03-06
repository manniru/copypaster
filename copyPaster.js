theCopyPaster = class {
  constructor(formId) {
    this.formId = formId
  }
  formToTree() {
    const formId = this.formId
    const formData = new FormData(document.getElementById(formId))
    return Array.from(formData.entries())
      .filter(line => this._filterHiddenKeys(line[0]))
      .map(line => `${this._formKeyToKeyword(line[0])} ${line[1].replace(/\n/g, "\n ")}`)
      .join("\n")
  }
  _filterHiddenKeys(line) {
    return line.startsWith("app[questions]")
  }
  _formKeyToKeyword(line) {
    return line.replace("app[questions][", "").replace("]", "")
  }
  _keywordToFormKey(keyword) {
    return `app[questions][${keyword}]`
  }
  formToGrammarWithStrongTyping() {
    // todo
  }
  treeToForm(tree) {
    new jtree.TreeNode(tree).forEach(node => {
      const newValue = node.getContent() + (node.length ? "\n" + node.childrenToString() : "")
      document.getElementsByName(this._keywordToFormKey(node.getWord(0)))[0].value = newValue
    })
  }
  _removeFromPage() {
    const existing = document.getElementById("copyPaster")
    if (existing) existing.remove()
  }
  reset() {
    this._removeFromPage()
    this._addToPage()
  }
  _addJtreeToPage() {
    // https://jtree.treenotation.org/products/jtree.browser.js
  }
  startListening() {
    let that = this
    document.getElementById(this.formId).addEventListener("keyup", function() {
      that._updateTextarea()
    })
  }
  _updateTextarea() {
    document.getElementById("copyPasterTextArea").value = this.formToTree()
  }
  _addToPage() {
    const div = document.createElement("div")
    const textarea = document.createElement("textarea")
    const header = document.createElement("h3")
    header.innerHTML = "CopyPaster"
    div.appendChild(header)
    div.appendChild(textarea)
    div.setAttribute("id", "copyPaster")
    div.setAttribute("style", "position: fixed; bottom: 0; right: 0; width: 380px; height: 200px;")
    textarea.setAttribute("style", "height: 100%;")
    textarea.setAttribute("id", "copyPasterTextArea")
    textarea.value = this.formToTree()
    const that = this
    textarea.addEventListener("change", function() {
      that.treeToForm(textarea.value)
    })
    document.body.appendChild(div)
  }
}
a = new theCopyPaster("edit_app_243511")
a.reset()
