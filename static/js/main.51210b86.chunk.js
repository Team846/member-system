(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{277:function(e,t,n){e.exports=n(500)},500:function(e,t,n){"use strict";n.r(t);var a=n(131),r=n(132),l=n(134),o=n(133),i=n(135),u=n(84),c=n(208),s=n(60),m=n(7),p=n(80),b=n(45),h=n.n(b),d=n(1),v=n.n(d),f=n(5736),y=n(5737),g=n(5739),E=n(5740),O=n(61),j=n(136);n(479);function w(e){var t=e.component,n=Object(u.a)(e,["component"]);return v.a.createElement(f.a,Object.assign({render:function(e){return null!==h.a.auth().currentUser?v.a.createElement(t,e):v.a.createElement(y.a,{to:{pathname:O.b.public.LOGIN.path,state:{from:e.location}}})}},n))}var S=function(e){function t(){var e,n;Object(a.a)(this,t);for(var r=arguments.length,i=new Array(r),u=0;u<r;u++)i[u]=arguments[u];return(n=Object(l.a)(this,(e=Object(o.a)(t)).call.apply(e,[this].concat(i)))).state={authEvaluation:void 0},n}return Object(i.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.unsubscribe=h.a.auth().onAuthStateChanged(function(t){e.setState({authEvaluation:t})})}},{key:"componentWillUnmount",value:function(){this.unsubscribe()}},{key:"render",value:function(){return void 0!==this.state.authEvaluation?v.a.createElement(j.SnackbarProvider,{maxStack:3},v.a.createElement(d.Fragment,null,v.a.createElement(s.c,null),v.a.createElement(m.MuiThemeProvider,{theme:t.theme},v.a.createElement(g.a,null,Object.values(O.b.public).map(t.routeFromDescriptor(f.a)),Object.values(O.b.private).map(t.routeFromDescriptor(w)),v.a.createElement(f.a,{render:function(e){return v.a.createElement(y.a,Object.assign({to:{pathname:"/login"}},e))}}))))):null}}]),t}(d.Component);S.routeFromDescriptor=function(e){return function(t){var n=t.resolve,a=Object(u.a)(t,["resolve"]);return v.a.createElement(e,Object.assign({component:Object(c.asyncComponent)({resolve:n}),key:t.path},a))}},S.theme=Object(m.createMuiTheme)({palette:{primary:p.deepOrange},typography:{useNextVariants:!0}});var k=Object(E.a)(S),I=n(5738),P=n(18),L=n.n(P);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(495);h.a.initializeApp({apiKey:"AIzaSyC5DIBtTgvBFH7RTu3d4LFUtsvtQ9OXyqQ",authDomain:"member-system-38390.firebaseapp.com",databaseURL:"https://member-system-38390.firebaseio.com",projectId:"member-system-38390",storageBucket:"member-system-38390.appspot.com",messagingSenderId:"299255312336"});var R=v.a.createElement(I.a,null,v.a.createElement(k,null));L.a.render(R,document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},61:function(e,t,n){"use strict";n.d(t,"a",function(){return s}),n.d(t,"b",function(){return p}),n.d(t,"c",function(){return d});var a=n(85),r=n(34),l=n(60),o=n(209),i=n.n(o),u=n(1),c=n.n(u),s=function(e){return function(t){var n,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"onChange",l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"value",o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(e){return e.target.value};return n={},Object(r.a)(n,a,function(){e.setState(Object(r.a)({},t,o.apply(void 0,arguments)))}),Object(r.a)(n,l,e.state[t]),n}},m=function(e){return e.default},p={private:{MAILING_LISTS:{label:"Mailing Lists",path:"/mailing-lists",resolve:function(){return Promise.all([n.e(0),n.e(2)]).then(n.bind(null,501)).then(m)}},MEMBERS_TABLE:{label:"Members",path:"/members",resolve:function(){return Promise.all([n.e(0),n.e(3)]).then(n.bind(null,502)).then(m)}},PROFILE_EDITOR:{label:"Profile Editor",path:"/",resolve:function(){return Promise.all([n.e(0),n.e(9),n.e(4)]).then(n.bind(null,503)).then(m)}}},public:{LOGIN:{label:"Login",path:"/login",resolve:function(){return n.e(5).then(n.bind(null,504)).then(m)}},REGISTER:{label:"Register",path:"/register",resolve:function(){return n.e(6).then(n.bind(null,505)).then(m)}},RESET:{label:"Reset",path:"/reset",resolve:function(){return n.e(7).then(n.bind(null,506)).then(m)}}}},b=function(e){return c.a.createElement(i.a,Object.assign({mask:"(999) 999-9999",maskChar:"#",alwaysShowMask:!0},e))},h=function(e){return"Student"===e.Role},d=[{label:"Name"},{label:"Email"},{label:"Gender",options:["Male","Female","Other"],type:"select"},{content:[{InputProps:b.props={inputComponent:b,startAdornment:c.a.createElement(l.n,{position:"start"},"+1")},label:"Number"},{label:"Type",options:["Cell","Home"],type:"select"}],label:"Primary Phone",type:"multi-input-field"},{content:[{InputProps:b.props,label:"Number"},{label:"Type",options:["Cell","Home"],type:"select"}],label:"Backup Phone",type:"multi-input-field"},{content:[{label:"Line 1"},{label:"Line 2"},{label:"Zip Code"}],label:"Home Address",type:"multi-input-field"},{label:"Teams",multiple:!0,options:["Animation","Design","Electrical","Hardware","Software"],type:"select"},{label:"Role",options:["Mentor","Student","Other"],type:"select"},{condition:h,label:"Student ID"},{condition:h,label:"Graduation Year"},{condition:h,content:[{label:"Name"},{label:"Email"},{label:"Employer"}],label:"Parent 1",type:"group"},{condition:h,content:[{label:"Name"},{label:"Email"},{label:"Employer"}],label:"Parent 2",type:"group"}].map(function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return function(n){var r;return r="multi-input-field"===n.type||"group"===n.type?Object(a.a)({},n,{content:n.content.map(e("".concat(t+n.label," ")))}):Object.assign({type:"text"},n),Object(a.a)({condition:function(){return!0}},r,{key:t+r.label})}}())}},[[277,10,8]]]);
//# sourceMappingURL=main.51210b86.chunk.js.map