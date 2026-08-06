"""The site's current content, transcribed from frontend/src/data/mock.js and
the literals that were inlined in the page components.

This exists so the client's first login shows his real films, ads and credits
rather than an empty CMS. It is the one-time import source; after seeding,
MongoDB is the source of truth and this file is only a fallback/reset.

Stable ids (f1..f7, a1..a8, c1..c15) are kept from mock.js so re-running the
seed updates rows in place instead of duplicating them.
"""
from __future__ import annotations

from typing import Any, Dict, List

SITE_SETTINGS: Dict[str, Any] = {
    "name": "Manan Mehta",
    "title": "Film & TV Composer",
    "tagline": "Crafting Sonic Landscapes for Visual Stories",
    "shortBio": "",
    "email": "connect@manankmehta.com",
    "instagram": "manankmehta",
    "instagramUrl": "https://www.instagram.com/manankmehta/",
    "spotify": "https://spotify.com",
    "imdb": "https://imdb.com",
    "location": "Mumbai, India",
    "seoTitle": "Manan Mehta | Film & Television Composer",
    "seoDescription": (
        "Manan Mehta is a Mumbai-based music composer and producer creating "
        "scores for films, documentaries and advertising campaigns."
    ),
}

HOME_PAGE: Dict[str, Any] = {
    "heroKicker": "Film & Television Composer",
    "heroTagline": "Crafting Sonic Landscapes for Visual Stories",
    "heroPrimaryCta": "Explore Work",
    "heroSecondaryCta": "Get in Touch",
    # Mirrors the old hardcoded featuredWork: Jigra, Happy Patel, Volvo,
    # Squarespace, Sports Bag.
    "featuredWork": [
        {"kind": "film", "projectId": "f1"},
        {"kind": "film", "projectId": "f2"},
        {"kind": "ad", "projectId": "a4"},
        {"kind": "ad", "projectId": "a6"},
        {"kind": "ad", "projectId": "a1"},
    ],
    "rotationMs": 5000,
    "introHeadingLine1": "CRAFTING SONIC",
    "introHeadingLine2": "LANDSCAPES",
    "introBody": (
        "From intimate indie dramas to major advertising campaigns, my music "
        "serves the story. Every composition is tailored to enhance the "
        "emotional journey of your project."
    ),
    "introCtaLabel": "Learn More About Me",
    "services": [
        {
            "title": "Film & TV",
            "description": "Original scores for feature films, documentaries, and series",
        },
        {
            "title": "Advertising",
            "description": "Memorable music for brands and commercial campaigns",
        },
        {
            "title": "Sound Design",
            "description": "Crafting immersive sonic experiences and textures",
        },
        {
            "title": "Collaboration",
            "description": "Working closely with directors to realize their vision",
        },
    ],
    "filmsKicker": "Featured Work",
    "filmsHeading": "FILM SCORES",
    "adsKicker": "Commercial Work",
    "adsHeading": "ADVERTISING",
    "ctaKicker": "Let's Create Together",
    "ctaHeadingLine1": "HAVE A PROJECT",
    "ctaHeadingLine2": "IN MIND?",
    "ctaBody": (
        "I'm always excited to collaborate on new projects. Whether it's a "
        "feature film, documentary, or advertising campaign, let's discuss how "
        "we can bring your vision to life through music."
    ),
    "ctaButtonLabel": "Start a Conversation",
}

