const fs = require("fs");
const path = require("path");
const axios = require("axios");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const saveDir = path.join(__dirname, "public", "sprites");
if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

async function getPokemonList(limit = 898) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
  const res = await fetch(url);
  const json = await res.json();

  const list = [];
  for (const { name, url } of json.results) {
    try {
      const speciesUrl = url.replace("/pokemon/", "/pokemon-species/");
      const detail = await axios.get(speciesUrl).then(r => r.data);
      const jpName = detail.names.find(n => n.language.name === "ja")?.name || name;
      const id = detail.id;

      list.push({ id, en: name, ja: jpName });
      console.log(`✅ Name mapped: ${id}: ${name} → ${jpName}`);
    } catch (err) {
      console.error(`❌ Name fetch failed: ${name}`);
    }
  }
  return list;
}

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

(async () => {
  const list = await getPokemonList();
  fs.writeFileSync(
    path.join(__dirname, "pokemonNameMap.json"),
    JSON.stringify(list, null, 2)
  );
  console.log("📘 pokemonNameMap.json created.");

  for (const { en } of list) {
    await downloadSprite(en);
  }
})();
