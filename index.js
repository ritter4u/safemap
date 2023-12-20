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

    //    const checkico = await page.waitForSelector(".ico");
    //    const backgroundImage = await page.evaluate() => {Array.from(
    //        document.querySelectorAll(".ico")
    //        ).map()}
    const backgroundImage = await page.evaluate(() => {
        var list = document.querySelectorAll(".place-list >li");
        //        console.log(list)
        //        for(var item in list){
        //           console.log(item)
        //        }
        //        var something
        console.log(list);
        return list;
    });
    await console.log(backgroundImage);

    //    console.log(pageGetData)
    //  const pageGetData = await page.evaluate(() => {
    //    const icons = page.$$(".ico");
    //    icons.map((el) => el.getAttribute("style"));
    //
    //    //        const jsonData = {
    //    //            "fingerPrint" : localStorage.getItem( "tistoryFingerprint" )
    //    //        };
    //
    //    return jsonData;
    //  });
    //  //    const icons = await page.$$(".ico");
    //  //      const isNotHidden = await page.$$eval(".ico", (elem) => {
    //  //        return window.getComputedStyle(elem).getPropertyValue("backgroundImage");
    //  //      });
    //  await console.log(isNotHidden);
    ////  const backgroundImages = await page.evaluate(
    ////    (el) => window.getComputedStyle(el).backgroundImage,
    ////    await page.$(".ico"),
    //)
    //    ;
    //
    //    console.log(backgroundImages);
    //  const icons = await page.$$(".ico")
    //  const backgroundImage = await page.evaluate(el => window.getComputedStyle(el).backgroundImage, await page.$('.ico'))
    //await icons.map(el=> console.log(el.getProperty('computedStyleMap')))

    //  const isNotHidden = await page.$$eval(".ico", (elem) => {
    //    return window.getComputedStyle(elem).getPropertyValue("backgroundImage");
    //  });
    //  await console.log(isNotHidden);
    // const backgroundImage = await page.evaluate(el => window.getComputedStyle(el).backgroundImage, await page.$('.ico'))

    // await ico.map(el=>console.log(el.getProperties()))
    //     const backgroundImage = await ico.map(el=>el.style.backgroundImage)
    // //    style.backgroundImage
    //  const backgroundImage = await page.evaluate(el => window.getComputedStyle(el).backgroundImage, await page.$('.ico'))
    // const backgroundImage = await ico.evaluate(el => el.style.backgroundImage, await page.$$('.ico'))
    //     style.backgroundImage
    // console.log(backgroundImage)

    // for(let i=1;i<=Lastpage;i++){
    // const checkico = await page.waitForSelector('.ico')
    // let ico = await page.$$('.ico')

    // await JSON.stringify(ico.jsonValue)
    // Extracting and logging the text content of each element
    // for (const element of ico) {

    // }
    // console.log(await page.$('.ico'))
    //     // await ico.map(el=>console.log(el.getProperties()))
    // //     const backgroundImage = await ico.map(el=>el.style.backgroundImage)
    // // //    style.backgroundImage
    //    const backgroundImage = await page.evaluate(el => window.getComputedStyle(el).backgroundImage, await page.$('.ico'))
    // // const backgroundImage = await ico.evaluate(el => el.style.backgroundImage, await page.$$('.ico'))
    // //     style.backgroundImage
    //     console.log(backgroundImage)

    //console.log(await ico.getProperty('style'))
    //let ico_array= await (await ico.getProperty('style')).jsonValue()
    //console.log(ico_array)
    //consol.log(ico_array)
    //let ico = .ico
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

    //   const btnpagenext = await page.waitForSelector('.btn-page-next')
    //   await btnpagenext.click()
    //   i++;
    // }

    //파일에 추가저장
    const csv = await converter.json2csv(data);
    fs.writeFileSync("file.json", csv);

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
