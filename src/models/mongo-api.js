class MongoAPI {
    constructor(db, collection) {
        this.db = db;
        this.collection = collection;
    }

    create(entity) {
        const result = this.db.collection(this.collection).insertOne(entity);
        return result;
    }

    findAll(entityFilter) {
        return this.db.collection(this.collection)
            .find(entityFilter)
            .sort({
                createdAt: -1
            })
            .toArray();
    }

    findOne(entityFilter) {
        return this.db.collection(this.collection)
            .findOne(entityFilter, (err, document) => {
                console.log(document);
            });
    }

    delete(id) {
        const result = this.db.collection(this.collection)
            .deleteOne({
                id
            });
        return !!result.deletedCount;
    }
}

module.exports = MongoAPI;