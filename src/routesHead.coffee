
loadUser = (req, res, next) ->
    if req.session.user_id
        req.curretUser_id = req.session.user_id
        next()
    else
        res.redirect("/")

flist = []
