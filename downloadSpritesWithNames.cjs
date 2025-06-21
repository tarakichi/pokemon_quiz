const fs = require("fs");
const path = require("path");
const axios = require("axios");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const saveDir = path.join(__dirname, "public", "sprites");
if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

// ポケモン情報取得関数
async function getPokemonList(limit = 898) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
  const res = await fetch(url);
  const json = await res.json();

  const list = [];

  for (const { name: enName, url: pokemonUrl } of json.results) {
    try {
      const pokemonData = await axios.get(pokemonUrl).then(r => r.data);

      const speciesUrl = pokemonUrl.replace("/pokemon/", "/pokemon-species/");
      const speciesData = await axios.get(speciesUrl).then(r => r.data);

      const id = pokemonData.id;
      const types = pokemonData.types.map(t => t.type.name); // ['grass', 'poison']
      const generation = speciesData.generation.name;        // 'generation-i'
      const jaName =
        speciesData.names.find(n => n.language.name === "ja")?.name || enName;

      list.push({
        id,
        en: enName,
        ja: jaName,
        types,
        generation
      });

      console.log(`✅ ${id}: ${enName} → ${jaName} [${types.join(", ")}] (${generation})`);
    } catch (err) {
      console.error(`❌ Failed: ${enName} (${err.message})`);
    }
  }

  return list;
}

// スプライトDL
async function downloadSprite(en) {
  const url = `https://play.pokemonshowdown.com/sprites/gen5/${en}.png`;
  const filePath = path.join(saveDir, `${en}.png`);
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, res.data);
    console.log(`🖼️ Downloaded sprite: ${en}`);
  } catch {
    console.error(`❌ Sprite failed: ${en}`);
  }
}

// 実行
(async () => {
  const list = await getPokemonList();
  fs.writeFileSync(
    path.join(__dirname, "pokemonNameMap.json"),
    JSON.stringify(list, null, 2),
    "utf-8"
  );
  console.log("📘 pokemonNameMap.json created.");

  for (const { en } of list) {
    await downloadSprite(en);
  }
})();
