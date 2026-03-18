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

  const APIs = [
    'https://pipedapi.kavin.rocks',
    'https://piped.video',
    'https://pipedapi.invidious.io',
  ]

  for (let api of APIs) {
    try {
      const response = await fetch(`${api}/api/v1/streams/${id}`)

      if (!response.ok) continue

      const data = await response.json()

      if (data?.videoStreams) {
        console.log(`✅ Success with API: ${api}`)
        return res.status(200).json(data)
      }
    } catch (e) {
      console.log(`❌ API failed: ${api}`)
    }
  }

  return res.status(500).json({ error: 'All APIs failed' })
}
