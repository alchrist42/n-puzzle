export default async function getSolution(puzzle) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:8000");
  const raw = JSON.stringify({ puzzle: puzzle });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  const response = await fetch("http://127.0.0.1:8000/solver/", requestOptions);
  return JSON.parse(await response.text());
}
