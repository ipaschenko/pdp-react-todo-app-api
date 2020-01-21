const ObjectID = require('mongodb').ObjectID;

module.exports = function(router, dbCollection) {
    router.get('/list', async(req, res) => {
        try {
            const user = req.user.sub;
            let data = await dbCollection.find({user}).toArray();
            res.send(data);
        } catch (e) {
            res.status(500).send(e);
        }
    });

    router.post('/list', async(req, res) => {
        try {
            const user = req.user.sub;
            const data = req.body;
            await dbCollection.insertOne({...data, user, done: false, createdAt: new Date().getTime()});
            res.send({success: 'Task has been created!'});
        } catch (e) {
            res.status(500).send(e);
        }
    });

    router.delete('/list/:id', async(req, res) => {
        try {
            const user = req.user.sub;
            await dbCollection.deleteOne({user, _id: ObjectID(req.params.id)});
            res.send({success: 'Task has been deleted'});
        } catch (e) {
            res.status(500).send(e);
        }
    });

    router.patch('/list/:id', async(req, res) => {
        try {
            const user = req.user.sub;
            await dbCollection
                .findOneAndUpdate({user, _id: ObjectID(req.params.id)}, {$set: {...req.body}});
            res.send({success: 'Task has been done'});
        } catch (e) {
            res.status(500).send(e);
        }
    });
};