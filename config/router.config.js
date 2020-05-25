export default [
  {
    path: "/user",
    component: "../layouts/LoginLayout",
    routes: [
      { path: "/user", redirect: "/user/login" },
      { path: "/user/login", component: "./Login" }
    ]
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: "/metaData",
        name: "metaData",
        routes: [
          { path: "/metaData/notifyContent", component: "./MetaData/NotifyContent" },
          { path: "/metaData/bulletin", component: "./MetaData/Bulletin" },
          { path: "/metaData/group", component: "./Group" },
          { path: "/metaData/userBulletin", component: "./MetaData/Bulletin/userBulletin" },
          { path: "/message/msgDetail", component: "./MetaData/Bulletin/msgDetail" },
        ]
      },
      {
        path: "/message",
        name: "消息",
        routes: [
          { path: "/message/msgDetail", component: "./MetaData/Bulletin/msgDetail" },
        ]
      },
      {
        path: "/moduleName",
        name: "moduleName",
        routes: [
          { path: "/moduleName/demo", component: "./Demo" },
        ]
      }
    ],
  },
];

