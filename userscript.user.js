// ==UserScript==
// @name         Kingdom Hearts r/Place Coordinator
// @namespace    http://tampermonkey.net/
// @description  You Kidding? Do You Know How Popular I Am? I Got Loads Of People Rootin' For Me. Sorry, Boss.
// @version      0.61
// @author       Opossum
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require      https://www.marvinj.org/releases/marvinj-0.7.js
// @grant        none
// ==/UserScript==

let tagData = [
    {
        url: "https://raw.githubusercontent.com/Oppossome/KHrPC/main/tags/khpl.png",
        start: [1241, 673]
    },
    {
        url: "https://raw.githubusercontent.com/Oppossome/KHrPC/main/tags/khpl2.png",
        start: [0, 338]
    },
    {
        url: "https://raw.githubusercontent.com/Oppossome/KHrPC/main/tags/nier.png",
        start: [1311, 673]
    }
]

let rSize = [
    2000,
    2000
]

function getColor(image, x, y) {
    return {
        r: image.getIntComponent0(x, y),
        g: image.getIntComponent1(x, y),
        b: image.getIntComponent2(x, y),
        a: image.getAlphaComponent(x, y)
    };
}

function makeCanvas() {
    let canvas = document.createElement("canvas");
    canvas.style = `position: absolute; top: 0; left: 0; width: ${rSize[0]}px; height: ${rSize[1]}px; z-index: 200px; z-index: 2000`;
    let ctx = canvas.getContext("2d");
    ctx.canvas.height = rSize[0] * 5;
    ctx.canvas.width = rSize[1] * 5;
    
    tagData.forEach((tag) => {
        const tagImg = new MarvinImage()

        tagImg.load(tag.url, () => {
            for(let x = 0; x < tagImg.getWidth(); x++ ){
                for(let y = 0; y < tagImg.getHeight(); y++ ){
                    const cClr = getColor(tagImg, x, y);
                    const cX = (tag.start[0] + x) * 5;
                    const cY = (tag.start[1] + y) * 5;

                    if (cClr.a === 255) {
                        ctx.fillStyle = `rgb(${cClr.r}, ${cClr.g}, ${cClr.b})`;
                        ctx.fillRect(cX + 1, cY, 1, 1);
                        ctx.fillRect(cX + 3, cY, 1, 1);
                        ctx.fillRect(cX, cY + 1, 5, 2);
                        ctx.fillRect(cX + 1, cY + 3, 3, 1);
                        ctx.fillRect(cX + 2, cY + 4, 1, 1);
                    } 
                }
            }
        });
    });

    return canvas;
}

window.addEventListener('load', async () => {
    let mlEmbed = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0];
    mlEmbed.appendChild( makeCanvas() );
});