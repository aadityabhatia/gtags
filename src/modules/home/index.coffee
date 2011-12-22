db = require("../../db.js")
module.exports = {
    slash: (req, res) ->
        if (req.session)
            if (req.session.redirectTo)
                rto = req.session.redirectTo
                delete req.session.redirectTo
                res.redirect(rto)
                return

        if req.user
            res.render("home/user")
            return

        res.render("home/anon")
}
