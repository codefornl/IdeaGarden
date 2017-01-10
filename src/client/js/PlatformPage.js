//=require Menu.js

var PlatformPage = {
   view: function() {
       return m("div",[
           m.component(Menu),
           m("div", {class: "ui page"}, [
               m("div", {class: "ui grid"}, [
                   m("div", {class: "ui col-12"}, [
                       m("div", {class: "ui card base"}, [
                           m("p", {class: "centerimage"},[
                               m("h1", "crowdsourcing"),
                               m("div", {class: "stage"}, [
                                   m("p", [
                                       "Ideeënvijver is een open source crowdsourcing platform ontwikkeld door code for NL. Dit platform is van iedereen."
                                   ]),
                               ]),
                               m("div",{class: "social"},[
                                 m("a", {href: "mailto:ideeenvijver@codefor.nl"}, "ideeenvijver@codefor.nl")
                               ])
                           ])
                       ])
                   ]),
                   m.component(Footer)
               ])
           ])
       ]);
   }
};
