// Mock data for Manan Mehta - Film & TV Composer Portfolio

export const composerInfo = {
  name: "Manan Mehta",
  title: "Film & TV Composer",
  tagline: "Crafting Sonic Landscapes for Visual Stories",
  shortBio: "Award-winning composer creating emotive scores for film, television, and advertising. Based in Mumbai.",
  email: "hello@mananmehta.com",
  instagram: "mananmehta",
  spotify: "https://spotify.com",
  imdb: "https://imdb.com",
};

export const aboutData = {
  fullBio: `Manan Mehta is an award-winning composer whose work spans the realms of film, television, and advertising. With a unique ability to translate visual narratives into powerful sonic experiences, Manan has collaborated with acclaimed directors and brands worldwide.

Trained in both Western classical and contemporary electronic music, his compositions blend orchestral grandeur with modern textures, creating scores that resonate deeply with audiences. His work has been featured in major Bollywood films, streaming platforms, and international advertising campaigns.

Manan's approach to composition is deeply collaborative. He believes that the best scores emerge from a profound understanding of the story, the characters, and the director's vision. Each project is a new journey, an opportunity to explore uncharted sonic territories.

When not in the studio, Manan can be found exploring world music traditions, experimenting with modular synthesizers, or mentoring emerging composers.`,
  achievements: [
    "Composer - Jigra (2024)",
    "Composer - Happy Patel: Khatarnak Jasoos (2026)",
    "Multiple National Brand Campaign Scores",
    "Featured Composer - Major Streaming Platforms"
  ],
  skills: [
    "Orchestral Composition",
    "Electronic & Hybrid Scoring",
    "Sound Design",
    "Music Production",
    "Live Recording Sessions",
    "Adaptive Music for Games"
  ]
};

export const filmProjects = [
  {
    id: "f1",
    title: "Jigra",
    type: "Feature Film",
    year: 2024,
    director: "Vasan Bala",
    genre: "Action Thriller",
    description: "An emotionally charged score for this action thriller starring Alia Bhatt, capturing the intense bond between siblings and the raw determination of a sister protecting her brother.",
    coverImage: "https://filmfare.wwmindia.com/content/2024/sep/aliabhattjigra11725601702.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "4:25",
    tracks: [
      { title: "Jigra - Main Theme", duration: "4:25" },
      { title: "The Prison Break", duration: "3:15" },
      { title: "Sibling Bond", duration: "3:42" },
      { title: "Final Confrontation", duration: "4:50" }
    ]
  },
  {
    id: "f2",
    title: "Happy Patel: Khatarnak Jasoos",
    type: "Feature Film",
    year: 2026,
    director: "Vir Das & Kavi Shastri",
    genre: "Spy Comedy",
    description: "A playful, energetic score blending spy-thriller motifs with comedic timing for this masala entertainer starring Vir Das and produced by Aamir Khan Productions.",
    coverImage: "https://m.media-amazon.com/images/M/MV5BOWUyZTBjYTctMGQyNS00Mjg0LTg5ZTMtZDA1YmEyZDIxZjRlXkEyXkFqcGc@._V1_QL75_UX500_.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "3:18",
    tracks: [
      { title: "Happy's Theme", duration: "3:18" },
      { title: "Spy Games", duration: "2:45" },
      { title: "Goa Chase", duration: "3:55" },
      { title: "The Big Reveal", duration: "2:30" }
    ]
  },
  {
    id: "f3",
    title: "Aakhri Ride",
    type: "Short Film",
    year: 2025,
    director: "Vijesh Rajan & Yashoda Parthasarthy",
    genre: "Drama Thriller",
    description: "A gripping score for this Anurag Kashyap-presented short film about Aman, a migrant ride-share driver in Mumbai who desperately plans to steal from his exploitative boss to secure a dowry for his sister's wedding.",
    coverImage: "https://img.youtube.com/vi/HMksOFHln1M/maxresdefault.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "2:45",
    tracks: [
      { title: "The Last Ride", duration: "2:45" },
      { title: "Mumbai Nights", duration: "1:58" },
      { title: "Desperate Measures", duration: "2:20" }
    ]
  },
  {
    id: "f4",
    title: "Yashoda",
    type: "Short Film",
    year: 2023,
    director: "Praveen Chougule",
    genre: "Drama",
    description: "A heartfelt score celebrating motherhood and the essence of humanity, following a writer's discovery of a woman who legally adopted her maid's daughter after tragedy. Featured at IFFI Goa.",
    coverImage: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80",
    audioUrl: "/audio/placeholder.mp3",
    duration: "3:10",
    tracks: [
      { title: "Yashoda - Main Theme", duration: "3:10" },
      { title: "A Mother's Love", duration: "2:30" },
      { title: "New Beginnings", duration: "2:15" }
    ]
  }
];

