const Waline = require('@waline/vercel');
const fetch = require('node-fetch');
module.exports = Waline({
  async preSave(comment) {
    var numExp = /^[0-9]+$/;
    if (comment.link && numExp.test(comment.link))
      comment.link = 'https://space.bilibili.com/' + comment.link;
    if ((comment.nick == '' || comment.nick == '匿名') && comment.link && comment.link.slice(0, 27) == 'https://space.bilibili.com/') {
      var uid = comment.link.slice(27);
      if (numExp.test(uid)) {
        var res = true;
        await fetch(`https://api.wuziqian211.top/getbili.js?mid=${uid}`).then(resp => resp.json()).then(json => json.code == 0 ? comment.nick = json.data.name : res = false);
        if (!res)
          return {errmsg: '您输入的 UID 对应的用户可能不存在哦(´；ω；`)如果存在，那就重试一下吧awa'};
      }
    }
  },
});
