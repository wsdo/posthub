const BaseSpider = require('./base')

class ToutiaoSpider extends BaseSpider {
  async inputContent(article, editorSel) {
    const footerContent = this.footCentent
    const content = article.contentHtml + footerContent
    const el = document.querySelector(editorSel.content)
    el.focus()
    document.execCommand('insertHTML', false, content)
  }

  async inputFooter(article, editorSel) {
    // do nothing
  }

  async publish() {
    // 发布文章
    const elPub = await this.page.$(this.editorSel.publish)
    await elPub.click()
    await this.page.waitFor(10000)

    // 后续处理
    await this.afterPublish()
  }

  async afterInputEditor() {
  }

  async afterPublish() {
    const id = await this.page.evaluate(() => {
      const url = document.querySelector('.master-title > a').getAttribute('href')
      return url.match(/pgc_id=(\d+)$/)[1]
    })
    if (!id) return
    this.task.url = `https://toutiao.com/i${id}`
    this.task.updateTs = new Date()
    await this.task.save()
  }

  async fetchStats() {
  }
}

module.exports = ToutiaoSpider
