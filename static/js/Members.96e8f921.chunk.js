(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{502:function(e,t,a){"use strict";a.r(t);var n=a(85),r=a(34),l=a(131),c=a(132),s=a(134),o=a(133),i=a(135),u=a(45),m=a.n(u),p=a(1),d=a.n(p),y=a(60),b=a(7),f=a(61),h=a(512),k=a(5),g=a.n(k),E=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,c=new Array(n),i=0;i<n;i++)c[i]=arguments[i];return(a=Object(s.a)(this,(e=Object(o.a)(t)).call.apply(e,[this].concat(c)))).generateTableHeaderCellFromUserProfileField=function(e){var t,n=e.key,l=e.type;return"multi-input-field"===l||"group"===l?d.a.createElement(p.Fragment,{key:e.key},e.content.map(a.generateTableHeaderCellFromUserProfileField)):d.a.createElement(y.z,{className:g()((t={},Object(r.a)(t,a.props.classes.stickyColumn,"Name"===n),Object(r.a)(t,a.props.classes.stickyHeader,!0),Object(r.a)(t,a.props.classes.stickyColumnHeader,"Name"===n),t)),key:e.key},e.key)},a.generateCellFromUserAndField=function(e){return function(t){var n=t.key,r=t.type;return"multi-input-field"===r||"group"===r?d.a.createElement(p.Fragment,{key:t.key},t.content.map(a.generateCellFromUserAndField(e))):d.a.createElement(y.z,{className:"Name"===n?a.props.classes.stickyColumn:"",key:t.key},e[t.key])}},a.generateRowFromUser=function(e){return d.a.createElement(y.B,{key:e.uid},f.c.map(a.generateCellFromUserAndField(e)))},a.state={users:[]},a}return Object(i.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;m.a.firestore().collection("users").get().then(function(t){e.setState({users:t.docs.map(function(e){return Object(n.a)({},e.data(),{uid:e.id})})})})}},{key:"render",value:function(){return d.a.createElement(h.a,{title:"Members Table"},d.a.createElement(y.x,{style:{whiteSpace:"nowrap"}},d.a.createElement(y.A,{className:this.props.classes.stickyHeader},d.a.createElement(y.B,null,f.c.map(this.generateTableHeaderCellFromUserProfileField))),d.a.createElement(y.y,null,this.state.users.map(this.generateRowFromUser))))}}]),t}(p.Component);E.styles=function(e){return{stickyColumn:{backgroundColor:e.palette.background.default,left:0,position:"sticky",willChange:"transform",zIndex:1},stickyColumnHeader:{zIndex:"3 !important"},stickyHeader:{backgroundColor:e.palette.background.default,top:64,position:"sticky",willChange:"transform",zIndex:2}}},t.default=Object(b.withStyles)(E.styles)(E)},512:function(e,t,a){"use strict";var n=a(85),r=a(131),l=a(132),c=a(134),s=a(133),o=a(135),i=a(60),u=a(1),m=a.n(u),p=a(515),d=a(7),y=a(61),b=a(5740),f=function(e){function t(){var e,a;Object(r.a)(this,t);for(var n=arguments.length,l=new Array(n),o=0;o<n;o++)l[o]=arguments[o];return(a=Object(c.a)(this,(e=Object(s.a)(t)).call.apply(e,[this].concat(l)))).closeDrawer=function(){a.setState({open:!1})},a.openDrawer=function(){a.setState({open:!0})},a.state={open:!1},a}return Object(o.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.children,n=t.classes,r=t.title;return m.a.createElement(u.Fragment,null,m.a.createElement(i.a,null,m.a.createElement(i.D,{className:n.toolbar},m.a.createElement(i.m,{className:n.menuButton,color:"inherit",onClick:this.openDrawer},m.a.createElement(p.c,null)),m.a.createElement(i.E,{color:"inherit",component:"h1",variant:"h5"},r))),m.a.createElement(i.e,{classes:{paper:n.drawerPaper},onClose:this.closeDrawer,open:this.state.open,variant:"temporary"},m.a.createElement(i.p,null,m.a.createElement(i.q,null,m.a.createElement(i.r,null,m.a.createElement(i.E,{variant:"h5"},"Member System"))),Object.values(y.b.private).map(function(t){return m.a.createElement(i.q,{button:!0,key:t.path,onClick:function(){return e.props.history.push(t.path)}},m.a.createElement(i.r,null,t.label))}))),m.a.createElement("div",{className:n.contentSpacer}),a)}}]),t}(u.Component);f.styles=function(e){return{contentSpacer:Object(n.a)({},e.mixins.toolbar),drawerPaper:{width:300},menuButton:{marginLeft:-12,marginRight:e.spacing.unit},toolbar:{alignItems:"center",display:"flex"}}},t.a=Object(d.withStyles)(f.styles)(Object(b.a)(f))}}]);
//# sourceMappingURL=Members.96e8f921.chunk.js.map