// TMDb API Configuration (use server proxy in production)
// Do NOT store API keys in the client. Use the server proxy at /api/tmdb.
export const TMDB_PROXY_BASE = '/api/tmdb';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Spotify API Configuration
// Get your credentials from: https://developer.spotify.com/dashboard
export const SPOTIFY_CLIENT_ID = '3a8f1fcc6a1f44eba99c4df08018ad46';
export const SPOTIFY_CLIENT_SECRET = 'a4c37da0a21e4b9c9b99acf1e8af5a31';
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
export const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com/api';
export const SPOTIFY_EMBED_BASE = 'https://open.spotify.com/embed/track/';

// YouTube API Configuration (use server proxy)
// Client should call the server at /api/youtube to avoid exposing keys
export const YOUTUBE_PROXY_BASE = '/api/youtube';
export const YOUTUBE_EMBED_BASE = 'https://www.youtube.com/embed/';

// Mood-based Spotify Playlist IDs (Curated public playlists)
export const SPOTIFY_MOOD_PLAYLISTS = {
    'Happy': '37i9dQZF1DXdPec7aLTmlC',           // Happy Hits
    'Sad': '37i9dQZF1DX7qK8ma5wgG1',             // Sad Songs
    'Romantic': '37i9dQZF1DX50KNrhtTRi4',        // Love Pop
    'Thriller': '37i9dQZF1DX4PP3DA4J0N8',        // Dark & Stormy
    'Action': '37i9dQZF1DX4eRPd9frC1m',          // Adrenaline Workout
    'Comedy': '37i9dQZF1DXdPec7aLTmlC',          // Feel Good
    'Horror': '37i9dQZF1DX3LyU0mhfqgP',          // Halloween
    'Drama': '37i9dQZF1DX1npR30b2FUj',           // Sad Indie
    'Adventure': '37i9dQZF1DX4sWSpwq3LiO',       // Motivational
    'Mystery': '37i9dQZF1DX4PP3DA4J0N8',         // Dark & Stormy
    'Sci-Fi': '37i9dQZF1DX0XUfTFmNBRM',          // Electronic Focus
    'Fantasy': '37i9dQZF1DX4sWSpwq3LiO',         // Epic
    'Animated': '37i9dQZF1DX4WYpdgoIcn6',        // Chill Hits
    'Documentary': '37i9dQZF1DX4PP3DA4J0N8',     // Focus
    'Crime': '37i9dQZF1DX4PP3DA4J0N8',           // Dark & Intense
    'War': '37i9dQZF1DX0BcQWzuB7ZO',             // Epic Soundtracks
    'Musical': '37i9dQZF1DX4UtSsGT1Sbe',         // Broadway
    'Western': '37i9dQZF1DWZq91oLsHZvy',         // Country
    'Historical': '37i9dQZF1DX0BcQWzuB7ZO',      // Classical
    'Biographical': '37i9dQZF1DX9wC1KY45plY',    // Confidence
    'Sports': '37i9dQZF1DX76Wlfdnj7AP',          // Beast Mode
    'Family': '37i9dQZF1DX4WYpdgoIcn6',          // Family Fun
    'Noir': '37i9dQZF1DX4PP3DA4J0N8',            // Dark Jazz
    'Mind-Bending': '37i9dQZF1DX0XUfTFmNBRM',    // Psychedelic
    'Paranormal': '37i9dQZF1DX3LyU0mhfqgP',      // Spooky
    'Survival': '37i9dQZF1DX4eRPd9frC1m',        // Intense
    'Heist': '37i9dQZF1DX4PP3DA4J0N8',           // Tension
    'Superhero': '37i9dQZF1DX0BcQWzuB7ZO',       // Epic Heroes
    'Dark-Comedy': '37i9dQZF1DX4WYpdgoIcn6',     // Dark Humor
    'Epic': '37i9dQZF1DX0BcQWzuB7ZO',            // Epic Orchestral
    'Cyberpunk': '37i9dQZF1DX0XUfTFmNBRM',       // Cyberpunk
    'Post-Apocalyptic': '37i9dQZF1DX4PP3DA4J0N8', // Dystopian
    'Time-Travel': '37i9dQZF1DX0XUfTFmNBRM',     // Sci-Fi Synthwave
    'Psychological': '37i9dQZF1DX4PP3DA4J0N8',   // Dark Mind
    'Magical': '37i9dQZF1DWZq91oLsHZvy',         // Magical
    'Coming-of-Age': '37i9dQZF1DX4WYpdgoIcn6',   // Indie Vibes
    'Revenge': '37i9dQZF1DX4eRPd9frC1m',         // Angry
    'Conspiracy': '37i9dQZF1DX4PP3DA4J0N8'       // Suspense
};

