//=require Menu.js
//=require Models.js
//=require Footer.js

var HomePage = {
    controller: function(){
      this.challenges = Model.getChallenges();
      this.momentcheck = moment([2016, 6, 2]).diff(moment(),'days');

      this.challenge = function(e){
        m.route("/challenge/" + e._id);
      };
    },
    view: function(ctrl) {
        var challenges = ctrl.challenges;

        checkMenu = function(){
          if(ctrl.momentcheck <= 0){
            return m.component(Menu);
          } else {
            return "";
          }
        };

        checkChallenges = function(){
          var challenges = ctrl.challenges();
          return m("div", challenges.map(function(e){
            return m("button", {type:"submit", class: "ui no-float", onclick: ctrl.challenge.bind(ctrl, e)}, m("h2",e.title));
          }));
        };

        return m("div",[
            checkMenu(),
            m("div", {class: "ui page"}, [
                m("div", {class: "ui grid"}, [
                    m("div", {class: "ui col-12"}, [
                        m("div", {class: "ui card colorless"}, [
                            m("div", {class: "centerimage"},[
                                m("img", {class: "", src: "static/fishrow2.png"}),
                                m("h1", i18next.t('home.intro'))
                            ])
                        ])
                    ]),
                    m("div", {class: "ui col-12"}, [
                        m("div", {class: "ui card color"}, [
                            m("div", {class: "centerimage"},[
                                m("p", i18next.t('home.paragraph1')),
                                m("p", i18next.t('home.paragraph2')),
                                checkChallenges()
                            ])
                        ])
                    ]),
                    m.component(Footer)
                ])
            ])
        ]);
    }
};
