export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),  // 傳送來自 Next.js 的請求數據
      });

      const data = await response.json();
      res.status(response.ok ? 201 : 400).json(data);
    } catch (error) {
      res.status(500).json({ error: '伺服器回應錯誤' });
    }
  }
}
