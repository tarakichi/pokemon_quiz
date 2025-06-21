// const fs = require("fs");
// const path = require("path");
// const axios = require("axios");
// const fetch = (...args) =>
//   import('node-fetch').then(({ default: fetch }) => fetch(...args));

// // 保存先を Vite の public/sprites に指定
// const saveDir = path.join(__dirname, "public", "sprites");
// if (!fs.existsSync(saveDir)) {
//   fs.mkdirSync(saveDir, { recursive: true });
// }

// // ポケモン名をPokeAPIから取得
// async function getPokemonNames(limit = 898) {
//   const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
//   const res = await fetch(url);
//   const json = await res.json();
//   return json.results.map(p => p.name); // ['bulbasaur', 'ivysaur', ...]
// }

// // Showdownから画像をダウンロード
// async function downloadImage(name) {
//   const url = `https://play.pokemonshowdown.com/sprites/gen5/${name}.png`;
//   const filePath = path.join(saveDir, `${name}.png`);

//   try {
//     const response = await axios.get(url, { responseType: "arraybuffer" });
//     fs.writeFileSync(filePath, response.data);
//     console.log(`✅ Downloaded: ${name}`);
//   } catch (err) {
//     console.error(`❌ Failed: ${name} (${err.response?.status || err.message})`);
//   }
// }

// // 実行本体
// (async () => {
//   const names = await getPokemonNames(); // 全ポケモンの英語名取得
//   for (const name of names) {
//     await downloadImage(name);
//   }
// })();







// const fs = require("fs");
// const https = require("https");
// const path = require("path");

// // 🔁 表記揺れ・フォーム別などの補正マッピング
// const nameOverrides = {
//   "urshifu-single-strike": "urshifu",
//   "eiscue-ice": "eiscue",
//   "indeedee-male": "indeedee",
//   "morpeko-full-belly": "morpeko",
//   "mr-rime": "mrrime",
//   "aegislash-shield": "aegislash",
//   "keldeo-ordinary": "keldeo",
//   "tornadus-incarnate": "tornadus",
//   "thundurus-incarnate": "thundurus",
//   "landorus-incarnate": "landorus",
//   "deoxys-normal": "deoxys",
//   "shaymin-land": "shaymin",
//   "type-null": "typenull",
//   "meloetta-aria": "meloetta",
//   "zygarde-50": "zygarde",
//   "tapu-koko": "tapukoko",
//   "tapu-lele": "tapulele",
//   "tapu-bulu": "tapubulu",
//   "tapu-fini": "tapufini",
//   "minior-red-meteor": "minior",
//   "pumpkaboo-average": "pumpkaboo",
//   "gourgeist-average": "gourgeist",
//   "meowstic-male": "meowstic",
//   "basculin-red-striped": "basculin",
//   "mime-jr": "mimejr",
//   "mr-mime": "mr.mime",
//   "nidoran-m": "nidoran♂",
//   "nidoran-f": "nidoran♀",
//   "porygon-z": "porygon-z",
//   "ho-oh": "ho-oh"
// };

// // 📦 任意のポケモン名リスト（例：pokemonNameMap.json の "en" 部分）
// const pokemonList = require("./pokemonNameMap.json").map((p) => p.en);

// // 🎯 出力フォルダ作成
// const outputDir = path.resolve(__dirname, "sprites");
// if (!fs.existsSync(outputDir)) {
//   fs.mkdirSync(outputDir);
// }

// // 🌐 画像をダウンロードする関数
// function downloadImage(name, callback) {
//   const fixedName = nameOverrides[name] || name;
//   const url = `https://play.pokemonshowdown.com/sprites/ani/${fixedName}.gif`;
//   const filePath = path.join(outputDir, `${name}.gif`);

//   https
//     .get(url, (res) => {
//       if (res.statusCode === 200) {
//         const fileStream = fs.createWriteStream(filePath);
//         res.pipe(fileStream);
//         fileStream.on("finish", () => {
//           fileStream.close();
//           console.log(`✅ Downloaded: ${name}`);
//           callback();
//         });
//       } else {
//         console.warn(`❌ Failed: ${name} (${res.statusCode})`);
//         callback();
//       }
//     })
//     .on("error", (err) => {
//       console.error(`⚠️ Error: ${name} (${err.message})`);
//       callback();
//     });
// }

// // 🔁 ダウンロード処理の順次実行
// let index = 0;
// function downloadNext() {
//   if (index >= pokemonList.length) {
//     console.log("✅ All downloads complete.");
//     return;
//   }
//   const name = pokemonList[index++];
//   downloadImage(name, downloadNext);
// }

// downloadNext();



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
