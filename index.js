const puppeteer = require("puppeteer");
const converter = require("json-2-csv");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    // Puppeteer용 브라우저 실행
    //        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    //        ,
    defaultViewport: {
      width: 1280,
      height: 1024,
    },
    headless: false,
  });

  const page = await browser.newPage(); // 신규 탭(페이지) 생성

  await page.goto("https://safemap.go.kr/main/smap.do?flag=2#"); // 해당 URL로 이동

  const closeButton = await page.waitForSelector(".ico_popup_close_bk");
  await closeButton.click();

  //행정구역 가져오는 로직
  const crime = await page.waitForSelector('li[title="치안"] > a');
  await crime.click();
  const crime_all = await page.waitForSelector(".web-menu > a.tagTab-cont06");
  await crime_all.click();
  const woman0_fake = await page.waitForSelector("#woman0_fake");
  await woman0_fake.click();

  const closeButton2 = await page.waitForSelector(".btn_close");
  await closeButton2.click();

  //우측패널확인
  const right_pannel_handle = await page.$("#map-right-panels");
  const right_pannelclassName = await (
    await right_pannel_handle.getProperty("className")
  ).jsonValue();
  const is_open_pannel = await right_pannelclassName.includes("open");

  if (is_open_pannel === false) {
    const right_pannel = await page.waitForSelector("#map-right-panels");
    await right_pannel.click();
  }

  //시도 가져오기
  //#locationCity > li
  //  let location_map = [];
  //  let location = await page.evaluate(() => {
  //    let temp = [];
  //    document.querySelectorAll("#locationCity > li").forEach((el) => {
  //      temp.push({
  //        sido: el.,
  //        id: el,
  //      });
  //    });
  //    return temp;
  //  });
  //  console.log(location);

  //
  //    })

  //각시도마다 시군구 가져오기
  //#locationBorough > li
  //각 시도마다 아래 시군구 붙이기

  //데이터 준비 끝

  //검색으로
  const searchOption = await page.waitForSelector("#srchType");
  await page.select("select#srchType", "srch_place");

  //arg로 구를 받던지 여튼 가변으로
  const searchield = await page.waitForSelector("#srchWeb");
  await searchield.type("강남구");
  const searchbutton = await page.waitForSelector("#btn_srch");
  await searchbutton.click();

  //줌레벨
  //    <div class="web_zoom_box btn-group-vertical-full">
  //        <button type="button" class="btn btn-default btn-tooltip tooltip-left zoom_plus"
  //                onclick="mapZoomControlPlusRe()">
  //            <i></i>
  //            <span class="txt">확대</span>
  //        </button>
  //  <button type="button" class="btn btn-default btn-tooltip tooltip-left zoom_minus" onclick="mapZoomControlMinusRe()">
  //  <i></i>
  //  <span class="txt">축소</span>
  //  </button>
  const zoom_minus = await page.waitForSelector(".zoom_minus");
  await zoom_minus.click();
  await zoom_minus.click();
  await zoom_minus.click();
  await zoom_minus.click();
  await zoom_minus.click();
  await zoom_minus.click();
  await zoom_minus.click();
  await zoom_minus.click();

  //재난으로 - 자주 부르는 것같은데 모듈화?

  const hazard = await page.waitForSelector('li[title="재난"] > a');
  await hazard.click();

  // const insu = await page.waitForSelector('.web-menu > a.tag-tab:not([id]):contains("재난배상책임보험")')
  // await insu.click()
  const insu = await page.waitForSelector(".web-menu > a.tagTab-cont05");
  await insu.click();

  const Insur_fake = await page.waitForSelector("#Insur_fake");
  await Insur_fake.click();

  const closeButton3 = await page.waitForSelector(".btn_close");
  await closeButton3.click();

  //페이지 데이터 가져오기
  const btnpagelast = await page.waitForSelector(".btn-page-last");
  await btnpagelast.click();

  const checkcurrent = await page.waitForSelector(".current");
  const element = await page.$(".current");
  const Lastpage = await (await element.getProperty("textContent")).jsonValue();

  const btnpagefirst = await page.waitForSelector(".btn-page-first");
  await btnpagefirst.click();

  //여기부터 logic
  let data = [];
  let j = 1;

  console.log(Lastpage);
  for (let i = 1; i <= Lastpage; i++) {
    console.log(i);
    //    await page.waitForSelector("#pageNavigation");
    await page.evaluate("getLayerList('" + i + "')");
    //한페이지의 리스트중 bg다른 것만모음
    const place_list = await page.waitForSelector(".place-list");
    let backgroundImage = await page.evaluate(() => {
      let temp = [];
      document.querySelectorAll(".place-list > li").forEach((el) => {
        let back = el.querySelector(".ico").style.background;
        console.log(back);
        //if (el.querySelector(".ico").style.background.match(/pin024/)) {
        temp.push({
          backgroundImage: el.querySelector(".ico").style.background,
          title: el.querySelector(".tit").textContent,
          address: el.querySelector(".address").textContent,
        });
        //}
      });
      console.log(temp);
      return temp;
    });
    await console.log(backgroundImage);
    backgroundImage.forEach((item) => data.push(item));
    console.log(data);

    backgroundImage = null;
    await page.waitForTimeout(3000);
    //out 한페이지의 리스트중 bg다른 것만모음
    if (i % 1000 === 0) {
      const csv = await converter.json2csv(data);
      fs.writeFileSync("output/file" + j + ".csv", csv);
      data = [];
      j++;
    }
  }
  await console.log(data);

  //파일에 추가저장

  {
    /* <div class="row tagTab-cont" id="tagTab-cont05" style="display: block;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <p class="majorCont-subTit">재난배상책임보험</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <button type="button" class="tagTab-cont-close">닫기</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <ul class="list-type1 col-2 form-check web-menu">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <li><input type="checkbox" name="chk2" id="Insur_fake" onclick="clickCheckBox('Insur', this, 'tagTab-cont05');" value="재난배상책임보험"><label for="Insur_fake" tabindex="0" onkeydown="keydownLabel(this)">재난배상책임보험</label> </li>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <li><input type="checkbox" id="Insur_link" name="chk2" onclick="insurNewTab(this)"><label for="Insur_link" tabindex="0" onkeydown="keydownLabel(this)">시설물조회</label> </li>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </ul>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div> */
  }

  // const [button] = await page.$x("//button[contains(., 'Button text')]");
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

  await browser.close(); // 브라우저 종료
})();
