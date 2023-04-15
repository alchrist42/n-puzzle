export default async function getPuzzle(size) {
  const res = await fetch(`new_puzzle/${size}/1`);
  const text = await res.text();
  return JSON.parse(text);
}
