// ==UserScript==
// @name         Kingdom Hearts r/Place Coordinator
// @namespace    http://tampermonkey.net/
// @description  You Kidding? Do You Know How Popular I Am? I Got Loads Of People Rootin' For Me. Sorry, Boss.
// @version      0.1
// @author       Opossum
// @match        https://www.reddit.com/r/place*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require      https://www.marvinj.org/releases/marvinj-0.7.js
// @grant        window.onurlchange
// ==/UserScript==

let tagData = [
    {
        url: "https://i.imgur.com/EFTRKvm.png",
        start: [1241, 673],
        name: "KHPL Tag"
    }
]

document.getElementsByTagName("head")[0].insertAdjacentHTML("afterbegin", `
    <style>
        #rpCoordinator {
            border-bottom: 1px solid var(--newCommunityTheme-widgetColors-sidebarWidgetBorderColor);
            border-left: 1px solid var(--newCommunityTheme-widgetColors-sidebarWidgetBorderColor);
            background-color: var(--newCommunityTheme-body);
            position: fixed;
            z-index: 100;

            border-radius: 0 0 0 5px;
            padding: 5px;
            top: 48px;
            right: 0;
        }

        #rpCanvas {
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        }

        #rpColor {
            border: 1px solid var(--newCommunityTheme-widgetColors-sidebarWidgetBorderColor);
            border-radius: 0 0 0 5px;
            position: relative;
            margin-top: 5px;
            height: 25px;
            width: 100%;
        }
        
    </style>
`);

document.getElementsByClassName("subredditvars-r-place")[1].insertAdjacentHTML("afterbegin",`
    <div id="rpCoordinator">
        <img id="rpCanvas"></img>

        <div id="rpColor"></div>
    </div>
`);

function sleep(len) {
    return new Promise(resolve => {
        setTimeout(resolve, len)
    });
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const tagImg = new MarvinImage();
        tagImg.load(url, () => {
            resolve(tagImg);
        });
    });
}

async function sleepUntil(condition) {
    while (true) {
        let condVal = condition();
        if( condVal ) return condVal;
        await sleep(.5);
    }
}


function getAppropriateTag(canvas, color) {
    const urlParams = new URLSearchParams(window.location.search);
    if( !urlParams.get("cx") || !urlParams.get("cy") ) return "none";

    for(let tagId = 0; tagId < tagData.length; tagId++) {
        const tag = tagData[tagId];
        const mouseX = Number(urlParams.get("cx")) - tag.start[0];
        const mouseY = Number(urlParams.get("cy")) - tag.start[1];
        const height = tag.image.getHeight();
        const width = tag.image.getWidth();

        if( mouseX >= 0 && mouseY >= 0) {
            if( mouseX <= width && mouseY <= height ){
                const clrR = tag.image.getIntComponent0(mouseX, mouseY);
                const clrG = tag.image.getIntComponent1(mouseX, mouseY);
                const clrB = tag.image.getIntComponent2(mouseX, mouseY);

                color.style.backgroundColor = `rgb(${clrR}, ${clrG}, ${clrB})`;
                canvas.style.height = `${height * 5}px`;
                canvas.style.width = `${width * 5}px`;
                canvas.src = tag.url;
                return "block";
            }
        }
    }

    return "none";
}

(async () => {
    let rpCoord = await sleepUntil(() => document.getElementById("rpCoordinator"));
    let rpCanv = await sleepUntil(() => document.getElementById("rpCanvas"));
    let rpColor = await sleepUntil(() => document.getElementById("rpColor"));

    for(let tagId = 0; tagId < tagData.length; tagId++){
        let tag = tagData[tagId];
        tag.image = await loadImage(tag.url);
    }

    rpCoord.style.display = getAppropriateTag(rpCanv, rpColor);
    window.addEventListener('urlchange', () => {
        rpCoord.style.display = getAppropriateTag(rpCanv, rpColor);
    });
})();
