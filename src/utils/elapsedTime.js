const timeUnit = [
  {name: '秒', coef: 60},
  {name: '分', coef: 60},
  {name: '小时', coef: 24},
  {name: '天', coef: 30},
  {name: '个月', coef: 12}
]

const elapsedTime = time => {
  const now = new Date()
  time = new Date(time)
  let diff = parseInt((now - time) / 1000)
  const result = []
  for (let i = 0; i < timeUnit.length; i++) {
    const remainder = diff % timeUnit[i].coef
    if (remainder !== 0) result.unshift(`${remainder}${timeUnit[i].name}`)
    diff = parseInt(diff / timeUnit[i].coef)
    if (diff === 0) break
  }
  if (diff > 0) result.unshift(`${diff}年`)
  return result.slice(0, 2).join('')
}

export default elapsedTime