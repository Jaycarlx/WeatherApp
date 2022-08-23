const container = document.querySelector(".container"),
    addInput = document.querySelector(".add-input"),
    infoText = document.querySelector(".info-text"),
    inputField = document.querySelector(".add-input input"),
    apiKey = "c35f5ed355e896c0518839c244db0f62",
    userLocation = document.querySelector(".add-input button"),
    wIcon = document.querySelector(".weather-info img"),
    arrow = document.querySelector("header i");
let api; 
let deg = document.querySelector(".deg")

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

userLocation.addEventListener("click", e => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert("Your broswer no gree show location, boss")
    };
});


function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData()
};

function onError(error) {
    infoText.innerText = error.message;
    infoText.classList.add("error")
};


function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData()
}

function fetchData() {
    infoText.innerText = "Getting weather details,boss..."
    infoText.classList.add("pending")
    fetch(api).then(response =>
        response.json()).then(result => 
            weatherDetails(result));
}
    
function weatherDetails(info) {
    if (info.cod == "404"){
       infoText.innerText = `${inputField.value} no be valid city name, boss`
        infoText.classList.replace("pending", "error")
    }
    else {
        const city = info.name,
            country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        };

        let mainTemp = container.querySelector(".temp .num")
        mainTemp.innerText = temp.toFixed(2);
        container.querySelector(".wDescription").innerText = description;
        container.querySelector(".location span").innerText = `${city}, ${country}`;
        container.querySelector(".temp .num-2").innerText = feels_like.toFixed(2);
        container.querySelector(".humidity span").innerText = `${humidity}%`;
        let now = new Date();
     container.querySelector(".date").innerText = dateBuilder(now)

        infoText.classList.remove("pending", "error")
        container.classList.add("active")

        function dateBuilder(d) {
            let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
            let day = days[d.getDay()];
            let date = d.getDate();
            let month = months[d.getMonth()];
            let year = d.getFullYear();

            return `${day}, ${date} ${month} ${year}`;
        }

        mainTemp.addEventListener("click", () => {
            if (deg.textContent === "C") {
                deg.innerText = "F";
                mainTemp.innerText = (mainTemp.textContent * (5 / 9) + 32).toFixed(2);
            } else {
                deg.innerText = "C";
                mainTemp.innerText = temp;
            }
        });
       
    }
    
};

arrow.addEventListener("click", () => {
    container.classList.remove("active")
})