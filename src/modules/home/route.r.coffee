flist.push((app) ->
    cindex = require("./controllers/home/index")
    app.get("/", cindex.slash);
)
