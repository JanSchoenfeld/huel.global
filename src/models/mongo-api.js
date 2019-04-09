class MongoAPI {
    constructor(db, collection) {
        this.db = db;
        this.collection = collection;
    }

    async create(entity) {
        const result = this.db.collection(this.collection).insertOne(entity);
        return result;
    }

    async findAll(entityFilter) {
        return this.db.collection(this.collection)
            .find(entityFilter)
            .sort({
                createdAt: -1
            })
            .toArray();
    }

    async findOne(entityFilter, projections) {
        return this.db.collection(this.collection)
            .findOne(entityFilter, {
                projection: projections
            });
    }

    async update(entity) {
        const result = await this.db.collection(this.collection)
            .updateOne({
                id: entity.id
            }, {
                $set: entity
            });
        return !!result.modifiedCount;
    }

    async delete(id) {
        const result = this.db.collection(this.collection)
            .deleteOne({
                id
            });
        return !!result.deletedCount;
    }
}

module.exports = MongoAPI;