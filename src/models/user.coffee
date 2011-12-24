db = require("../db.js")
db.bind('user')
table = db.user
class User
    constructor: () ->
        @name = ''

    createOrUpdate: (data) ->
        @id = data.id
        db.user.findOne({id: data.id}, (err, user) ->
            if err
                return console.log(err)
            if user
                console.log('found, updating: %s', data.id)
                user[attr] = value for attr, value of data
                db.user.save(user, (err) ->
                    if err
                        return console.log(err)
                    console.log('updated: %s', data.id)
                )
                return user
            else
                console.log('creating: %s', data.id)
                db.user.insert(data, (err) ->
                    if err
                        return console.log(err)
                    console.log('created: %s', data.id)
                )
            )

    this.findById = (id, cb) ->
        db.user.findOne({uid: id}, cb)

    get: (xd, cb) ->
        if xd['_id']
            table.findById(xd['_id'], "", cb)
        else
            table.findOne(xd, cb)

module.exports = User

