const { URLSearchParams } = require("url");

let warnedMissingProvider = false;
let warnedUnknownProvider = false;

const warnOnce = (type, message) => {
  if (type === "missing" && warnedMissingProvider) {
    return;
  }
  if (type === "unknown" && warnedUnknownProvider) {
    return;
  }
  if (type === "missing") {
    warnedMissingProvider = true;
  }
  if (type === "unknown") {
    warnedUnknownProvider = true;
  }
  console.warn(`[translate] ${message}`);
};

const getFetch = () => {
  if (typeof globalThis.fetch !== "function") {
    throw new Error("Global fetch is not available. Please use Node 18+ or provide a fetch polyfill.");
  }
  return globalThis.fetch.bind(globalThis);
};

const translateWithDeepL = async (text, targetLang) => {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    warnOnce("missing", "DEEPL_API_KEY is not set; returning source text.");
    return text;
  }
  const endpoint = process.env.DEEPL_API_URL || "https://api-free.deepl.com/v2/translate";
  const params = new URLSearchParams();
  params.append("auth_key", apiKey);
  params.append("text", text);
  params.append("target_lang", targetLang.toUpperCase());
  if (process.env.DEEPL_SOURCE_LANG) {
    params.append("source_lang", process.env.DEEPL_SOURCE_LANG.toUpperCase());
  }

  const response = await getFetch()(endpoint, {
    method: "POST",
    body: params
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`DeepL translation failed (${response.status}): ${payload}`);
  }

  const data = await response.json();
  const translated = data?.translations?.[0]?.text;
  return typeof translated === "string" && translated.trim() ? translated : text;
};

const providers = {
  deepl: translateWithDeepL
};

async function translateText(text, targetLang = "es") {
  if (typeof text !== "string" || !text.trim()) {
    return text;
  }

  const providerName = (process.env.TRANSLATION_PROVIDER || "deepl").toLowerCase();
  const provider = providers[providerName];
  if (!provider) {
    warnOnce("unknown", `Unknown translation provider \"${providerName}\". Returning source text.`);
    return text;
  }

  try {
    return await provider(text, targetLang);
  } catch (error) {
    console.warn(`[translate] Failed to translate text: ${error.message}`);
    return text;
  }
}

module.exports = {
  translateText
};
