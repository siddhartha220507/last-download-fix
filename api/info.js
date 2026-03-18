export default async function handler(req, res) {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'No URL' })
  }

  const getVideoId = (url) => {
    const reg = /(?:v=|youtu\.be\/)([^&]+)/
    return url.match(reg)?.[1]
  }

  const id = getVideoId(url)

  if (!id) {
    return res.status(400).json({ error: 'Invalid YouTube URL' })
  }

  const APIs = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.syncpundit.io',
    'https://pipedapi.moomoo.me',
  ]

  for (let api of APIs) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${api}/streams/${id}`, {
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) continue

      const data = await response.json()

      if (data?.videoStreams || data?.audioStreams) {
        console.log(`✅ Success with API: ${api}`)
        return res.status(200).json(data)
      }
    } catch (e) {
      console.log(`❌ API failed: ${api}`)
    }
  }

  return res.status(500).json({ error: 'All APIs failed' })
}
