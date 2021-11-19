const Waline = require('@waline/vercel');

module.exports = Waline({
  async preSave(comment) {
    if (/^[0-9]+$/.test(comment.link)) {
      comment.link = 'https://space.bilibili.com/' + comment.link;
    }
  },
});
