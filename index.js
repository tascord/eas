const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const Script = Config.script.split('\n').map(l => l.trimStart()).join('\n');
const Speech = window.speechSynthesis || { speaking: false };

if(window.speechSynthesis) {
    Speech.cancel();
}

const eas = document.querySelector('#eas');
eas.volume = Config.eas_volume ?? 0.05;
eas.play();

const static = document.querySelector('#static')
static.volume = Config.static_volume ?? 0.05;
static.loop = true;
static.play();

// Draw
requestAnimationFrame(draw);

// Default scaling
scale();

// Handle scaling
document.body.onresize = scale;

function scale() {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * 0.4;
    canvas.height = height * 0.4;
}

function draw() {

    setTimeout(() => requestAnimationFrame(draw), 70);

    const w = canvas.width;
    const h = canvas.height;

    // Clear background
    context.fillStyle = 'black';
    context.fillRect(0, 0, w, h);

    // Draw borders
    context.strokeStyle = 'white';
    context.lineWidth = '3';
    const line_scales = [
        [11.25, 7.5],
        [6.5, 5],
        [4.75, 5],
    ];

    for (let [x, y] of line_scales) {
        context.strokeRect(w / x, h / y, w - ((w / x) * 2), h - ((h / y) * 2));
    }

    // Draw text
    draw_text()

    document.querySelector('img').src = corrupt(canvas.toDataURL('image/jpeg'));

}

let lines = [0, 0];

function draw_text() {

    const w = canvas.width;
    const h = canvas.height;

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'white';

    const [start, end] = lines;
    let slices = Script
        .split('\n')
        .slice(start, end)
        .filter(l => l.trim() !== '' || l.trim() !== '-');

    const line_spacing = (h / 20);
    const font = 'VCR';

    if(!eas.paused) {
        slices = [
            `#EMERGENCY ALERT SYSTEM`,
            `,${new Date().toGMTString()}`,
            `EAS Participant issued a`,
            `██████ ████████ EMERGENCY`
        ]
    }

    for (let index = 0; index < slices.length; index++) {

        let line = slices[index];
        let y_pos = (h / 2) - (slices.length * line_spacing / 2) + index * line_spacing;

        // Header
        if (line.startsWith('#')) {
            line = line.slice(1).trim();
            context.font = `20px ${font}`;
            context.fillText(line, w / 2, y_pos);
        }

        // Sub-Header
        else if (line.startsWith(',')) {
            line = line.slice(1).trim();
            context.font = `13px ${font}`;
            context.fillText(line, w / 2, y_pos);
        }

        // Regular text
        else {

            context.font = `12px ${font}`;
            line = line.replace(/<.+?>/g, (data) => {

                let [prop, val] = data.slice(1, -1).split('=');

                switch (prop) {

                    case 'size':
                        context.font = `${val} ${font}`;
                        break;

                    case 'colour':
                    case 'color':
                        context.fillStyle = val;
                        break;

                    default:
                        return data;
                }


                return '';
            })

            context.fillText(line, w / 2, y_pos);

        }

    }

}

setInterval(update_text, (Config.speed ?? 3) * 1000);
update_text();

function update_text() {

    if (Speech.speaking || !eas.paused) return;
    let slices = Script.split('\n');

    if (slices[lines[1] + 1] !== undefined) {
        lines[0] = lines[1];
    } else {
        if (Config.loop === true) {
            eas.play();
            lines = [0, 0];
        }
        return;
    }

    let end = lines[1];
    if (slices[lines[1]].startsWith('-')) {
        lines[0] = lines[1] + 1;
        end++;
    }

    while (slices[end] !== undefined && !slices[end].startsWith('-') && end - lines[1] <= 6) {
        end++;
    }

    lines[1] = end;

    if (Config.speak) speak(slices.slice(lines[0], lines[1]).join(''));
}

function corrupt(data) {

    let editable = data.split(',').pop().split('');

    const corruption_value = Config.corruption || 10;
    const replacements = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    for (let _ = 0; _ < corruption_value + (5 - Math.floor(Math.random() * 10)); _++) {
        let index = Math.floor(Math.random() * editable.length);
        if (index < 30) continue;

        editable[index] = replacements[Math.floor(Math.random() * replacements.length)]
    }

    return (data.split(',').shift() + ',' + editable.join(''));

}

function speak(line) {

    console.log(`Speaking: ${line}`);
    line = line.replace(/<.+?>/g, '').replace(/[^0-9a-z,.!? ]/gi, '')

    if (!window.speechSynthesis) return;
    let utterance = new SpeechSynthesisUtterance(line);

    let voices = Speech.getVoices();
    utterance.voice = voices.find(v => v.name.includes(Config.voice || 'David')) || voices[0];

    utterance.pitch = Config.pitch || 0.1;
    utterance.rate = Config.rate || 0.85;
    utterance.volume = Config.voice_volume || 0.25;

    Speech.speak(utterance);

}