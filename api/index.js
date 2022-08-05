const Waline = require('@waline/vercel'), fetch = require('node-fetch'), md5 = require('md5');
module.exports = Waline({
  async preSave(comment) {
    if (/^\d+$/.test(comment.link)) {
      comment.link = 'https://space.bilibili.com/' + comment.link;
    }
    if ((!comment.nick || comment.nick === '匿名') && comment.link?.slice(0, 27) === 'https://space.bilibili.com/') {
      const uid = comment.link.slice(27);
      if (/^\d+$/.test(uid)) {
        const json = await (await fetch(`https://api.bilibili.com/x/space/acc/info?mid=${uid}`)).json();
        if (json.code === 0) {
          comment.nick = json.data.name;
        } else {
          return {errmsg: '您输入的 UID 对应的用户可能不存在哦(´；ω；`)如果存在，那就重试一下吧 awa'};
        }
      }
    }
  },
  async avatarUrl(comment) {
    if (comment.link?.slice(0, 27) === 'https://space.bilibili.com/') {
      const uid = comment.link.slice(27);
      if (/^\d+$/.test(uid)) {
        return `https://api.wuziqian211.top/api/getuser?mid=${uid}`;
      }
    } else if (comment.mail) {
      return `https://cravatar.cn/avatar/${md5(comment.mail)}?d=retro`;
    } else {
      return 'https://api.wuziqian211.top/api/getuser';
    }
  }
});
