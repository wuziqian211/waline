const Waline = require('@waline/vercel'), fetch = require('node-fetch'), md5 = require('md5');
module.exports = Waline({
  async preSave(comment) {
    if (/^\d+$/.test(comment.link)) {
      comment.link = 'https://space.bilibili.com/' + comment.link;
    }
    if ((!comment.nick || comment.nick === '匿名') && /^https:\/\/space\.bilibili\.com\/\d+$/.test(comment.link)) {
      const json = await (await fetch(`https://api.bilibili.com/x/space/acc/info?mid=${comment.link.slice(27)}`, { headers: { Origin: 'https://space.bilibili.com', Referer: 'https://space.bilibili.com/', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' } })).json();
      if (json.code === 0) {
        comment.nick = json.data.name;
      } else {
        return { errmsg: '您输入的 UID 对应的用户可能不存在哦 (´；ω；`) 如果存在，就重试一下吧 awa' };
      }
    }
  },
  async avatarUrl(comment) {
    if (/^https:\/\/space\.bilibili\.com\/\d+$/.test(comment.link)) {
      return `https://api.wuziqian211.top/api/getuser?mid=${comment.link.slice(27)}`;
    } else if (comment.mail) {
      return `https://cravatar.cn/avatar/${md5(comment.mail)}?d=retro`;
    } else {
      const faces = ['1-22', '1-33', '2-22', '2-33', '3-22', '3-33', '4-22', '4-33', '5-22', '5-33', '6-33'];
      return `https://api.wuziqian211.top/assets/${faces[Math.floor(Math.random() * 11)]}.jpg`;
    }
  }
});