ABOUT_PAGE: Dict[str, Any] = {
    "kicker": "About the Composer",
    "fullBio": (
        "Manan Mehta is a dynamic music composer, producer, and guitarist "
        "versatile across genres, based in Mumbai, crafting captivating "
        "soundscapes for ads, films, and beyond.\n\n"
        "A proud alumnus of True School of Music in Mumbai, Manan honed his "
        "craft in a vibrant creative hub, mastering music theory, production "
        "techniques, and genre-blending innovation. His journey has taken him "
        "across India, collaborating with acclaimed music composers and film "
        "directors to craft scores that elevate storytelling—from "
        "high-energy ad jingles to cinematic epics."
    ),
    "achievements": [
        "Composer - Jigra (2024)",
        "Composer - Happy Patel: Khatarnak Jasoos (2026)",
        "Multiple National Brand Campaign Scores",
        "Featured Composer - Major Streaming Platforms",
    ],
    "skillsKicker": "Expertise",
    "skillsHeading": "SKILLS & SERVICES",
    # The old page generated each blurb from the skill name; those strings are
    # materialised here so the client can now edit them individually.
    "skills": [
        {
            "title": "Music for Ads & Jingles",
            "description": (
                "Bringing depth and emotion to every project through expert "
                "music for ads & jingles."
            ),
        },
        {
            "title": "Electronic & Hybrid Scoring",
            "description": (
                "Bringing depth and emotion to every project through expert "
                "electronic & hybrid scoring."
            ),
        },
        {
            "title": "Sound Design",
            "description": (
                "Bringing depth and emotion to every project through expert "
                "sound design."
            ),
        },
        {
            "title": "Music Production",
            "description": (
                "Bringing depth and emotion to every project through expert "
                "music production."
            ),
        },
        {
            "title": "Live Recording Sessions",
            "description": (
                "Bringing depth and emotion to every project through expert "
                "live recording sessions."
            ),
        },
        {
            "title": "Orchestral Composition",
            "description": (
                "Bringing depth and emotion to every project through expert "
                "orchestral composition."
            ),
        },
    ],
    "processKicker": "How I Work",
    "processHeading": "THE PROCESS",
    "process": [
        {
            "step": "01",
            "title": "Discovery",
            "description": "Understanding your vision, story, and emotional goals for the project.",
        },
        {
            "step": "02",
            "title": "Concept",
            "description": "Developing themes, motifs, and the overall sonic palette.",
        },
        {
            "step": "03",
            "title": "Creation",
            "description": (
                "Composing, recording, and producing the score with meticulous "
                "attention to detail."
            ),
        },
        {
            "step": "04",
            "title": "Delivery",
            "description": "Final mixing, mastering, and delivery in all required formats.",
        },
    ],
    "ctaHeadingLine1": "LET'S CREATE",
    "ctaHeadingLine2": "SOMETHING AMAZING",
    "ctaBody": (
        "Ready to discuss your project? I'd love to hear about your vision and "
        "explore how we can bring it to life through music."
    ),
    "ctaButtonLabel": "Start a Conversation",
}

CONTACT_PAGE: Dict[str, Any] = {
    "kicker": "Get in Touch",
    "heading": "LET'S TALK",
    "accentWord": "TALK",
    "intro": (
        "Have a project in mind? I'd love to hear about it. Fill out the form "
        "or reach out directly through email or social media."
    ),
    "projectTypeOptions": [
        {"value": "feature-film", "label": "Feature Film"},
        {"value": "documentary", "label": "Documentary"},
        {"value": "short-film", "label": "Short Film"},
        {"value": "tv-series", "label": "TV Series"},
        {"value": "commercial", "label": "Commercial / Advertising"},
        {"value": "other", "label": "Other"},
    ],
    "successHeading": "Message Sent!",
    "successBody": "Thank you for reaching out. I'll get back to you within 24-48 hours.",
    "faqKicker": "Common Questions",
    "faqHeading": "FAQ",
    "faqs": [
        {
            "q": "What is your typical turnaround time?",
            "a": (
                "Depending on the scope, most projects take 4-12 weeks. I always "
                "discuss timeline expectations during our initial consultation."
            ),
        },
        {
            "q": "Do you work with indie filmmakers?",
            "a": (
                "Absolutely! I love working on projects of all sizes. Budget "
                "considerations can be discussed during our initial conversation."
            ),
        },
        {
            "q": "What does your process look like?",
            "a": (
                "It starts with understanding your vision, followed by theme "
                "development, composition, recording, and final delivery with "
                "revisions included."
            ),
        },
        {
            "q": "Do you handle music licensing?",
            "a": (
                "Yes, all music I create comes with clear licensing terms. We'll "
                "discuss usage rights based on your distribution plans."
            ),
        },
    ],
}

