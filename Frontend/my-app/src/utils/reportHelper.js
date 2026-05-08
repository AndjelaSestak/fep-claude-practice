export const triggerDownload = (blobData, filename) => {
  const blob =
    blobData instanceof Blob ? blobData : new Blob([blobData], { type: 'text/csv;charset=utf-8' })
  const downloadUrl = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = downloadUrl
  link.setAttribute('download', filename)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => {
    window.URL.revokeObjectURL(downloadUrl)
  }, 10000)
}
