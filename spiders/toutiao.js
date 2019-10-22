const BaseSpider = require('./base')

class ToutiaoSpider extends BaseSpider {
  async inputContent(article, editorSel) {
    const footerContent = `<br><b><a href="https://shudong.wang" target="_blank">作者博客</a><br>
      ![2019-10-21-19-20-20](http://s.shudong.wang/2019-10-21-19-20-20.png)</b>`
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
