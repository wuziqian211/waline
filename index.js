const Waline = require('@waline/vercel');

module.exports = Waline({
  async preSave(comment) {
    if (/^[0-9]+$/.test(comment.link)) {
      if (comment.nick == '' || comment.nick == '匿名') {
        const fetch = require('node-fetch');
        await fetch(`https://api.wuziqian211.top/api/getbili?mid=${comment.link}`).then(resp => resp.json()).then(json => comment.nick = json.data.name);
      }
      comment.link = 'https://space.bilibili.com/' + comment.link;
    }
  },
});
