export default [
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

