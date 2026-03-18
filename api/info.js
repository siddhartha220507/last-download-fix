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

  try {
    const response = await fetch(
      `https://pipedapi.kavin.rocks/api/v1/streams/${id}`
    )

    if (!response.ok) {
      return res.status(500).json({ error: 'API failed' })
    }

    const data = await response.json()

    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: 'Server error' })
  }
}
