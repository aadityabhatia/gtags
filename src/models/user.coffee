db = require("../db.js")
db.bind('user')
table = db.user
class User
    constructor: () ->
        @name = ''

    findOrCreate: (data) ->
        console.log('User: findOrCreate '+JSON.stringify(data))
        @id = data.id
        db.user.findOne({uid: @id}, (err, ru) ->
            if err
                return console.log('find err')
            if ru
                console.log('found: %s', @id)
            else
                console.log('creating: %s', @id)
                data.uid = data.id
                db.user.insert(data, (err) ->
                    if err 
                        return console.log('insert err')
                    console.log('inserted')
                )
            )

    this.findById = (id, cb) ->
        db.user.findOne({uid: id}, cb)

    find: (ud, cb) ->
        db.user.findOne(ud, (err, ru) ->
            if err
                return console.log('find err')
            if ru
                console.log('fu have ru ')
                ru.id = ru.fbid
                cb(null, ru)
            else
                cb(null, null)
            )

    get: (xd, cb) ->
        if xd['_id']
            table.findById(xd['_id'], "", cb)
        else
            table.findOne(xd, cb)

module.exports = User
