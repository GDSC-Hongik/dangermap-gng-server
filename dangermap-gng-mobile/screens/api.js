export async function getDangerData() {
  const response = await fetch('http://127.0.0.1:8000/posts')
  const body = await response.json()
  return body
}
