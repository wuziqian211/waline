const Waline = require('@waline/vercel');

module.exports = Waline({
  async preSave(comment) {
    var numExp = /^[0-9]+$/;
    if (numExp.test(comment.link))
      comment.link = 'https://space.bilibili.com/' + comment.link;
    if ((comment.nick == '' || comment.nick == '匿名') && comment.link.slice(0, 27) == 'https://space.bilibili.com/') {
      var uid = comment.link.slice(27);
      if (numExp.test(uid)) {
        var res = true;
        const fetch = require('node-fetch');
        await fetch(`https://api.wuziqian211.top/api/getbili?mid=${uid}`).then(resp => resp.json()).then(function(json) {
          if (json.code != 0) {
            res = false;
            return;
          }
          comment.nick = json.data.name;
        });
        if (!res)
          return {errmsg: '您输入的UID对应用户可能不存在哦(´；ω；`)如果存在，重试一下吧awa'};
      }
    }
  },
});