// Using YouTube thumbnail URLs (maxresdefault for best quality)
export const adProjects = [
  {
    id: "a1",
    title: "Goodness Jo Dikhti Hai",
    brand: "Tropicana",
    type: "TVC",
    year: 2024,
    description: "A fresh, uplifting composition capturing the natural goodness and vitality of Tropicana juice with warm, organic instrumentation.",
    coverImage: "https://img.youtube.com/vi/GoNlEWYyBRw/maxresdefault.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "0:36",
    youtubeId: "GoNlEWYyBRw"
  },
  {
    id: "a2",
    title: "9 to 5 Foundation",
    brand: "Lakmé",
    type: "TVC",
    year: 2024,
    description: "An elegant, confident score reflecting the modern working woman's style and the premium quality of Lakmé's foundation range.",
    coverImage: "https://img.youtube.com/vi/EJFCKeJqRHc/maxresdefault.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "0:26",
    youtubeId: "EJFCKeJqRHc"
  },
  {
    id: "a3",
    title: "Sports Bag - Fuwo World",
    brand: "Futurworks by Ludic",
    type: "Product Film",
    year: 2024,
    description: "Dynamic, energetic music driving the visual storytelling of this innovative sports equipment brand, blending electronic beats with athletic energy.",
    coverImage: "https://img.youtube.com/vi/UiHfBFXJuxY/maxresdefault.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "0:47",
    youtubeId: "UiHfBFXJuxY"
  },
  {
    id: "a4",
    title: "C40 Recharge",
    brand: "Volvo",
    type: "Brand Film",
    year: 2024,
    description: "A sophisticated, forward-thinking score for Volvo's electric vehicle launch, combining cinematic orchestration with futuristic electronic textures.",
    coverImage: "https://img.youtube.com/vi/O94waW0YE1c/maxresdefault.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "1:07",
    youtubeId: "O94waW0YE1c"
  },
  {
    id: "a5",
    title: "Kiara Joins the Flip Side",
    brand: "Samsung",
    type: "TVC",
    year: 2024,
    description: "A trendy, youthful composition featuring Kiara Advani for Samsung's flip phone campaign, capturing style and innovation.",
    coverImage: "https://img.youtube.com/vi/W-iBT1haEwQ/maxresdefault.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "0:34",
    youtubeId: "W-iBT1haEwQ"
  },
  {
    id: "a6",
    title: "The Singularity - Big Game Commercial",
    brand: "Squarespace",
    type: "Super Bowl Commercial",
    year: 2023,
    description: "An epic, cinematic score for Squarespace's Big Game commercial, blending dramatic orchestral swells with cutting-edge sound design.",
    coverImage: "https://img.youtube.com/vi/To0xRwjyRLk/maxresdefault.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "1:37",
    youtubeId: "To0xRwjyRLk"
  },
  {
    id: "a7",
    title: "Spice That's Just Right",
    brand: "Lay's",
    type: "TVC",
    year: 2024,
    description: "A fun, flavorful composition with spicy Latin influences, perfectly matching the bold taste profile of Lay's Chili chips.",
    coverImage: "https://img.youtube.com/vi/1bLR9H_ZRKQ/maxresdefault.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "0:21",
    youtubeId: "1bLR9H_ZRKQ"
  },
  {
    id: "a8",
    title: "Real Feel",
    brand: "Durex",
    type: "TVC",
    year: 2024,
    description: "An intimate, sensual composition creating the perfect mood for Durex's premium product line with subtle, sophisticated tones.",
    coverImage: "https://img.youtube.com/vi/LPCpvNeTjRY/maxresdefault.jpg",
    audioUrl: "/audio/placeholder.mp3",
    duration: "0:31",
    youtubeId: "LPCpvNeTjRY"
  }
];

