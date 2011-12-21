if (!Widget) { var Widget = {} };

Widget.TabPanel = Backbone.View.extend({
    initialize: function() {
        this.model = new Backbone.Model(this.options);
        this.render();
    },
    render: function() {
        $(this.el).html(this.model.get("xid"));
    }
});

Widget.Tab = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, "doa");
        this.panels = {};
        this.tid = Math.floor(Math.random()*10001);
        this.render();
    },
    events: {
        "click .silk-tab": "doa"
    },
    render:function() {
        if (this.model.get("tabtype") == "custom") {
            var tabid = this.model.get("tabid");

            this.tab_wrap = $(".silk-tabs."+tabid);
            this.tabpanel_wrap = $(".silk-tabs-content." + tabid);

            this.el = $("body");
            var evc = "click .silk-tab."+tabid;
            var e = {}
            e[evc] = "doa";
            this.delegateEvents(e);

        } else {
            var template = _.template($('#tabs-widget-template').html());
            $(this.el).html(template(this.model.toJSON()));
            this.tab_wrap = this.el;
            this.tabpanel_wrap = this.el;
            this.delegateEvents({
                "click .silk-tab": "doa"
            });
        }
        if (this.model.get("activeid")) {
            $(".silk-tab[data-x='"+this.model.get("activeid")+"']", this.tab_wrap).click();
        } else {
            $(".silk-tab.active", this.tab_wrap).click();
        }
    },
    doa: function(ev) {
        var x = $(ev.target).attr("data-x");
        var tabid = this.model.get("tabid");

        $(".silk-tab."+tabid, this.tab_wrap).removeClass('active');
        $(ev.target).addClass("active");

        var t =  _.find(this.model.get("tabs"), function(z) { return z['xid'] === x });
        if (!t) {
            console.log('err: no tab');
            return;
        }

        if (!this.panels[x]) {
            this.panels[x] = new t.panel({el: $(".silk-tabpanel[data-x='"+x+"']", this.tabpanel_wrap), xid: x, tabel: $(ev.target) });
        }

        $(".silk-tabpanel."+tabid, this.tabpanel_wrap).removeClass('active');
        $(".silk-tabpanel[data-x='"+x+"']", this.tabpanel_wrap).addClass("active");

        if (this.panels[x].onactive) {
            this.panels[x].onactive();
        }

        ev.stopPropagation();
        return false;
    }
});