// Language-specific Spotify Playlists
export const SPOTIFY_LANGUAGE_PLAYLISTS = {
    'en': {
        'Happy': '37i9dQZF1DXdPec7aLTmlC',
        'Sad': '37i9dQZF1DX7qK8ma5wgG1',
        'Romantic': '37i9dQZF1DX50KNrhtTRi4',
        'Action': '37i9dQZF1DX4eRPd9frC1m',
        'default': '37i9dQZF1DXcBWIGoYBM5M'  // Today's Top Hits
    },
    'hi': {
        'Happy': '37i9dQZF1DX0XUfTFmNBRM',  // Bollywood Happy
        'Sad': '37i9dQZF1DX9J4qRaXRMGW',    // Bollywood Sad
        'Romantic': '37i9dQZF1DX1YLa1gQrcxF', // Bollywood Romance
        'Action': '37i9dQZF1DX8qLSJqfTheR',  // Bollywood Dance
        'default': '37i9dQZF1DX0XUfTFmNBRM'
    },
    'te': {
        'Happy': '37i9dQZF1DX5zzKMbJ1D8S',   // Telugu Hits
        'Romantic': '37i9dQZF1DX4A5LxbM6RgT', // Telugu Love
        'Action': '37i9dQZF1DX6c5OLCcvnBf',  // Telugu Mass
        'default': '37i9dQZF1DX5zzKMbJ1D8S'
    },
    'ta': {
        'Happy': '37i9dQZF1DX3YrCJdcZAWe',   // Tamil Hits
        'Romantic': '37i9dQZF1DX5OlZPEYp68y', // Tamil Romance
        'Action': '37i9dQZF1DX80A2VNhKz07',  // Tamil Power
        'default': '37i9dQZF1DX3YrCJdcZAWe'
    },
    'ml': {
        'Happy': '37i9dQZF1DX3Sp0P0YFG5S',   // Malayalam Hits
        'Romantic': '37i9dQZF1DWXRu7SbmHcpx', // Malayalam Love
        'default': '37i9dQZF1DX3Sp0P0YFG5S'
    },
    'kn': {
        'Happy': '37i9dQZF1DX4N9uOLKfxJk',   // Kannada Hits
        'Romantic': '37i9dQZF1DWZLtWj3HS9Pp', // Kannada Romance
        'default': '37i9dQZF1DX4N9uOLKfxJk'
    },
    'ko': {
        'Happy': '37i9dQZF1DX9tPFwDMOaN1',   // K-Pop Hits
        'Romantic': '37i9dQZF1DX1gRalH8BT3x', // K-Pop Love
        'Action': '37i9dQZF1DX14fiWYoe7Oh',  // K-Pop Workout
        'default': '37i9dQZF1DX9tPFwDMOaN1'
    },
    'ja': {
        'Happy': '37i9dQZF1DX4yXF4S2jGwj',   // J-Pop Hits
        'Romantic': '37i9dQZF1DWZxPJTWNowgE', // J-Pop Love
        'Action': '37i9dQZF1DWY82B0Sc3Bfn',  // Anime Energy
        'default': '37i9dQZF1DX4yXF4S2jGwj'
    },
    'es': {
        'Happy': '37i9dQZF1DX10zKzsJ2jva',   // Latin Hits
        'Romantic': '37i9dQZF1DX4TlCgjqg7Ae', // Latin Romance
        'Action': '37i9dQZF1DX0XUsuxWHRQd',  // Reggaeton
        'default': '37i9dQZF1DX10zKzsJ2jva'
    },
    'fr': {
        'Happy': '37i9dQZF1DWTwnEm1IYyoj',   // French Hits
        'Romantic': '37i9dQZF1DX3aCfCvqWI6j', // French Romance
        'default': '37i9dQZF1DWTwnEm1IYyoj'
    }
};

