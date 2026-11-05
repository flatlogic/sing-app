const {test,expect} = require('@playwright/test');
test('pages, calendar, charts, tables and PJAX navigation work', async ({page}) => {
  const errors=[],missing=[];
  page.on('pageerror', error=>{errors.push(error.message);console.error(error.message)});
  page.on('response', response=>{if(response.url().startsWith('http://127.0.0.1:4325/')&&response.status()>=400)missing.push(new URL(response.url()).pathname)});
  for(const name of ['index','charts','tables','typography','icons','notifications']) {
    await page.goto('/dist/'+name+'.html');
    await expect(page.locator('body')).not.toBeEmpty();
    if(name==='index') {
      await expect(page.locator('#events-calendar table.daysmonth')).toBeVisible();
      const month = await page.locator('.visualmonthyear').innerText();
      await page.locator('#events-calendar .icon-arrow-right').click();
      await expect(page.locator('.visualmonthyear')).not.toHaveText(month);
      await page.locator('#events-calendar .icon-arrow-left').click();
      await expect(page.locator('.visualmonthyear')).toHaveText(month);
      expect(await page.evaluate(() => {
        const target = window.jQuery('<div>').appendTo(document.body).hammer();
        let called = false;
        target.on('tap', () => { called = true; });
        target.data('hammer').emit('tap', {target:target[0]});
        target.data('hammer').destroy();
        target.remove();
        return called;
      })).toBe(true);
    }
    if(name==='charts')await expect(page.locator('canvas').first()).toBeVisible();
    if(name==='tables')await expect(page.locator('table').first()).toBeVisible();
  }
  await page.goto('/dist/index.html');
  await page.locator('#sidebar a[href="#sidebar-ui"]').click();
  await page.locator('#sidebar a[href="charts.html"]').click();
  await expect(page.locator('canvas').first()).toBeVisible();
  await page.locator('#sidebar a[href="tables.html"]').click();
  await expect(page.locator('table').first()).toBeVisible();
  await page.screenshot({path:'test-results/tables.png',fullPage:true});
  expect(missing).toEqual([]);expect(errors).toEqual([]);
});
