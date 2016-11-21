const cto = require('css-to-js-object')
const fs = require('fs')

const fixturePath = './fixtures/style.css'
const css = fs.readFileSync(fixturePath, 'utf-8')

const cssObj = cto(css)


const memos = {}

const toCss = (obj) => {
  return Object.keys(obj).reduce((css, selector) => {
    css += selector + " {\n"
    Object.keys(obj[selector]).forEach(rule => {
      css += `  ${rule}: ${obj[selector][rule]};` + "\n"
    })

    css += "}\n"

    return css
  }, '')
}


Object.keys(cssObj).forEach(selector => {
  const rules = cssObj[selector]

  Object.keys(rules).forEach(rule => {
    const value = rules[rule] 
    const key = `${rule}|${value}`

    if (selector.substr(0, 1) !== '.') {
      return
    }

    if (!memos[key]) {
      memos[key] = []
    }

    memos[key].push({
      selector,
      rule,
      value
    })
  })
})

const created = {}

const stats = Object.keys(memos).map(rule => {
  return {
    rule,
    count: memos[rule].length,
    stat: memos[rule],
  }
})
.filter(rule => {
  return rule.count >= 2
})
.sort((a, b) => {
  return b.count - a.count
})
.reduce((css, rule)  => {
  const splitted = rule.rule.split('|')
  const key = splitted[0]
  const val = splitted[1]
  const newSelector = '.' + rule.rule.replace('|', '---')
  css[newSelector] = {
    [key]: val,
  }

  rule.stat.forEach((stat) => {
    if (css[stat.selector][stat.rule] && css[stat.selector][stat.rule] == stat.value) {
      delete css[stat.selector][stat.rule]
    }

    if (Object.keys(css[stat.selector]).length === 0) {
      delete css[stat.selector]
    }
   
  })

  return css

}, JSON.parse(JSON.stringify(cssObj)))

const orig = JSON.stringify(cssObj, null, 2)
console.log('orig', orig.length)
//console.log(stats)

const str = JSON.stringify(stats, null, 2)
console.log(str.length)


fs.writeFileSync('./res.css', toCss(stats))


//fs.writeFileSync('./orig.json', orig)

const resStat = fs.statSync('./res.css')
const origStat = fs.statSync(fixturePath)


console.log('SAVED:', (origStat.size  - resStat.size) / (origStat.size / 100),'%')
console.log('From:', `${origStat.size/1000}kB`)
console.log('to:', `${resStat.size/1000}kB`)
