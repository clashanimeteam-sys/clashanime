export type FeaturedAnimeCategory =
  | "legends"
  | "action"
  | "mystery"
  | "isekai"
  | "sports"
  | "romance"
  | "classics";

export type FeaturedAnimeEntry = {
  key: string;
  title: string;
  category: FeaturedAnimeCategory;
  priority: number;
  malId: number | null;
  posterUrl?: string | null;
  synopsis?: string | null;
  youtubeId?: string | null;
  malUrl?: string | null;
};

export type FeaturedAnimeCatalogSeed = {
  key: string;
  title: string;
  category: FeaturedAnimeCategory;
  priority: number;
  malId: number | null;
};

/** Curated spotlight — One Piece and legends always lead. Synced daily via Jikan. */
export const FEATURED_ANIME_CATALOG_SEED: FeaturedAnimeCatalogSeed[] = [
  { key: "one-piece", title: "One Piece", category: "legends", priority: 1, malId: 21 },
  { key: "naruto", title: "Naruto", category: "legends", priority: 2, malId: 20 },
  { key: "naruto-shippuden", title: "Naruto Shippuden", category: "legends", priority: 3, malId: 1735 },
  { key: "bleach", title: "Bleach", category: "legends", priority: 4, malId: 269 },
  { key: "dragon-ball-z", title: "Dragon Ball Z", category: "legends", priority: 5, malId: 813 },
  { key: "dragon-ball-super", title: "Dragon Ball Super", category: "legends", priority: 6, malId: 30694 },
  { key: "hunter-x-hunter", title: "Hunter x Hunter (2011)", category: "legends", priority: 7, malId: 11061 },
  { key: "detective-conan", title: "Detective Conan", category: "legends", priority: 8, malId: 235 },
  { key: "fairy-tail", title: "Fairy Tail", category: "legends", priority: 9, malId: 6702 },
  { key: "gintama", title: "Gintama", category: "legends", priority: 10, malId: 918 },
  { key: "black-clover", title: "Black Clover", category: "legends", priority: 11, malId: 34572 },
  { key: "boruto", title: "Boruto", category: "legends", priority: 12, malId: 34566 },
  { key: "attack-on-titan", title: "Attack on Titan", category: "action", priority: 20, malId: 16498 },
  { key: "demon-slayer", title: "Demon Slayer (Kimetsu no Yaiba)", category: "action", priority: 21, malId: 38000 },
  { key: "jujutsu-kaisen", title: "Jujutsu Kaisen", category: "action", priority: 22, malId: 40748 },
  { key: "my-hero-academia", title: "My Hero Academia", category: "action", priority: 23, malId: 31964 },
  { key: "chainsaw-man", title: "Chainsaw Man", category: "action", priority: 24, malId: 44511 },
  { key: "solo-leveling", title: "Solo Leveling", category: "action", priority: 25, malId: 52299 },
  { key: "kaiju-no-8", title: "Kaiju No. 8", category: "action", priority: 26, malId: 52588 },
  { key: "hells-paradise", title: "Hell's Paradise", category: "action", priority: 27, malId: 46569 },
  { key: "vinland-saga", title: "Vinland Saga", category: "action", priority: 28, malId: 37521 },
  { key: "mob-psycho", title: "Mob Psycho 100", category: "action", priority: 29, malId: 31758 },
  { key: "one-punch-man", title: "One Punch Man", category: "action", priority: 30, malId: 30276 },
  { key: "fire-force", title: "Fire Force", category: "action", priority: 31, malId: 38671 },
  { key: "tokyo-ghoul", title: "Tokyo Ghoul", category: "action", priority: 32, malId: 22319 },
  { key: "blue-exorcist", title: "Blue Exorcist", category: "action", priority: 33, malId: 9919 },
  { key: "bleach-tybw", title: "Bleach: Thousand-Year Blood War", category: "action", priority: 34, malId: 41467 },
  { key: "death-note", title: "Death Note", category: "mystery", priority: 40, malId: 1535 },
  { key: "code-geass", title: "Code Geass", category: "mystery", priority: 41, malId: 1575 },
  { key: "monster", title: "Monster", category: "mystery", priority: 42, malId: 19 },
  { key: "fma-brotherhood", title: "Fullmetal Alchemist: Brotherhood", category: "mystery", priority: 43, malId: 5114 },
  { key: "steins-gate", title: "Steins;Gate", category: "mystery", priority: 44, malId: 9253 },
  { key: "psycho-pass", title: "Psycho-Pass", category: "mystery", priority: 45, malId: 13601 },
  { key: "promised-neverland", title: "The Promised Neverland (Season 1)", category: "mystery", priority: 46, malId: 37779 },
  { key: "dorohedoro", title: "Dorohedoro", category: "mystery", priority: 47, malId: 38668 },
  { key: "erased", title: "Erased", category: "mystery", priority: 48, malId: 31043 },
  { key: "classroom-of-elite", title: "Classroom of the Elite", category: "mystery", priority: 49, malId: 35507 },
  { key: "tomodachi-game", title: "Tomodachi Game", category: "mystery", priority: 50, malId: 48605 },
  { key: "summertime-rendering", title: "Summertime Rendering", category: "mystery", priority: 51, malId: 47194 },
  { key: "pluto", title: "Pluto", category: "mystery", priority: 52, malId: 35737 },
  { key: "frieren", title: "Frieren: Beyond Journey's End", category: "mystery", priority: 53, malId: 52991 },
  { key: "mushoku-tensei", title: "Mushoku Tensei: Jobless Reincarnation", category: "isekai", priority: 60, malId: 39535 },
  { key: "re-zero", title: "Re:ZERO - Starting Life in Another World", category: "isekai", priority: 61, malId: 31240 },
  { key: "slime", title: "That Time I Got Reincarnated as a Slime", category: "isekai", priority: 62, malId: 37430 },
  { key: "overlord", title: "Overlord", category: "isekai", priority: 63, malId: 29803 },
  { key: "shield-hero", title: "The Rising of the Shield Hero", category: "isekai", priority: 64, malId: 35790 },
  { key: "sao", title: "Sword Art Online", category: "isekai", priority: 65, malId: 11757 },
  { key: "eminence-in-shadow", title: "Eminence in Shadow", category: "isekai", priority: 66, malId: 48316 },
  { key: "made-in-abyss", title: "Made in Abyss", category: "isekai", priority: 67, malId: 34599 },
  { key: "dororo", title: "Dororo", category: "isekai", priority: 68, malId: 37520 },
  { key: "berserk", title: "Berserk (1997)", category: "isekai", priority: 69, malId: 33 },
  { key: "claymore", title: "Claymore", category: "isekai", priority: 70, malId: 1818 },
  { key: "haikyuu", title: "Haikyu!!", category: "sports", priority: 80, malId: 20583 },
  { key: "blue-lock", title: "Blue Lock", category: "sports", priority: 81, malId: 49596 },
  { key: "kuroko", title: "Kuroko's Basketball", category: "sports", priority: 82, malId: 11771 },
  { key: "hajime-no-ippo", title: "Hajime no Ippo", category: "sports", priority: 83, malId: 263 },
  { key: "slam-dunk", title: "Slam Dunk", category: "sports", priority: 84, malId: 170 },
  { key: "diamond-ace", title: "Diamond no Ace", category: "sports", priority: 85, malId: 18689 },
  { key: "free", title: "Free!", category: "sports", priority: 86, malId: 18507 },
  { key: "yowamushi-pedal", title: "Yowamushi Pedal", category: "sports", priority: 87, malId: 19159 },
  { key: "aoashi", title: "Aoashi", category: "sports", priority: 88, malId: 50629 },
  { key: "violet-evergarden", title: "Violet Evergarden", category: "romance", priority: 90, malId: 33352 },
  { key: "your-lie-in-april", title: "Your Lie in April", category: "romance", priority: 91, malId: 23273 },
  { key: "kaguya-sama", title: "Kaguya-sama: Love is War", category: "romance", priority: 92, malId: 37999 },
  { key: "spy-x-family", title: "Spy x Family", category: "romance", priority: 93, malId: 50265 },
  { key: "oshi-no-ko", title: "Oshi no Ko", category: "romance", priority: 94, malId: 52034 },
  { key: "horimiya", title: "Horimiya", category: "romance", priority: 95, malId: 40417 },
  { key: "a-silent-voice", title: "A Silent Voice", category: "romance", priority: 96, malId: 28851 },
  { key: "your-name", title: "Your Name", category: "romance", priority: 97, malId: 32281 },
  { key: "anohana", title: "Anohana: The Flower We Saw That Day", category: "romance", priority: 98, malId: 9989 },
  { key: "gto", title: "Great Teacher Onizuka (GTO)", category: "romance", priority: 99, malId: 325 },
  { key: "grand-blue", title: "Grand Blue", category: "romance", priority: 100, malId: 37105 },
  { key: "fruits-basket", title: "Fruits Basket", category: "romance", priority: 101, malId: 38680 },
  { key: "clannad", title: "Clannad: After Story", category: "romance", priority: 102, malId: 4181 },
  { key: "ranking-of-kings", title: "Ranking of Kings", category: "romance", priority: 103, malId: 49709 },
  { key: "bocchi-the-rock", title: "Bocchi the Rock!", category: "romance", priority: 104, malId: 47917 },
  { key: "evangelion", title: "Neon Genesis Evangelion", category: "classics", priority: 110, malId: 30 },
  { key: "cowboy-bebop", title: "Cowboy Bebop", category: "classics", priority: 111, malId: 1 },
  { key: "cyberpunk-edgerunners", title: "Cyberpunk: Edgerunners", category: "classics", priority: 112, malId: 42310 },
  { key: "gurren-lagann", title: "Gurren Lagann", category: "classics", priority: 113, malId: 2001 },
  { key: "ghost-in-shell", title: "Ghost in the Shell", category: "classics", priority: 114, malId: 43 },
  { key: "akira", title: "Akira", category: "classics", priority: 115, malId: 47 },
  { key: "spirited-away", title: "Spirited Away", category: "classics", priority: 116, malId: 199 },
  { key: "princess-mononoke", title: "Princess Mononoke", category: "classics", priority: 117, malId: 164 },
  { key: "howls-moving-castle", title: "Howl's Moving Castle", category: "classics", priority: 118, malId: 431 },
];

export function buildFeaturedAnimeCatalogSeed(): FeaturedAnimeCatalogSeed[] {
  return [...FEATURED_ANIME_CATALOG_SEED].sort((a, b) => a.priority - b.priority);
}
