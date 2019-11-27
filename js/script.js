function setTime() {
    const date = new Date()
    document.querySelector('.time h2').innerHTML = date.getHours() + '<span class="blink">:</span>' +
        (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
}

function getApiData() {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const data = JSON.parse(xhr.responseText);

            const rers = data.result.rers.length
            const metros = data.result.metros.length
            const tramways = data.result.tramways.length

            let hasProblem = false

            for (let i = 0; i < rers; i++) {
                if (data.result.rers[i].slug === 'critical') {
                    hasProblem = true
                }
            }

            for (let i = 0; i < metros; i++) {
                if (data.result.metros[i].slug === 'critical') {
                    hasProblem = true
                }
            }

            for (let i = 0; i < tramways; i++) {
                if (data.result.tramways[i].slug === 'critical') {
                    hasProblem = true
                }
            }

            document.querySelector('.status h1').innerHTML = hasProblem ? 'Incident(s)' : 'Trafic normal'

            templateType('rers', data.result.rers)
            templateType('metros', data.result.metros)
            templateType('tramways', data.result.tramways)

            showProblems(data.result)
        }
    }
    xhr.open('GET', 'https://api-ratp.pierre-grimaud.fr/v4/traffic');
    xhr.send()
}

function showProblems(data) {
    const linesType = [
        'rers',
        'metros',
        'tramways',
    ]
    for (let i=0; i < linesType.length; i++){

        const lineType = linesType[i]

        for (let j=0; j < data[lineType].length; j++){
            const line = data[lineType][j]
            if (line.slug !== 'normal'){
                templateProblem(lineType, line)
            }
        }
    }

}


function templateProblem(lineType, line) {

    let template = document.querySelector('.col--traffic');
    template.innerHTML += '<div class="row">' +
        '<div class="col-sm-4">' + lineType + ' ' + line.line + '</div>' +
        '<div class="col-sm-8">' + line.message + '</div>' +
            '</div>'

}

function templateType(type, data) {
    let template = document.querySelector('.lines--' + type)
    template.innerHTML = '<div class="col-sm-2 text-center">' + type + '</div>'

    const lines = data.length

    for (let i = 0; i < lines; i++) {
        template.innerHTML += '<div class="col-sm-2 text-center ' + getBackgroundColor(data[i].slug) + '">' + data[i].line + '</div>'
    }
}

function getBackgroundColor(slug) {
    switch (slug) {
        case 'critical':
            return 'line--critical'
            break;
        case 'normal_trav':
            return 'line--works'
            break;
        case 'normal':
        default:
            return ''
            break;
    }
}


// Timer
setTime()
setInterval(function () {
    setTime()
}, 1000);

getApiData()
