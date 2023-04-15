export default async function getPuzzle(size) {
  const res = await fetch(`new_puzzle/${size}`);
  const text = await res.text();
  return JSON.parse(text);
}