FILMS_PAGE: Dict[str, Any] = {
    "kicker": "Film Compositions",
    "heading": "FILM & TV",
    "accentWord": "&",
    "intro": (
        "Original scores for feature films, documentaries, and television. Each "
        "composition is crafted to serve the unique emotional landscape of the "
        "story."
    ),
}

ADS_PAGE: Dict[str, Any] = {
    "kicker": "Commercial Work",
    "heading": "ADVERTISING",
    "accentWord": "",
    "intro": (
        "Music for global brands and advertising campaigns. From product "
        "launches to brand anthems, creating memorable sonic identities that "
        "resonate with audiences."
    ),
}

CREDITS_PAGE: Dict[str, Any] = {
    "kicker": "Filmography",
    "heading": "CREDITS",
    "accentWord": "",
    "intro": (
        "A comprehensive list of film, television, and commercial projects. Each "
        "score represents a unique collaboration and creative journey."
    ),
}

FILM_PROJECTS: List[Dict[str, Any]] = [
    {
        "id": "f1",
        "title": "Jigra",
        "type": "Feature Film",
        "year": 2024,
        "director": "Vasan Bala",
        "genre": "Action Thriller",
        "role": "Additional Music",
        "description": (
            "An emotionally charged score for this action thriller starring Alia "
            "Bhatt, capturing the intense bond between siblings and the raw "
            "determination of a sister protecting her brother."
        ),
        "coverImage": {
            "url": "https://filmfare.wwmindia.com/content/2024/sep/aliabhattjigra11725601702.jpg",
            "publicId": None,
        },
        "soundcloudPlaylist": "https://soundcloud.com/user-463032126/sets/jigra/s-EZtrb5Sl7cr",
        "soundcloudEmbed": None,
        "tracks": [
            {
                "title": "Aag Hi Aag War",
                "embedUrl": "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1946250923&secret_token=s-KSmCykwer9y",
            },
            {
                "title": "Muthus' Theme (JIGRA)",
                "embedUrl": "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1946100899&secret_token=s-eriAJmmUdfN",
            },
        ],
        "order": 0,
    },
    {
        "id": "f2",
        "title": "Happy Patel: Khatarnak Jasoos",
        "type": "Feature Film",
        "year": 2026,
        "director": "Vir Das & Kavi Shastri",
        "genre": "Spy Comedy",
        "role": "Additional Music",
        "description": (
            "A playful, energetic score blending spy-thriller motifs with comedic "
            "timing for this masala entertainer starring Vir Das and produced by "
            "Aamir Khan Productions."
        ),
        "coverImage": {
            "url": "https://m.media-amazon.com/images/M/MV5BOWUyZTBjYTctMGQyNS00Mjg0LTg5ZTMtZDA1YmEyZDIxZjRlXkEyXkFqcGc@._V1_QL75_UX500_.jpg",
            "publicId": None,
        },
        "originalSong": {
            "title": "Happy Patel Original Song",
            "youtubeId": "Me8fyA6inTo",
        },
        "soundcloudPlaylist": "https://soundcloud.com/user-463032126/sets/happy-patel",
        "tracks": [
            {
                "title": "Sanjeev Kapoor's Theme",
                "embedUrl": "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F2307623792",
            },
            {
                "title": "Mama Ke Gunde",
                "embedUrl": "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F2307625874",
            },
            {
                "title": "Rupa's Theme",
                "embedUrl": "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F2307625244",
            },
            {
                "title": "Cook Off Theme",
                "embedUrl": "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F2307624332",
            },
        ],
        "order": 1,
    },
    {
        "id": "f3",
        "title": "Raftaar",
        "type": "Feature Film",
        "year": 2024,
        "director": "Independent",
        "genre": "Action Drama",
        "role": "",
        "description": (
            "A high-octane score capturing speed, adrenaline, and the pursuit of "
            "dreams, with pulsating rhythms and cinematic intensity."
        ),
        "coverImage": {
            "url": "https://customer-assets.emergentagent.com/job_audio-portfolio-4/artifacts/vjcciayl_IMG_3542.JPG",
            "publicId": None,
        },
        "order": 2,
    },
    {
        "id": "f4",
        "title": "RBI Unlocked: Beyond the Rupee",
        "type": "Documentary",
        "year": 2025,
        "director": "Chalkboard Entertainment",
        "genre": "Finance Documentary",
        "role": "Additional Music",
        "description": (
            "A compelling score for RBI's first-ever documentary series in its "
            "90-year history, streaming on JioHotstar. The five-part series "
            "explores India's central bank's role in monetary policy, currency "
            "management, and financial inclusion."
        ),
        "coverImage": {
            "url": "https://image.tmdb.org/t/p/w500/jjj5NYuASDNjjQAiAdvgx3N7JJx.jpg",
            "publicId": None,
        },
        "order": 3,
    },
    {
        "id": "f5",
        "title": "Aakhri Ride",
        "type": "Short Film",
        "year": 2025,
        "director": "Vijesh Rajan & Yashoda Parthasarthy",
        "genre": "Drama Thriller",
        "role": "Additional Music",
        "description": (
            "A gripping score for this Anurag Kashyap-presented short film about "
            "Aman, a migrant ride-share driver in Mumbai who desperately plans to "
            "steal from his exploitative boss to secure a dowry for his sister's "
            "wedding."
        ),
        "coverImage": {
            "url": "https://img.youtube.com/vi/HMksOFHln1M/maxresdefault.jpg",
            "publicId": None,
        },
        "soundcloudPlaylist": "https://soundcloud.com/user-463032126/sets/aakhari-ride-horror-comedy/s-PNwcYixSgC3",
        "tracks": [
            {
                "title": "Com Truise",
                "embedUrl": "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1946078263&secret_token=s-lE0VVJipDlE",
            },
            {
                "title": "Handcuffed",
                "embedUrl": "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1946066251&secret_token=s-KV3ZLj52erU",
            },
        ],
        "order": 4,
    },
    {
        "id": "f6",
        "title": "Bombay Mon Amour",
        "type": "Short Film",
        "year": 2025,
        "director": "Independent",
        "genre": "Drama",
        "role": "Music Composer",
        "description": (
            "An evocative score capturing the rhythm and soul of Mumbai, weaving "
            "together the city's vibrant energy with intimate human stories."
        ),
        "coverImage": {
            "url": "https://customer-assets.emergentagent.com/job_audio-portfolio-4/artifacts/zlr4c2br_1.jpg",
            "publicId": None,
        },
        "soundcloudPlaylist": "https://soundcloud.com/user-463032126/sets/bombay-mon-amour",
        "tracks": [
            {
                "title": "Bombay Mon Amour",
                "url": "https://soundcloud.com/user-463032126/bombay-mon-amour-1",
            },
            {
                "title": "Ketan's Theme",
                "url": "https://soundcloud.com/user-463032126/amriths-theme-2",
            },
            {
                "title": "Mind Skipping Frames",
                "url": "https://soundcloud.com/user-463032126/mind-skipping-frames-3",
            },
            {
                "title": "Down the Memory Lane",
                "url": "https://soundcloud.com/user-463032126/down-the-memory-lane-4",
            },
            {
                "title": "Karishma's Theme",
                "url": "https://soundcloud.com/user-463032126/karishmas-theme-5",
            },
            {
                "title": "Trail of Footsteps",
                "url": "https://soundcloud.com/user-463032126/trail-of-footsteps-6",
            },
        ],
        "order": 5,
    },
    {
        "id": "f7",
        "title": "Distance",
        "type": "Short Film",
        "year": 2025,
        "director": "Swapnil S. Sonawane",
        "genre": "Drama",
        "role": "Additional Music",
        "description": (
            "A poignant score exploring themes of emotional separation and "
            "connection, capturing the quiet moments between a mother and son on "
            "a rainy journey."
        ),
        "coverImage": {
            "url": "https://customer-assets.emergentagent.com/job_audio-portfolio-4/artifacts/imddbx6o_Screenshot%202026-03-19%20at%204.55.13%E2%80%AFPM.png",
            "publicId": None,
        },
        "order": 6,
    },
]