// Mood-to-Music-Search mapping for recommendations
export const MOOD_MUSIC_KEYWORDS = {
    // Vibe Mode mappings (lowercase)
    'happy': { keywords: 'happy upbeat energetic cheerful joyful positive feel good summer vibes party celebration', genre: 'pop dance house funk' },
    'sad': { keywords: 'sad melancholy emotional heartbreak crying tears lonely depressed blue sorrow', genre: 'indie acoustic ballad soul' },
    'energetic': { keywords: 'energetic powerful intense workout adrenaline pump gym motivation hype beast mode', genre: 'rock electronic edm dubstep trap' },
    'romantic': { keywords: 'love romantic heartfelt passionate intimacy soulmate couple wedding valentine sensual', genre: 'pop r&b soul love songs' },
    'calm': { keywords: 'calm peaceful relaxing meditation chill ambient sleep zen tranquil serenity spa yoga', genre: 'ambient lo-fi classical new age instrumental' },
    'mystery': { keywords: 'mysterious intriguing enigmatic suspense dark noir detective investigation puzzle', genre: 'ambient jazz electronic downtempo' },
    'horror': { keywords: 'dark eerie scary creepy horror haunted nightmare terror spooky halloween thriller', genre: 'ambient electronic industrial darkwave' },
    
    // Original mood mappings (capitalized - for movie moods) - Updated for 12 moods
    'Happy': { keywords: 'happy upbeat energetic cheerful joyful party celebration dance fun feel good sunshine pop hits', genre: 'pop dance funk disco electronic' },
    'Romantic': { keywords: 'love romantic heartfelt passionate intimacy soulmate wedding valentine kiss tender affection ballad', genre: 'pop r&b soul love songs romantic' },
    'Sad': { keywords: 'sad melancholy emotional heartbreak crying tears depressed lonely rain sorrow grief acoustic', genre: 'indie acoustic ballad soul piano emotional' },
    'Comedy': { keywords: 'fun cheerful playful funny silly laugh joke party happy upbeat lighthearted comedy music', genre: 'pop indie alternative upbeat' },
    'Action': { keywords: 'powerful energetic adrenaline explosive intense battle fight epic hero warrior strength rock', genre: 'rock electronic metal trap hard' },
    'Thriller': { keywords: 'intense dark suspense tension chase dramatic edge adrenaline action mystery danger thriller', genre: 'electronic rock industrial suspense intense' },
    'Horror': { keywords: 'dark eerie scary creepy haunted terror nightmare spooky halloween fear sinister horror', genre: 'ambient electronic darkwave industrial metal' },
    'Sci-Fi': { keywords: 'futuristic electronic cosmic space aliens technology cyberpunk dystopian future science robot scifi', genre: 'electronic synthwave ambient trance cinematic' },
    'Adventure': { keywords: 'epic adventurous inspiring journey quest exploration brave heroic discovery travel wanderlust adventure', genre: 'orchestral rock cinematic soundtrack world' },
    'Mystery': { keywords: 'mysterious intriguing dark noir detective investigation puzzle enigmatic secrets hidden clues mystery', genre: 'ambient jazz downtempo noir instrumental' },
    'Chill': { keywords: 'chill relaxing calm peaceful ambient lounge smooth easy laid-back mellow cozy chillout', genre: 'lofi chillout ambient downtempo instrumental' },
    'Inspiring': { keywords: 'inspiring motivational uplifting epic triumph victory courage hope dreams powerful achievement inspirational', genre: 'orchestral soundtrack cinematic epic rock' },
    'Fantasy': { keywords: 'magical epic dreamy enchanted mystical wizards dragons adventure medieval', genre: 'orchestral ambient celtic cinematic' },
    'Animated': { keywords: 'fun playful cheerful colorful whimsical bright adventure magical kids', genre: 'pop soundtrack disney musical' },
    'Documentary': { keywords: 'calm focus inspiring educational thoughtful narrative nature discovery truth', genre: 'ambient classical world instrumental' },
    'Crime': { keywords: 'dark intense gritty noir detective gangster heist thriller investigation', genre: 'rock electronic hip-hop jazz' },
    'War': { keywords: 'epic powerful dramatic heroic battle conflict soldier courage sacrifice', genre: 'orchestral soundtrack cinematic' },
    'Musical': { keywords: 'theatrical dramatic vocal singing broadway show dance performance', genre: 'musical broadway jazz show tunes' },
    'Western': { keywords: 'country folk acoustic cowboy frontier outlaw desert horse guitar', genre: 'country folk americana bluegrass' },
    'Historical': { keywords: 'classical elegant timeless period orchestral vintage regal majestic', genre: 'classical orchestral baroque' },
    'Biographical': { keywords: 'inspiring emotional powerful real life story triumph journey legacy', genre: 'soundtrack indie orchestral' },
    'Sports': { keywords: 'motivational powerful energetic victory triumph training champion workout pump', genre: 'rock electronic hip-hop' },
    'Family': { keywords: 'fun happy cheerful wholesome togetherness adventure magical kids friendly', genre: 'pop soundtrack disney musical' },
    'Noir': { keywords: 'dark mysterious jazz noir detective smoky sultry vintage crime shadow', genre: 'jazz blues lounge' },
    'Mind-Bending': { keywords: 'psychedelic experimental strange trippy surreal abstract distorted reality mind', genre: 'electronic experimental psychedelic progressive' },
    'Paranormal': { keywords: 'eerie mysterious haunting supernatural ghostly spirits otherworldly haunted creepy', genre: 'ambient electronic darkwave' },
    'Survival': { keywords: 'intense powerful dramatic determination struggle wilderness fight survive endure', genre: 'rock electronic intense' },
    'Heist': { keywords: 'tension suspense cool calculated smooth plan strategic clever crime', genre: 'electronic jazz funk' },
    'Superhero': { keywords: 'epic powerful heroic justice champion mighty victory strength legendary', genre: 'orchestral rock cinematic' },
    'Dark-Comedy': { keywords: 'quirky dark playful ironic sarcastic twisted humor bizarre absurd', genre: 'indie alternative rock' },
    'Epic': { keywords: 'epic grand powerful legendary massive cinematic heroic triumphant majestic', genre: 'orchestral soundtrack cinematic' },
    'Cyberpunk': { keywords: 'futuristic electronic dark neon dystopian technology cyber matrix digital', genre: 'synthwave electronic industrial' },
    'Post-Apocalyptic': { keywords: 'dark intense dystopian wasteland survival desolate destroyed ruins chaos', genre: 'industrial electronic ambient' },
    'Time-Travel': { keywords: 'mysterious sci-fi cosmic temporal journey paradox dimension portal future', genre: 'electronic ambient synthwave' },
    'Psychological': { keywords: 'dark intense emotional mental twisted mind disturbing complex deep thriller', genre: 'ambient experimental dark' },
    'Magical': { keywords: 'magical dreamy enchanting mystical whimsical fairy wonder spells fantasy', genre: 'ambient orchestral celtic' },
    'Coming-of-Age': { keywords: 'nostalgic emotional indie youth growing teen adolescent journey discovery', genre: 'indie pop alternative' },
    'Revenge': { keywords: 'powerful intense angry fury vengeance rage battle fight justice payback', genre: 'rock metal hard' },
    'Conspiracy': { keywords: 'mysterious dark suspense paranoia secrets truth investigation hidden agenda', genre: 'electronic ambient dark' }
};

