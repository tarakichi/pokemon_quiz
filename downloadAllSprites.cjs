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

// ポケモン名をPokeAPIから取得
async function getPokemonNames(limit = 898) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.results.map(p => p.name); // ['bulbasaur', 'ivysaur', ...]
}

// Showdownから画像をダウンロード
async function downloadImage(name) {
  const url = `https://play.pokemonshowdown.com/sprites/gen5/${name}.png`;
  const filePath = path.join(saveDir, `${name}.png`);

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, response.data);
    console.log(`✅ Downloaded: ${name}`);
  } catch (err) {
    console.error(`❌ Failed: ${name} (${err.response?.status || err.message})`);
  }
}

// 実行本体
(async () => {
  const names = await getPokemonNames(); // 全ポケモンの英語名取得
  for (const name of names) {
    await downloadImage(name);
  }
})();
