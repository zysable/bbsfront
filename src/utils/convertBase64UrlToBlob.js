const convertBase64UrlToBlob = urlData => {
  const bytes = window.atob(urlData.split(',')[1])
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  ia.forEach((i, index) => {
    ia[index] = bytes.charCodeAt(index)
  })
  return new Blob([ia], {type: urlData.split(',')[0].split(':')[1].split(';')[0]})
}

export default convertBase64UrlToBlob