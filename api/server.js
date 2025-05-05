const express = require('express');
const { Blob } = require('buffer'); // Node's built-in Blob implementation
const app = express();
const PORT = process.env.PORT || 3000;

// Dynamically import node-fetch for compatibility with CommonJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to fetch, create an actual Blob, and send its data
app.get('/video', async (req, res) => {
  const videoUrl = 'https://reelbuckets.nyc3.cdn.digitaloceanspaces.com/wallpaper_app/liveWallpaper1736344253.mp4';
  try {
    const response = await fetch(videoUrl);
    if (!response.ok) {
      console.error(`Fetch failed with status ${response.status}: ${response.statusText}`);
      return res.status(500).send(`Error fetching video: ${response.statusText}`);
    }

    // Read the video data as an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Create an actual Blob from the ArrayBuffer using Node's Blob API
    const videoBlob = new Blob([arrayBuffer], { type: 'video/mp4' });

    // Convert the Blob into a Buffer to send it as the response
    const blobData = Buffer.from(await videoBlob.arrayBuffer());

    // Set the proper Content-Type header for video/mp4 and send the blob data
    res.setHeader('Content-Type', 'video/mp4');
    res.send(blobData);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).send('Error fetching the video.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});