AD_PROJECTS: List[Dict[str, Any]] = [
    {
        "id": "a1",
        "title": "Sports Bag - Fuwo World",
        "brand": "Futurworks by Ludic",
        "type": "Product Film",
        "year": 2024,
        "description": (
            "Dynamic, energetic music driving the visual storytelling of this "
            "innovative sports equipment brand, blending electronic beats with "
            "athletic energy."
        ),
        "coverImage": {
            "url": "https://img.youtube.com/vi/UiHfBFXJuxY/maxresdefault.jpg",
            "publicId": None,
        },
        "youtubeId": "UiHfBFXJuxY",
        "duration": "0:47",
        "audioUrl": "/audio/placeholder.mp3",
        "order": 0,
    },
    {
        "id": "a2",
        "title": "Goodness Jo Dikhti Hai (Spec Ad)",
        "brand": "Tropicana",
        "type": "TVC",
        "year": 2024,
        "description": (
            "A fresh, uplifting composition capturing the natural goodness and "
            "vitality of Tropicana juice with warm, organic instrumentation."
        ),
        "coverImage": {
            "url": "https://img.youtube.com/vi/GoNlEWYyBRw/maxresdefault.jpg",
            "publicId": None,
        },
        "youtubeId": "GoNlEWYyBRw",
        "duration": "0:36",
        "audioUrl": "/audio/placeholder.mp3",
        "order": 1,
    },
    {
        "id": "a3",
        "title": "9 to 5 Foundation (Spec Ad)",
        "brand": "Lakmé",
        "type": "TVC",
        "year": 2024,
        "description": (
            "An elegant, confident score reflecting the modern working woman's "
            "style and the premium quality of Lakmé's foundation range."
        ),
        "coverImage": {
            "url": "https://img.youtube.com/vi/EJFCKeJqRHc/maxresdefault.jpg",
            "publicId": None,
        },
        "youtubeId": "EJFCKeJqRHc",
        "duration": "0:26",
        "audioUrl": "/audio/placeholder.mp3",
        "order": 2,
    },
    {
        "id": "a4",
        "title": "C40 Recharge (Spec Ad)",
        "brand": "Volvo",
        "type": "Brand Film",
        "year": 2024,
        "description": (
            "A sophisticated, forward-thinking score for Volvo's electric vehicle "
            "launch, combining cinematic orchestration with futuristic electronic "
            "textures."
        ),
        "coverImage": {
            "url": "https://img.youtube.com/vi/O94waW0YE1c/maxresdefault.jpg",
            "publicId": None,
        },
        "youtubeId": "O94waW0YE1c",
        "duration": "1:07",
        "audioUrl": "/audio/placeholder.mp3",
        "order": 3,
    },
    {
        "id": "a5",
        "title": "Kiara Joins the Flip Side (Spec Ad)",
        "brand": "Samsung",
        "type": "TVC",
        "year": 2024,
        "description": (
            "A trendy, youthful composition featuring Kiara Advani for Samsung's "
            "flip phone campaign, capturing style and innovation."
        ),
        "coverImage": {
            "url": "https://img.youtube.com/vi/W-iBT1haEwQ/maxresdefault.jpg",
            "publicId": None,
        },
        "youtubeId": "W-iBT1haEwQ",
        "duration": "0:34",
        "audioUrl": "/audio/placeholder.mp3",
        "order": 4,
    },
    {
        "id": "a6",
        "title": "The Singularity - Big Game Commercial (Spec Ad)",
        "brand": "Squarespace",
        "type": "Super Bowl Commercial",
        "year": 2023,
        "description": (
            "An epic, cinematic score for Squarespace's Big Game commercial, "
            "blending dramatic orchestral swells with cutting-edge sound design."
        ),
        "coverImage": {
            "url": "https://img.youtube.com/vi/To0xRwjyRLk/maxresdefault.jpg",
            "publicId": None,
        },
        "youtubeId": "To0xRwjyRLk",
        "duration": "1:37",
        "audioUrl": "/audio/placeholder.mp3",
        "order": 5,
    },
    {
        "id": "a7",
        "title": "Spice That's Just Right (Spec Ad)",
        "brand": "Lay's",
        "type": "TVC",
        "year": 2024,
        "description": (
            "A fun, flavorful composition with spicy Latin influences, perfectly "
            "matching the bold taste profile of Lay's Chili chips."
        ),
        "coverImage": {
            "url": "https://img.youtube.com/vi/1bLR9H_ZRKQ/maxresdefault.jpg",
            "publicId": None,
        },
        "youtubeId": "1bLR9H_ZRKQ",
        "duration": "0:21",
        "audioUrl": "/audio/placeholder.mp3",
        "order": 6,
    },
    {
        "id": "a8",
        "title": "Real Feel (Spec Ad)",
        "brand": "Durex",
        "type": "TVC",
        "year": 2024,
        "description": (
            "An intimate, sensual composition creating the perfect mood for "
            "Durex's premium product line with subtle, sophisticated tones."
        ),
        "coverImage": {
            "url": "https://img.youtube.com/vi/LPCpvNeTjRY/maxresdefault.jpg",
            "publicId": None,
        },
        "youtubeId": "LPCpvNeTjRY",
        "duration": "0:31",
        "audioUrl": "/audio/placeholder.mp3",
        "order": 7,
    },
]

