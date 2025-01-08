const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

server.get('/api/search', (req, res) => {
  const { q } = req.query; // Nhận giá trị tìm kiếm
  if (!q) {
    return res.status(400).json({ error: 'Query parameter `q` is required' });
  }

  // Lấy dữ liệu từ `search.data`
  const results = router.db.get('search.data')
    .filter(song => {
      // Kiểm tra `q` xuất hiện trong bất kỳ thuộc tính nào
      const searchString = JSON.stringify(song).toLowerCase();
      return searchString.includes(q.toLowerCase());
    })
    .take(5)
    .value();

  // Gói kết quả trong trường "data"
  res.json({ data: results });
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use('/api' ,router)
server.listen(3001, () => {
  console.log('JSON Server is running')
})