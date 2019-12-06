module.exports = function(router, db) {
  router.get('/test', async(req, res) => {
    console.log('111');
    res.send('ok');
  })
}
