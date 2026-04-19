const { chromium } = require('playwright');

// 直接硬编码 cookies，避免正则解析问题
const COOKIES = [
  { name: 'a1', value: '19cc397bb598teg3k7z7buyd079dg4vkd3go17vrc30000354307', domain: '.xiaohongshu.com', path: '/' },
  { name: 'access-token-creator.xiaohongshu.com', value: 'customer.creator.AT-68c517626774797213908992e2vtglmsrsiyw4hp', domain: '.xiaohongshu.com', path: '/' },
  { name: 'acw_tc', value: '0a0d0d6817765650769732422e475caf3994d10aa5abeb9e8f784ae0c16a91', domain: 'creator.xiaohongshu.com', path: '/' },
  { name: 'customer-sso-sid', value: '68c517626774797213908992e2vtglmsrsiyw4hp', domain: '.xiaohongshu.com', path: '/' },
  { name: 'customerClientId', value: '197999501906426', domain: '.xiaohongshu.com', path: '/' },
  { name: 'galaxy_creator_session_id', value: 'DGLtogqHn6Vam7bcx3vIQZ9c1QEBOZzzwsAm', domain: '.xiaohongshu.com', path: '/' },
  { name: 'galaxy.creator.beaker.session.id', value: '1775746885152096548013', domain: '.xiaohongshu.com', path: '/' },
  { name: 'gid', value: 'yYfDJ0dj2fUWyYfDJ0djy3xlqDYi7DVuySViCTS7kKWFvxq8FWjuxf88848W2jJ8dWifWS8D', domain: '.xiaohongshu.com', path: '/' },
  { name: 'web_session', value: '030037ae99bad5a913d648729c2e4a7af6d541', domain: '.xiaohongshu.com', path: '/' },
  { name: 'webId', value: '8f8168df1f263779d5ba6618431e149e', domain: '.xiaohongshu.com', path: '/' },
  { name: 'xsecappid', value: 'ugc', domain: '.xiaohongshu.com', path: '/' },
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext();
  await ctx.addCookies(COOKIES);
  const page = await ctx.newPage();
  
  console.log('打开发布页...');
  await page.goto('https://creator.xiaohongshu.com/publish/publish');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'debug-step1.png' });
  console.log('截图1已保存: debug-step1.png');
  
  // 打印所有可见文字元素
  const allText = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button, a, [role=tab], span, div'))
      .filter(el => {
        const t = el.textContent.trim();
        const rect = el.getBoundingClientRect();
        return t.length > 0 && t.length < 20 && rect.width > 0 && rect.height > 0 && el.children.length === 0;
      })
      .map(el => ({
        tag: el.tagName,
        text: el.textContent.trim(),
        class: el.className.toString().substring(0, 50),
        top: Math.round(el.getBoundingClientRect().top)
      }))
      .slice(0, 60)
  );
  console.log('页面上的文字元素:');
  allText.forEach(x => console.log(`  [${x.tag}] top=${x.top} "${x.text}" class=${x.class}`));
  
  // 尝试点击"写长文"
  console.log('\n尝试找"写长文"...');
  const longText = allText.filter(x => x.text.includes('长文') || x.text.includes('文章'));
  console.log('长文相关:', JSON.stringify(longText));
  
  await browser.close();
})();
