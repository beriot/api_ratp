function setTime() {
    const date = new Date();


    document.querySelector('.time h2').innerHTML = date.getHours() + '<span class="blink">:</span>' +
        (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
}


function getApiData() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const data = JSON.parse(xhr.responseText);
            const rers = data.result.rers.length;
            const metros = data.result.metros.length;


            let hasProbbleme = false;

            for (let i = 0; i < rers; i++) {
                if (data.result.rers[i].slug === 'critical') {
                    hasProbbleme = true;
                }
            }

            for (let i = 0; i < metros; i++) {
                if (data.result.metros[i].slug === 'critical') {
                    hasProbbleme = true;
                }
            }
            document.querySelector('.status h1').innerHTML = hasProbbleme ? 'Incident(s)' : 'Trafic normal';

            templateType('rers', data.result.rers);
            templateType('metros', data.result.metros);
        }
    }
    xhr.open('GET', 'https://api-ratp.pierre-grimaud.fr/v4/traffic');
    xhr.send();

}

function templateType(type, data) {
    let template = document.querySelector('.lines--' + type);
    template.innerHTML = '<div class="col-sm-2 text-center">' + type + '</div>';

    const lines = data.length;

    for (let i = 0; i < lines; i++) {
        template.innerHTML += '<div class="col-sm-2 text-center '+ getBackgroundColor(data[i].slug) +'">'  + data[i].line + '</div>'
    }
}

function getBackgroundColor(slug) {
    switch (slug) {
        case 'critical' :
            return'line--critical'
        case 'normal_trav' :
            return 'line--works'
        case 'normal' :
        default :
            return ''
            break;
    }
}

// Timer
setTime();
setInterval(function () {
    setTime()
}, 1000);


getApiData();