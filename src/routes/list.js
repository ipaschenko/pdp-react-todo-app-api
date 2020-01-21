module.exports = function(router, db) {
    router.post('/list', async(req, res) => {
        try {
            const newTask = {...data, user, done: false, createdAt: new Date().getTime()};
            db.collection('task').insertOne(newTask);
            res.send({success: 'Task has been created!'});
        } catch (e) {
            res.status(500).send(e);
        }
    });
};