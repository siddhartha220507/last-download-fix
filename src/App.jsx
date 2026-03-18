import { useState } from 'react'

export default function App() {
  const [url, setUrl] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qualityFilter, setQualityFilter] = useState('all')

  // Video ID Extractor
  const getVideoId = (url) => {
    const reg = /(?:v=|youtu\.be\/)([^&]+)/
    return url.match(reg)?.[1]
  }

  // Main Fetch Function (calls backend API)
  const getInfo = async () => {
    try {
      setLoading(true)
      setError('')
      setData(null)

      if (!url.trim()) {
        setError('Please enter a YouTube URL')
        setLoading(false)
        return
      }

      // Call backend API endpoint
      const res = await fetch(
        `/api/info?url=${encodeURIComponent(url)}`
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `API Error: ${res.status}`)
      }

      const data = await res.json()

      // Verify we got valid data
      if (!data.videoStreams && !data.audioStreams) {
        throw new Error(
          'No streams found. This video may not be available.'
        )
      }

      setData(data)
      setQualityFilter('all')
      console.log('✅ Video data loaded successfully')
    } catch (e) {
      console.error('Error:', e)
      setError(e.message || 'Failed to fetch video. Please try again.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getInfo()
    }
  }

  // Filter video streams
  const filteredVideoStreams = data?.videoStreams?.filter((v) => {
    if (qualityFilter === 'all') return true
    if (qualityFilter === 'mp4') return v.mimeType?.includes('mp4')
    if (qualityFilter === '1080') return v.quality?.includes('1080')
    if (qualityFilter === '720') return v.quality?.includes('720')
    if (qualityFilter === '480') return v.quality?.includes('480')
    return true
  })

  return (
    <div className="container">
      <h1>🎬 YouTube Downloader</h1>

      {/* Input Section */}
      <div className="input-group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Paste YouTube URL here..."
        />
        <button onClick={getInfo} disabled={loading}>
          {loading ? 'Loading...' : 'Get Info'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Fetching video information...</p>
        </div>
      )}

      {/* Error State */}
      {error && <div className="error">❌ {error}</div>}

      {/* Video Information */}
      {data && (
        <>
          <div className="video-info">
            <h2>{data.title}</h2>
            {data.thumbnailUrl && (
              <img
                src={data.thumbnailUrl}
                alt={data.title}
                className="thumbnail"
              />
            )}
            <p>
              <strong>Channel:</strong> {data.uploader}
            </p>
            <p>
              <strong>Duration:</strong> {Math.floor(data.duration / 60)} minutes
            </p>
            <p>
              <strong>Views:</strong> {data.views?.toLocaleString() || 'N/A'}
            </p>
            <p>
              <strong>Upload Date:</strong>{' '}
              {new Date(data.uploadDate * 1000).toLocaleDateString()}
            </p>
          </div>

          {/* Quality Filter */}
          {data?.videoStreams && data.videoStreams.length > 0 && (
            <div className="quality-filter">
              <label htmlFor="quality-select">Filter Video Quality: </label>
              <select
                id="quality-select"
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
              >
                <option value="all">All Formats</option>
                <option value="mp4">MP4 Only</option>
                <option value="1080">1080p</option>
                <option value="720">720p</option>
                <option value="480">480p</option>
              </select>
            </div>
          )}

          {/* Video Streams */}
          {filteredVideoStreams && filteredVideoStreams.length > 0 && (
            <div className="streams-section">
              <h3>🎥 Video Downloads ({filteredVideoStreams.length})</h3>
              {filteredVideoStreams.map((v, i) => (
                <div key={i} className="stream-item">
                  <div className="stream-info">
                    <strong>{v.quality || 'Unknown'}</strong>
                    <p>{v.codec || 'N/A'}</p>
                    <p>{v.mimeType || 'N/A'}</p>
                  </div>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noreferrer"
                    className="download-btn"
                    download
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Audio Streams */}
          {data?.audioStreams && data.audioStreams.length > 0 && (
            <div className="streams-section">
              <h3>🎧 Audio Downloads ({data.audioStreams.length})</h3>
              {data.audioStreams.map((a, i) => (
                <div key={i} className="stream-item">
                  <div className="stream-info">
                    <strong>Audio</strong>
                    <p>{a.codec || 'N/A'}</p>
                    <p>{a.bitrate ? `${a.bitrate}kbps` : 'N/A'}</p>
                  </div>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="download-btn"
                    download
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !data && !error && (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          <p>Paste a YouTube URL and click "Get Info" to start</p>
        </div>
      )}
    </div>
  )
}
