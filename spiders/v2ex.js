const BaseSpider = require('./base')
const constants = require('../constants')

class V2exSpider extends BaseSpider {
  async inputContent(article, editorSel) {
    const footerContent = `\n\n> 作者博客 [https://shudong.wang](https://shudong.wang)
    \n\n![2019-10-21-19-20-20](http://s.shudong.wang/2019-10-21-19-20-20.png)`
    const content = article.content + footerContent
    editor.setValue(content)
  }

  async inputFooter() {
    // do nothing
  }

  async afterInputEditor() {
    await this.page.evaluate((task) => {
      const el = document.querySelector('#nodes')
      el.value = task.category
    }, this.task)
    await this.page.waitFor(3000)
  }

  async publish() {
    // 发布文章
    const elPub = await this.page.$(this.editorSel.publish)
    await elPub.click()
    await this.page.waitFor(20000)

    // 后续处理
    await this.afterPublish()
  }

  async afterPublish() {
    this.task.url = await this.page.url().replace('#reply0', '')
    if (!this.task.url.match(/\/t\/\d+/)) return
    this.task.updateTs = new Date()
    this.task.status = constants.status.FINISHED
    await this.task.save()
  }

  async fetchStats() {
  }
}

module.exports = V2exSpider
