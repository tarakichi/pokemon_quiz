const fs = require("fs");
const path = require("path");
const axios = require("axios");
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 保存先を Vite の public/sprites に指定
const saveDir = path.join(__dirname, "public", "sprites");
if (!fs.existsSync(saveDir)) {
  fs.mkdirSync(saveDir, { recursive: true });
}

// Showdown画像に合わせた表記ゆれの変換マッピング
const nameOverrides = {
  "mr-mime": "mrmime",
  "mime-jr": "mimejr",
  "nidoran-m": "nidoranm",
  "nidoran-f": "nidoranf",
  "ho-oh": "hooh",
  "porygon-z": "porygonz",
  "type-null": "typenull",
  "jangmo-o": "jangmoo",
  "hakamo-o": "hakamoo",
  "kommo-o": "kommoo",
  "tapu-koko": "tapukoko",
  "tapu-lele": "tapulele",
  "tapu-bulu": "tapubulu",
  "tapu-fini": "tapufini",
  "oricorio-baile": "oricorio",
  "minior-red-meteor": "minior",
  "mimikyu-disguised": "mimikyu",
  "aegislash-shield": "aegislash",
  "zygarde-50": "zygarde",
  "lycanroc-midday": "lycanroc",
  "wishiwashi-solo": "wishiwashi",
  "urshifu-single-strike": "urshifu",
  "morpeko-full-belly": "morpeko",
  "eiscue-ice": "eiscue",
  "indeedee-male": "indeedee",
  "toxtricity-amped": "toxtricity",
  "meowstic-male": "meowstic",
  "keldeo-ordinary": "keldeo",
  "meloetta-aria": "meloetta",
  "landorus-incarnate": "landorus",
  "thundurus-incarnate": "thundurus",
  "tornadus-incarnate": "tornadus",
  "shaymin-land": "shaymin",
  "basculin-red-striped": "basculin",
  "pumpkaboo-average": "pumpkaboo",
  "gourgeist-average": "gourgeist",
  "mr-rime": "mrrime",
  "deoxys-normal": "deoxys"
};

// PokeAPIからポケモン名を取得
async function getPokemonNames(limit = 898) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.results.map(p => p.name);
}

// Showdownの画像をダウンロード
async function downloadImage(name) {
  const correctedName = nameOverrides[name] || name;
  const url = `https://play.pokemonshowdown.com/sprites/gen5/${correctedName}.png`;
  const filePath = path.join(saveDir, `${name}.png`);

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, response.data);
    console.log(`✅ Downloaded: ${name}`);
  } catch (err) {
    console.error(`❌ Failed: ${name} (${err.response?.status || err.message})`);
  }
}

// メイン処理
(async () => {
  const names = await getPokemonNames();
  for (const name of names) {
    await downloadImage(name);
  }
})();
