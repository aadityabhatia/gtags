var Gtags = {
    slugify: function(text) {
	    text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
	    text = text.replace(/-/gi, "_");
	    text = text.replace(/\s/gi, "-");
	    return text;
    },
    user: {access_token: "ya29.AHES6ZSASwtkE0vsMmSxQC4c2wb9jQGaxHZJvGo3T1Wc8_Q"},

    fetch: {}
}

Gtags.fetch.appview = Backbone.View.extend({
    el: "body",
    initialize: function() {
        _.bindAll(this, "dofetch", "docurate", "sho_newpage", "sho_newsecn", "do_newpage", "do_newsecn", "hide_newpage", "hide_newsecn");
    },
    events: {
        "click .fetch": "dofetch",
        "click .curate": "docurate",
        "click .newpage .control": "sho_newpage",
        "click .newsecn .control": "sho_newsecn",
        "click .newpage .close": "hide_newpage",
        "click .newsecn .close": "hide_newsecn",
        "click .newpage .add": "do_newpage",
        "click .newsecn .add": "do_newsecn"
    },
    render: function() {
    },
    dofetch: function(ev) {
        var v = $("input[name='plusid']").val();
        if (!v) {
            v = "117768249628956879760";
        }
        var template = _.template($("#post-list-tpl").html())
        var self = this;
        var url = "https://www.googleapis.com/plus/v1/people/"+v+"/activities/public?access_token=" + Gtags.user.access_token;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "jsonp",
            success: function(jd) {
                console.log('aloha');
                Gtags.posts = new Backbone.Collection(jd['items']);
                console.log(Gtags.posts.length);
                $(".postlist", self.el).html(template({result: jd}));
            }
        });
        ev.stopPropagation();
        return false;
    },
    docurate: function(ev) {
        var template = _.template($("#post-curate-tpl").html())
        var topel = $(ev.target).closest(".apost");
        var id = $(topel).attr("data-x");
        console.log(id);
        var p = Gtags.posts.find(function(m) { return m.get("id") == id });
        var slug = Gtags.slugify(p.get("title").substring(0, 50));
        var d = {
            slug: slug,
            gurl: "http://gta.gs/u/"+p.get("actor").id+"/"+slug
        }
        $(".curate_spot", this.el).html(template({item: d}));
    },
    sho_newpage: function(ev) {
        var topel = $(ev.target).closest(".newpage");
        $(".entry_wrap", topel).show();
        $(".control_wrap", topel).hide();
    },
    sho_newsecn: function(ev) {
        console.log('sho_newsecn');
        var topel = $(ev.target).closest(".newsecn");
        $(".entry_wrap", topel).show();
        $(".control_wrap", topel).hide();
    },
    do_newpage: function(ev) {
        var topel = $(ev.target).closest(".newpage");
        var v = $(".entry", topel).val();
        console.log(v);
        $(".pagelist", topel).html(v);
        $(".entry", topel).val("");
        $(".entry_wrap", topel).hide();
        $(".control_wrap", topel).show();
    },
    do_newsecn: function(ev) {
        var topel = $(ev.target).closest(".newsecn");
        var v = $(".entry", topel).val();
        console.log(v);
        $(".secnlist", topel).html(v);
        $(".entry", topel).val("");
        $(".entry_wrap", topel).hide();
        $(".control_wrap", topel).show();
    },
    hide_newpage: function(ev) {
        var topel = $(ev.target).closest(".newpage");
        $(".entry_wrap", topel).hide();
        $(".control_wrap", topel).show();
    },
    hide_newsecn: function(ev) {
        var topel = $(ev.target).closest(".newsecn");
        $(".entry_wrap", topel).hide();
        $(".control_wrap", topel).show();
    }
});

$(document).ready(function() {
    $('input, textarea').placeholder();
    var appv = new Gtags.fetch.appview();
});
