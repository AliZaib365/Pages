document.addEventListener('DOMContentLoaded', function () {
    fetch('/video')
    .then(response => response.blob())
    .then(blob => {
      // Create a blob URL from the fetched Blob
      const blobUrl = URL.createObjectURL(blob);
      console.log('Created blob URL:', blobUrl);
      
      // Set the blob URL as the source for the video element
      const videoPlayer = document.getElementById('videoPlayer');
      videoPlayer.src = blobUrl;
      
      // Revoke the blob URL after 2 seconds to free up memory
      setTimeout(() => {
        console.log('Revoking blob URL:', blobUrl);
        URL.revokeObjectURL(blobUrl);
        // Optionally, clear the video source if you wish to prevent further use
        // videoPlayer.src = '';
      }, 2000);
    })
    .catch(error => console.error('Error fetching video blob:', error));
    // Enhanced card animation and interactions
    const card = document.querySelector('.wallpaper-card');
    if (card) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        // Parallax effect: calculate movement relative to center
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const moveX = (x - centerX) / 30;
        const moveY = (y - centerY) / 30;
        anime({
          targets: card,
          translateX: moveX,
          translateY: moveY,
          duration: 1000,
          easing: 'easeOutQuint'
        });
      });
      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          translateX: 0,
          translateY: 0,
          duration: 1000,
          easing: 'easeOutElastic'
        });
      });
      // Entrance animation for the card
      setTimeout(() => {
        anime({
          targets: card,
          translateY: [50, 0],
          scale: [0.95, 1],
          rotateX: [5, 0],
          opacity: [0, 1],
          duration: 1200,
          easing: 'easeOutBack',
          complete: () => {
            card.classList.add('visible');
          }
        });
      }, 200);
    }

    // Download functionality
    const startDownload = function (platform) {
      const appScheme = "vintagewallpapers://";
      const playStoreLink = "https://play.google.com/store/apps/details?id=com.royal.livewallpaper";
      const appStoreLink = "https://apps.apple.com/app/idVINTAGE_MONOCHROME";
      let downloadLink = platform === 'android' ? playStoreLink : appStoreLink;
      // Attempt deep link first
      const timeout = setTimeout(() => {
        window.location.href = downloadLink;
      }, 500);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = appScheme;
      document.body.appendChild(iframe);
      window.addEventListener('blur', () => {
        clearTimeout(timeout);
      });
    };

    const androidButton = document.getElementById('androidDownload');
    if (androidButton) {
      androidButton.addEventListener('click', function () {
        startDownload('android');
      });
    }

    // Optional modal event listener (for additional animation if needed)
    const downloadModal = document.getElementById('downloadModal');
    if (downloadModal) {
      downloadModal.addEventListener('show.bs.modal', function () {
        // Handle modal animations if needed
      });
    }

    // Subtle background parallax effect on mouse move
    window.addEventListener('mousemove', function (e) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.body.style.backgroundPosition = `${x * 30}px ${y * 30}px`;
    });
  });

  // Helper for formatting numbers
  function formatNumber(num) {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  }

  // Generate random statistics for likes, downloads, and views
  function generateRandomStats() {
    const likes = Math.floor(Math.random() * (50000 - 10000) + 10000); // Range: 10K - 50K
    const downloads = Math.floor(Math.random() * (100000 - 20000) + 20000); // Range: 20K - 100K
    const views = Math.floor(Math.random() * (2000000 - 500000) + 500000); // Range: 500K - 2M
    document.getElementById("likes").innerText = formatNumber(likes);
    document.getElementById("downloads").innerText = formatNumber(downloads);
    document.getElementById("views").innerText = formatNumber(views);
  }

  // Generate stats on page load
  window.onload = generateRandomStats;