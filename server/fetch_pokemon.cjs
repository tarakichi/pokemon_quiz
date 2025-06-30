// fetch_pokemon_from_pokeapi.cjs
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const saveDir = path.join(__dirname, "public", "sprites");
if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

async function getPokemonList(limit = 1010) {
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
      const types = pokemonData.types.map(t => t.type.name);
      const generation = speciesData.generation.name;
      const height = pokemonData.height;
      const weight = pokemonData.weight;
      const stats = {};
      for (const s of pokemonData.stats) {
        const key = s.stat.name.replace("-", "_");
        stats[key] = s.base_stat;
      }

      const abilities = [];
      for (const ab of pokemonData.abilities) {
        try {
          const abData = await axios.get(ab.ability.url).then(r => r.data);
          const jaAbility = abData.names.find(n => n.language.name === "ja")?.name || ab.ability.name;
          abilities.push(jaAbility);
        } catch {
          abilities.push(ab.ability.name);
        }
      }

      const isLegendary = speciesData.is_legendary;
      const isMythical = speciesData.is_mythical;
      const color = speciesData.color.name;
      const genera = speciesData.genera.find(g => g.language.name === "ja")?.genus || "";
      const jaName = speciesData.names.find(n => n.language.name === "ja")?.name || enName;
      const spriteUrl = pokemonData.sprites.other["official-artwork"].front_default;

      list.push({
        id,
        en: enName,
        ja: jaName,
        types,
        generation,
        height,
        weight,
        base_stats: stats,
        abilities,
        is_legendary: isLegendary,
        is_mythical: isMythical,
        color,
        genera,
      });

      if (spriteUrl) {
        await downloadSprite(spriteUrl, enName, id);
      }

      console.log(`✅ ${id}: ${enName} → ${jaName}`);
    } catch (err) {
      console.error(`❌ Failed: ${enName} (${err.message})`);
    }
  }

  return list;
}

async function downloadSprite(url, name, id) {
  const filePath = path.join(saveDir, `${id}.png`);
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, res.data);
    console.log(`🖼️ Downloaded sprite: ${name} - id: ${id}`);
  } catch {
    console.error(`❌ Sprite failed: ${name}`);
  }
}

(async () => {
  const list = await getPokemonList();
  fs.writeFileSync(
    path.join(__dirname, "pokemonNameMap.json"),
    JSON.stringify(list, null, 2),
    "utf-8"
  );
  console.log("📘 pokemonNameMap.json created.");
})();
