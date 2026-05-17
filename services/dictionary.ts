const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  definition?: string;
  example?: string;
}

interface RawMeaning {
  definitions?: { definition?: string; example?: string }[];
}

interface RawPhonetic {
  text?: string;
  audio?: string;
}

interface RawEntry {
  word?: string;
  phonetic?: string;
  phonetics?: RawPhonetic[];
  meanings?: RawMeaning[];
}

export async function fetchDictionary(word: string): Promise<DictionaryEntry | null> {
  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(word)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as RawEntry[];
    if (!Array.isArray(data) || data.length === 0) return null;
    const first = data[0];
    const audio = first.phonetics?.find((p) => p.audio && p.audio.length > 0)?.audio;
    const def = first.meanings?.[0]?.definitions?.[0];
    return {
      word: first.word ?? word,
      phonetic: first.phonetic ?? first.phonetics?.find((p) => p.text)?.text,
      audioUrl: audio,
      definition: def?.definition,
      example: def?.example,
    };
  } catch {
    return null;
  }
}
