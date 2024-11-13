export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const formData = new FormData();
      formData.append('name', req.body.name);
      formData.append('description', req.body.description);
      formData.append('price', req.body.price);
      formData.append('image', req.body.image);

      console.log(req.body.price);
      console.log(req.body.image);
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        
        body: req.body,  // 傳送來自 Next.js 的請求數據
      });

      const data = await response.json();
      res.status(response.ok ? 201 : 400).json(data);
    } catch (error) {
      res.status(500).json({ error: '伺服器回應錯誤~' });
    }
  }
}