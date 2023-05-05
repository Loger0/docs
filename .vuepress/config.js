module.exports = {
  base: "./",
  title: "Roger",
  themeConfig: {
    base: "/docs/",
    lastUpdated: "更新时间",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/about/" },
      { text: "External", link: "https://google.com" },
      {
        text: "技术分类",
        items: [
          { text: "CSS", link: "/language/chinese" },
          { text: "JS", link: "/language/japanese" },
          { text: "Node", link: "/language/japanese" },
          { text: "Vue", link: "/Vue/Render/" },
        ],
      },
    ],
  },
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
