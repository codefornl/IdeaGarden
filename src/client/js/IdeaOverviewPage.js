//=require Menu.js
//=require VoteButtons.js
//=require Models.js

var IdeaOverviewPage = {
    view: function() {
        return m("div",[
            m.component(Menu),
            m("div", {class: "ui page"}, [
                m("div", {class: "ui grid"}, [
                    m("div", {class: "ui col-3"}, [
                        m("div", {class: "ui card"}, "hello this is a card"),
                    ]),
                    m("div", {class: "ui col-9"}, m.component(SubmitCard)),
                ]),

                m.component(IdeaGrid)
            ])
        ]);
    }
};

var SubmitCard = {
    controller: function(){
        this.submit = function(e){
            e.preventDefault();

            var elements = e.target.elements;
            Model.addIdea({
                title: elements.title.value,
                summary: elements.summary.value,
                email: elements.email.value
            });

            return false;
        };
    },
    view: function(ctrl) {
        return m("form", {class: "ui card", onsubmit: ctrl.submit.bind(ctrl)}, [
            m("input", {class: "ui", name: "title", placeholder: "Geef je idee een titel..."}),
            m("textarea", {class: "ui", name: "summary", placeholder: "Omschrijf je idee..."}),
            m("input", {class: "ui", name: "email", placeholder: "Email adres..."}),
            m("button", {type:"submit", class: "ui"}, "submit")
        ]);
    }
};


var IdeaGrid = {
    controller: function(){
        this.cards = Model.getOverview();
    },
    view: function(ctrl){
        return m("div", {class: "ui grid"},
            ctrl.cards().map(function(e){
                return m("div", {class: "ui col-6"}, [
                    m.component(IdeaCard, e)
                ]);
            })
        );
    }
};

var IdeaCard = {
    controller: function(data){
        this.id = data.id;
        this.open = function(){
            m.route("/idea/"+this.id);
        };

        this.onvote = function(value){
            Model.voteIdeaOverview(this.id, value);
        };
    },
    view: function(ctrl, data){
        ctrl.id = data.id;
        return m("div", {class: "ui card ideacard"}, [
            m("div", {class: "top"},[
                m("div", {class: "status"}, [
                    m("img", {src:"static/stage2.png"})
                ]),
                m("div", {class: "info"}, [
                    m("h3",{class: "ui", onclick: ctrl.open.bind(ctrl)}, data.title),
                    m("p", data.summary)
                ]),
            ]),
            m("div", {class: "bottom"},[
                m.component(VoteButtons, ctrl.onvote.bind(ctrl)),
                m("span", {class: "metric"}, [
                    m("span", {class:"number"}, data.votes),
                    m("span", {class:"label"}, "kudos")
                ])
            ])
        ]);
    }
};