export const credits = [
  { year: 2026, title: "Happy Patel: Khatarnak Jasoos", role: "Composer", type: "Feature Film", director: "Vir Das & Kavi Shastri" },
  { year: 2025, title: "Aakhri Ride", role: "Composer", type: "Short Film", director: "Vijesh Rajan & Yashoda Parthasarthy" },
  { year: 2024, title: "Jigra", role: "Composer", type: "Feature Film", director: "Vasan Bala" },
  { year: 2024, title: "Tropicana - Goodness Jo Dikhti Hai", role: "Composer", type: "Commercial", director: "Various" },
  { year: 2024, title: "Lakmé 9 to 5 Foundation", role: "Composer", type: "Commercial", director: "Various" },
  { year: 2024, title: "Futurworks by Ludic - Sports Bag", role: "Composer", type: "Commercial", director: "Don Philip Antony" },
  { year: 2024, title: "Volvo C40 Recharge", role: "Composer", type: "Commercial", director: "Various" },
  { year: 2024, title: "Samsung - Kiara Joins the Flip Side", role: "Composer", type: "Commercial", director: "Various" },
  { year: 2024, title: "Lay's Chili - Spice That's Just Right", role: "Composer", type: "Commercial", director: "Various" },
  { year: 2024, title: "Durex Real Feel", role: "Composer", type: "Commercial", director: "Various" },
  { year: 2023, title: "Yashoda", role: "Composer", type: "Short Film", director: "Praveen Chougule" },
  { year: 2023, title: "Squarespace - The Singularity (Super Bowl)", role: "Composer", type: "Commercial", director: "Various" }
];

export const pressItems = [
  {
    id: "p1",
    source: "Film Companion",
    quote: "Manan Mehta's score for 'Jigra' perfectly captures the emotional intensity of Alia Bhatt's performance—a masterclass in dramatic storytelling through music.",
    date: "October 2024",
    link: "#"
  },
  {
    id: "p2",
    source: "Bollywood Hungama",
    quote: "One of the most exciting new voices in Indian film composition. Mehta brings a fresh perspective that bridges traditional Bollywood sensibilities with contemporary sound design.",
    date: "November 2024",
    link: "#"
  },
  {
    id: "p3",
    source: "Firstpost",
    quote: "The playful yet sophisticated score for 'Happy Patel' showcases Mehta's remarkable versatility—from action thrillers to spy comedies, he delivers every time.",
    date: "January 2026",
    link: "#"
  },
  {
    id: "p4",
    source: "Campaign India",
    quote: "Mehta's advertising work for brands like Volvo and Samsung demonstrates an innate understanding of how music can elevate brand storytelling to cinematic heights.",
    date: "December 2024",
    link: "#"
  },
  {
    id: "p5",
    source: "Scroll.in",
    quote: "A composer who understands that silence is just as important as sound. Mehta's restraint and precision make every note count.",
    date: "October 2024",
    link: "#"
  },
  {
    id: "p6",
    source: "Filmfare",
    quote: "With 'Jigra' and major brand campaigns under his belt, Manan Mehta is quickly becoming the go-to composer for projects that demand emotional depth and sonic innovation.",
    date: "November 2024",
    link: "#"
  }
];

export const featuredWork = [
  filmProjects[0], // Jigra
  filmProjects[1], // Happy Patel
  adProjects[3],   // Volvo
  adProjects[5]    // Squarespace
];
