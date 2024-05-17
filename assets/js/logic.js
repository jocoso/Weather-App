
function main() {
    let country_name = '';

    $("form").submit((ev) => {

        ev.preventDefault();

        let country_name = $("[name=state_text]").val();

        country_name = (country_name) ? country_name : "San Diego";

        setWeatherReport(country_name);

    })

}

function set5DaysForecast(data) {
    console.log(data.list[0]);

    const datalist = data.list;
    const appendDiv = (_parent, _tag, _class, _html) => {
        
        let $div = $(_tag).addClass(_class).html(_html);
        $(_parent).append($div);
    }

    const getWeatherDataAsString = (weatherdata) => {
        return new String(`
            Temp: ${weatherdata.main.temp}F
            Wind: ${weatherdata.wind.speed}MPH
            Humidity: ${weatherdata.main.humidity}%
            `)
    }
       
    for(let i = 0; i < 5; i++) {
        appendDiv('#forecast', '<div>', 'fore-style', getWeatherDataAsString(datalist[i]));
    }   
   
    
}

function setWeatherReport(country_name) {

    //const request=`http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=a5c67d2aaec6692b6e8028e144497842`
    const req = `http://api.openweathermap.org/geo/1.0/direct?q=${country_name}&limit=5&appid=a5c67d2aaec6692b6e8028e144497842`;
    const key = "a5c67d2aaec6692b6e8028e144497842";


    // Calling to weather app
    callApi(req, (data) => {
        if (data.length === 0) {
            alert("Error: Not a valid country... Be better");
            return;
        }
        console.log(data);
        // Making a dat format dd-mm-yyyy
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        inject("#citydate", data[0].name + " (" + today + ")"); // adding to report

        const lat = data[0].lat;
        const lon = data[0].lon;
        const weatherreq = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`;

        callApi(weatherreq, (data) => {
            inject("#temp", data.list[0].main.temp + "F", "Temp: ");
            inject("#wind", data.list[0].wind.speed + "MPH", "Wind: ");
            inject("#humidity", data.list[0].main.humidity + '% ', "Humidity: ");
            set5DaysForecast(data);
        })

        

    }, () => { alert("ERROR") })

}

function callApi(request, funct, errfunct) {
    fetch(request)
        .then(
            function (response) {
                if (response.ok) {
                    response.json().then((data) => {
                        funct(data);
                    })
                } else {
                    if (errfunct) {
                        errfunct();
                    }
                }
            }
        )
}

/*
per_page: default 30
state: State that the user wants to see the weather
sort: 
*/

function inject(id, data, pretext = '') {
    $(id).text(pretext + data);
}


$(
    () => {
        main();
        // inject("citydate", data[0].name);
    }
)