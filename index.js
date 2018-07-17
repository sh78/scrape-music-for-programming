var casper = require('casper').create({
  pageSettings: {
    webSecurityEnabled: false
  }
})

var webroot = 'https://musicforprogramming.net/'
var episodes = []

function getEpisodes () {
  var episodes = document.querySelectorAll('#episodes a')
  return Array.prototype.map.call(episodes, function (e) {
    return e.getAttribute('href')
  })
}

casper.start(webroot)

casper.then(function () {
  episodes = this.evaluate(getEpisodes)

  this.each(episodes, function (self, link) {
    this.thenOpen(webroot + link, function () {
      var size = this.evaluate(function () {
        var sizeString = document.querySelectorAll('.pad')[1].innerText
        return sizeString.match(/\((\d)*.b\)/)[0]
      })
      this.echo('Downloading ' + this.getTitle() + ' ' + size + '...')
      var episodeMp3URL = this.getElementAttribute('a[href$=".mp3"]', 'href')
      var episodeMp3Name = episodeMp3URL.split('/')
      episodeMp3Name = episodeMp3Name[episodeMp3Name.length - 1]
      this.echo(episodeMp3URL)
      this.download(episodeMp3URL, 'downloads/' + episodeMp3Name)
    })
  })
})

casper.run(function () {
  casper.done()
})
