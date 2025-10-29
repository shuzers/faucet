// Ad Videos Configuration
// Add YouTube video IDs here for testing

const AD_VIDEOS = [
    {
        id: 'kdE0vKc8peM',
        title: 'Sample Ad 1',
        duration: 30 // seconds
    },
    {
        id: 'CcfZqA_R7Tc',
        title: 'Sample Ad 2',
        duration: 30
    },
    {
        id: 'OtlBVVCvJiQ',
        title: 'Sample Ad 3',
        duration: 30
    },
    {
        id: 'LVRh1kb1zM',
        title: 'Sample Ad 4',
        duration: 30
    },
    {
        id: 'keOaQm6RpBg',
        title: 'Sample Ad 5',
        duration: 30
    }
];

// Get a random ad video
function getRandomAd() {
    const randomIndex = Math.floor(Math.random() * AD_VIDEOS.length);
    return AD_VIDEOS[randomIndex];
}

// Export for use in ads.js
if (typeof window !== 'undefined') {
    window.AD_VIDEOS = AD_VIDEOS;
    window.getRandomAd = getRandomAd;
}