_CREDIT_ROWS = [
    (2026, "Happy Patel: Khatarnak Jasoos", "Additional Music", "Feature Film", "Vir Das & Kavi Shastri"),
    (2025, "RBI Unlocked: Beyond the Rupee", "Additional Music", "Documentary", "Chalkboard Entertainment"),
    (2025, "Aakhri Ride", "Additional Music", "Short Film", "Vijesh Rajan & Yashoda Parthasarthy"),
    (2025, "Bombay Mon Amour", "Music Composer", "Short Film", "Independent"),
    (2025, "Distance", "Additional Music", "Short Film", "Independent"),
    (2024, "Jigra", "Additional Music", "Feature Film", "Vasan Bala"),
    (2024, "Raftaar", "Composer", "Feature Film", "Independent"),
    (2024, "Tropicana - Goodness Jo Dikhti Hai (Spec Ad)", "Composer", "Commercial", "Various"),
    (2024, "Lakmé 9 to 5 Foundation (Spec Ad)", "Composer", "Commercial", "Various"),
    (2024, "Futurworks by Ludic - Sports Bag", "Composer", "Commercial", "Don Philip Antony"),
    (2024, "Volvo C40 Recharge (Spec Ad)", "Composer", "Commercial", "Various"),
    (2024, "Samsung - Kiara Joins the Flip Side (Spec Ad)", "Composer", "Commercial", "Various"),
    (2024, "Lay's Chili - Spice That's Just Right (Spec Ad)", "Composer", "Commercial", "Various"),
    (2024, "Durex Real Feel (Spec Ad)", "Composer", "Commercial", "Various"),
    (2023, "Squarespace - The Singularity (Spec Ad)", "Composer", "Commercial", "Various"),
]

CREDITS: List[Dict[str, Any]] = [
    {
        "id": f"c{index + 1}",
        "year": year,
        "title": title,
        "role": role,
        "type": kind,
        "director": director,
        "order": index,
    }
    for index, (year, title, role, kind, director) in enumerate(_CREDIT_ROWS)
]

SINGLETONS: Dict[str, Dict[str, Any]] = {
    "site_settings": SITE_SETTINGS,
    "home_page": HOME_PAGE,
    "about_page": ABOUT_PAGE,
    "contact_page": CONTACT_PAGE,
    "films_page": FILMS_PAGE,
    "ads_page": ADS_PAGE,
    "credits_page": CREDITS_PAGE,
}
