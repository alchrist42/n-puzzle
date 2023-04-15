export default async function getGif() {
  const res = await fetch(
    "https://api.giphy.com/v1/gifs/random?api_key=FLyDItjCG1JeT4Quloyo635fti61Zf7W&tag=dance"
  );
  const text = await res.text();
  return JSON.parse(text);
}