// Language-specific music keywords (focused on movie and album songs)
export const LANGUAGE_MUSIC_KEYWORDS = {
    'en': 'english movie soundtrack album official',
    'hi': 'hindi bollywood movie song film album gaana',
    'te': 'telugu tollywood movie song film album',
    'ta': 'tamil kollywood movie song film album',
    'ml': 'malayalam mollywood movie song film album',
    'kn': 'kannada sandalwood movie song film album',
    'ko': 'korean kpop album official mv music video',
    'ja': 'japanese jpop anime ost soundtrack official',
    'es': 'spanish latin movie soundtrack album official',
    'fr': 'french chanson movie soundtrack album official'
};

// Major languages of global movie industry
export const LANGUAGES = {
    'English': 'en',      // Hollywood (USA, UK)
    'Hindi': 'hi',        // Bollywood (India)
    'Telugu': 'te',       // Tollywood (India)
    'Tamil': 'ta',        // Kollywood (India)
    'Malayalam': 'ml',    // Mollywood (India)
    'Kannada': 'kn',      // Sandalwood (India)
    'Korean': 'ko',       // K-Cinema (South Korea)
    'Japanese': 'ja',     // Japanese Cinema
    'Spanish': 'es',      // Spanish Cinema (Spain, Latin America)
    'French': 'fr'        // French Cinema
};

// Region for streaming providers
export const REGION = 'IN';