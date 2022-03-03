const Waline = require('@waline/vercel');
const fetch = require('node-fetch');
module.exports = Waline({
  async preSave(comment) {
    if (/^\d+$/.test(comment.link)) {
      comment.link = 'https://space.bilibili.com/' + comment.link;
    }
    if ((!comment.nick || comment.nick === '匿名') && comment.link?.slice(0, 27) === 'https://space.bilibili.com/') {
      let uid = comment.link.slice(27);
      if (/^\d+$/.test(uid)) {
        await fetch('https://api.bilibili.com/x/space/acc/info?mid=' + uid).then(resp => resp.json()).then(json => comment.nick = json.code === 0 ? json.data.name : '');
        if (!comment.nick) {
          return {errmsg: '您输入的 UID 对应的用户可能不存在哦(´；ω；`)如果存在，那就重试一下吧awa'};
        }
      }
    }
  },
  async avatarUrl(comment) {
    if (comment.link?.slice(0, 27) === 'https://space.bilibili.com/') {
      let uid = comment.link.slice(27);
      if (/^\d+$/.test(uid)) {
        return `https://api.wuziqian211.top/api/getuser?mid=${uid}`;
      }
    } else if (!comment.mail) {
      return 'https://api.wuziqian211.top/api/getuser';
    }
  }
});
