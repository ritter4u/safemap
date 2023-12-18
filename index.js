const puppeteer = require('puppeteer-core');

(async () => { 
  const browser = await puppeteer.launch({ // Puppeteer용 브라우저 실행
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' 
    ,defaultViewport : {
      width: 1280,
      height: 960
    }
    ,headless : false
    });

  const page = await browser.newPage(); // 신규 탭(페이지) 생성

  await page.goto('https://safemap.go.kr/main/smap.do?flag=2#'); // 해당 URL로 이동

  const englishButton = await page.waitForSelector('.ico_popup_close_bk')
  await englishButton.click()

  const searchOption = await page.waitForSelector('#srchType')
  await page.select('select#srchType', 'srch_place')
  
  //arg로 구를 받던지 여튼 가변으로
  const searchield = await page.waitForSelector('#srchWeb')
  await searchield.type('강남구')
  const searchbutton = await page.waitForSelector('#btn_srch')
  await searchbutton.click()
  const hazard = await page.waitForSelector('li[title="재난"] > a')
  await hazard.click()

  // const insu = await page.waitForSelector('.web-menu > a.tag-tab:not([id]):contains("재난배상책임보험")')
  // await insu.click()
  const insu = await page.waitForSelector('.web-menu > a.tagTab-cont05')
  await insu.click()

  const Insur_fake = await page.waitForSelector('#Insur_fake')
  await Insur_fake.click()

  const englishButton2 = await page.waitForSelector('.btn_close')
  await englishButton2.click()


  const btnpagelast = await page.waitForSelector('.btn-page-last')
  await btnpagelast.click()

  const checkcurrent = await page.waitForSelector('.current')
  let element = await page.$('.current')
  let Lastpage = await (await element.getProperty('textContent')).jsonValue()

  const btnpagefirst = await page.waitForSelector('.btn-page-first')
  await btnpagefirst.click()
  
  //여기부터 logic 
  for(var i=1;i<=Lastpage;i++){

    i++;
  }
  
{/* <div class="row tagTab-cont" id="tagTab-cont05" style="display: block;">
    <p class="majorCont-subTit">재난배상책임보험</p>
    <button type="button" class="tagTab-cont-close">닫기</button>
    <ul class="list-type1 col-2 form-check web-menu">
        <li><input type="checkbox" name="chk2" id="Insur_fake" onclick="clickCheckBox('Insur', this, 'tagTab-cont05');" value="재난배상책임보험"><label for="Insur_fake" tabindex="0" onkeydown="keydownLabel(this)">재난배상책임보험</label> </li>
        <li><input type="checkbox" id="Insur_link" name="chk2" onclick="insurNewTab(this)"><label for="Insur_link" tabindex="0" onkeydown="keydownLabel(this)">시설물조회</label> </li>
    </ul>
</div> */}

//   const [button] = await page.$x("//button[contains(., 'Button text')]");
// if (button) {
//     await button.click();
// }

  // <div class="srch_place srch_inp_box" style="display: block;">
  //     <input type="text" id="srchWeb" class="srch_inp" placeholder="장소, 지역 검색">
  //     <button type="button" id="btn_srch" class="btn-mapSearch"><span class="hidden">검색</span></button>
  // </div>
  // const searchBox = await page.waitForSelector('#searchInput')
  // await searchBox.type('telephone')
  
  // await page.keyboard.press('Enter')



  // await browser.close(); // 브라우저 종료
})();