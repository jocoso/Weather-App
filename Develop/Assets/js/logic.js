
function main() {
    let country_name = '';

    $("form").submit((ev) => {
        
        ev.preventDefault();

        let country_name = $("[name=state_text]").val();
       
        country_name = (country_name)? country_name : "New York"
        
        setWeatherReport(country_name);
        
    })

}

function setWeatherReport(country_name) {
    
    //const request=`http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=a5c67d2aaec6692b6e8028e144497842`
    const req = `http://api.openweathermap.org/geo/1.0/direct?q=${country_name}&limit=5&appid=a5c67d2aaec6692b6e8028e144497842`;
    const key = "a5c67d2aaec6692b6e8028e144497842";
    
    
    // Calling to weather app
    callApi(req, (data) => {
        console.log(data.length);
        if(data.length === 0) {
            alert("Error: Not a valid country... Be better"); 
            return;
        }

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
            console.log(data);
            inject("#temp", data.list[0].main.temp + "F", "Temp: ");
            inject("#wind", data.list[0].wind.speed + "MPH", "Wind: ");
            inject("#humidity", data.list[0].main.humidity + '% ', "Humidity: ");
        })
        
    }, () => { alert("ERROR")})
    
}

function callApi(request, funct, errfunct) {
    fetch(request)
    .then(
        function (response) {
            if(response.ok) {
                response.json().then((data) => {
                    funct(data);
                })
            } else {
                if(errfunct) {
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

function inject(id, data, pretext='') {
    $(id).text(pretext + data);
}


$(
    () => {
        main();
        // inject("citydate", data[0].name);
    }
)