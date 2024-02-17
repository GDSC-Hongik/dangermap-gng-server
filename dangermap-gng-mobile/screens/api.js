export async function getDangerData() {
  const response = await fetch('http://127.0.0.1:8000/posts')
  const body = await response.json()
  return body
}

export async function getDangerUserData(userEmail) {
  try {
    let email = userEmail
    const response = await fetch(
      `http://127.0.0.1:8000/posts/email/?user_email=${email}`,
    )
    const body = await response.json()
    return body
  } catch (error) {
    console.error('Error fetching danger user data:', error)
    throw error
  }
}

export async function postDangerData(data) {
  try {
    const response = await fetch('http://127.0.0.1:8000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error posting danger data:', error)
    throw error
  }
}
