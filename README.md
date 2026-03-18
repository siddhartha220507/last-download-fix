# YouTube Downloader 🎬

A fast and free YouTube video downloader built with React and the Piped API. No backend required, no crashes!

## ✨ Features

✅ Parse YouTube URLs easily  
✅ Display video title, thumbnail, and metadata  
✅ Multiple video quality options  
✅ Audio stream downloads  
✅ Quality filter (MP4, 1080p, 720p, 480p)  
✅ Beautiful, responsive UI  
✅ No backend needed  
✅ Fast and stable  

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## 📋 How to Use

1. **Paste YouTube URL** - Copy any YouTube URL (youtube.com/watch?v=... or youtu.be/...)
2. **Click "Get Info"** - Fetch video details and available streams
3. **Download** - Choose your preferred quality (video or audio), then download

## 🎯 Architecture

```
React App → Piped API → Video + Audio Streams
```

**No backend server needed** - All requests go directly to Piped's free API.

## 📝 Technical Details

### Video ID Extraction
```javascript
const getVideoId = (url) => {
  const reg = /(?:v=|youtu\.be\/)([^&]+)/;
  return url.match(reg)?.[1];
};
```

### API Endpoint
```
https://piped.video/api/v1/streams/{videoId}
```

### Available Formats
- **Video**: Multiple quality options (1080p, 720p, 480p, etc.)
- **Audio**: Multiple codecs and bitrates

## ⚠️ Important Notes

- ⏰ Download links expire after some time
- 🚀 Large videos may take time to process
- 🌍 Quality depends on the original YouTube video

## 💡 Features Included

- ⚡ Loading spinner while fetching data
- 🔴 Error handling with user-friendly messages
- 📊 Quality filter dropdown
- 📱 Responsive design (mobile & desktop)
- 🎨 Modern, beautiful UI

## 🌐 Deployment

Deploy to Vercel, Netlify, or any static host:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Then drag & drop the 'dist' folder to Netlify
```

## 📦 Dependencies

- **React**: UI framework
- **Vite**: Lightning-fast build tool

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Piped API](https://github.com/TeamPiped/Piped)

## ⚖️ Legal Notice

This tool is for educational purposes. Always respect copyright and terms of service when downloading videos.

## 🤝 Support

For issues or suggestions, please open an issue on the repository.

---

**Made with ❤️ using React and Piped API**
