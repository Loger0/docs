module.exports = {
  base: "/docs/",
  title: "Roger",
  themeConfig: {
    base: "/docs/",
    collapsable: true,
    sidebarDepth: 2,
    nav: require("./public/nav"),
    sidebar: require("./public/sidebar"),
  },
  head: [["link", { rel: "icon", href: "/assets/img/bitbug_favicon.ico" }]],
  plugins: [
    [
      "cursor-effects",
      {
        size: 2, // 粒子大小
        shape: "star", // 粒子形状（可选 'star' 和 'circle'）
        zIndex: 999999999,
      },
    ],
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          // Don't forget to install moment yourself
          const moment = require("moment");
          moment.locale(lang);
          return moment(timestamp).format("LLLL");
        },
      },
    ],
  ],
};
