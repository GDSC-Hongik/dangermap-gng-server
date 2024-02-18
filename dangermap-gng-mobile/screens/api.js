const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      res.statusCode = 400;
      return res.json({ error: '정보가 없습니다.' });
    }
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ko&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`;
      const { data } = await axios.get(url);
      console.log(data);
      return res.json(data);
    } catch (error) {
      res.statusCode = 404;
      return res.end();
    }
  } else {
    res.statusCode = 405;
    return res.end();
  }
};



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
