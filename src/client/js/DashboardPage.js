//=require Menu.js

var DashboardPage = {
    controller: function(){
        this.token = Model.token;

        this.submit = function(e){
            e.preventDefault();
            Model.updateUser({
                name: e.target.elements.username.value,
                email: e.target.elements.email.value
            }, function(e){
                if(e.success){
                    m.route("/ideas");
                }
            });
        };

        this.logout = function(e){
            Model.logout();
            m.route("/ideas");
        };
    },
    view: function(ctrl) {
        return m("div", [
            m.component(Menu),
            m("div", {class: "ui page"}, [
                m("div", {class: "ui grid"}, [
                    m("div", {class: "ui col-12"}, [
                        m("div", {class: "ui card"}, [
                            m("form", {class: "ui", onsubmit: ctrl.logout.bind(ctrl)}, [
                                m("button", {type:"submit", class: "ui"}, i18next.t('button.logout'))
                            ]),
                        ]),
                        m("h2", i18next.t('dashboardpage.profile')),
                        m("div", {class: "ui card"}, [
                            m("form", {class: "ui", onsubmit: ctrl.submit.bind(ctrl)}, [

                                m("p", {class: "label"}, i18next.t('dashboardpage.username')),
                                m("input", {name: "username", class: "ui", placeholder: i18next.t('dashboardpage.username'),value: ctrl.token().name}),
                                m("p", {class: "label"}, i18next.t('dashboardpage.email')),
                                m("input", {name: "email", class: "ui", placeholder: i18next.t('dashboardpage.username'),value: ctrl.token().email}),
                                m("button", {type: "submit", class: "ui"}, i18next.t('button.submit'))
                            ]),
                        ]),
                        m("h2", i18next.t('menu.myideas')),
                        m.component(MyIdeasOverview),
                    ]),
                    m.component(Footer)
                ]),
            ])
        ]);
    }
};

var MyIdeasOverview = {
    controller: function(){
        this.cards = Model.getMyIdeas();
    },
    view: function(ctrl){
        return m("div",
            ctrl.cards().map(function(i){
                //return m("div", i.title);
                return m.component(IdeaCard, i);
            })
        );
    }
};
