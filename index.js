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

  const closeButton = await page.waitForSelector('.ico_popup_close_bk')
  await closeButton.click()

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

  const closeButton2 = await page.waitForSelector('.btn_close')
  await closeButton2.click()

  const btnpagelast = await page.waitForSelector('.btn-page-last')
  await btnpagelast.click()

  const checkcurrent = await page.waitForSelector('.current')
  let element = await page.$('.current')
  let Lastpage = await (await element.getProperty('textContent')).jsonValue()

  const btnpagefirst = await page.waitForSelector('.btn-page-first')
  await btnpagefirst.click()
  
  //여기부터 logic
  let data=[];
  for(let i=1;i<=Lastpage;i++){
    //const ico = .ico
    //비교 pin024.png
    //this -> parrent > tit, parrent > address
    //{"ico":"","title":"","address",""}
//    <li>
//      <a href="javascript:moveLayerPoint('14151336.018244362','4505412.010584575');" class="item">
//      <span class="ico cate03" style="background:url(/images/legend/pin024.png);
//      background-repeat: no-repeat;background-size:contain;background-position: center;"></span>
//      <p class="tit">(주)엘엑스판토스</p>
//      <p class="address">서울특별시 송파구 송파대로 55, C동 5층 (장지동,서울복합물류)</p>
//    </a>
//    </li>


    const btnpagenext = await page.waitForSelector('.btn-page-next')
    await btnpagenext.click()
    i++;
  }
  //파일에 추가저장
  const fs = require('fs');
  fs.writeFileSync('file.json', JSON.stringify(data));

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