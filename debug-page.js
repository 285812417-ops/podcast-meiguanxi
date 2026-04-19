const { chromium } = require('playwright');
const path = require('path');

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

  // 监听新 Tab
  ctx.on('page', p => console.log('🆕 新页面打开:', p.url()));

  await page.goto('https://creator.xiaohongshu.com/publish/publish');
  await page.waitForTimeout(3000);

  // 点击"写长文" tab
  console.log('\n步骤1: 点击「写长文」...');
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('span.title'));
    for (const el of all) {
      if (el.textContent.trim() === '写长文') {
        const rect = el.getBoundingClientRect();
        if (rect.top > 0) { el.click(); console.log('clicked'); return; }
      }
    }
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'debug-after-longarticle.png' });
  console.log('截图已保存: debug-after-longarticle.png');
  console.log('当前URL:', page.url());

  // 打印点击后的页面元素
  const els = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button, a, span, div'))
      .filter(el => {
        const t = el.textContent.trim();
        const rect = el.getBoundingClientRect();
        return t.length > 0 && t.length < 25 && rect.width > 0 && rect.height > 0 && el.children.length === 0;
      })
      .map(el => ({
        tag: el.tag, text: el.textContent.trim(),
        class: el.className.toString().substring(0, 50),
        top: Math.round(el.getBoundingClientRect().top)
      }))
      .filter(x => x.top > 70 && x.top < 400)
      .slice(0, 40)
  );
  console.log('\n点击「写长文」后页面中部元素:');
  els.forEach(x => console.log(`  top=${x.top} "${x.text}" class=${x.class}`));

  await page.waitForTimeout(2000);
  await browser.close();
})();
