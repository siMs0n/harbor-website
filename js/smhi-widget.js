/*
  Fetches the weather for Djupviks hamn (Lat: 57.3081 Lon: 18.1489) and displays it inside element "smhi-widget".
  Shows the temperature, wind direction, wind speed and cloudiness at 6, 12 and 18, today and tomorrow.
*/
fetch(
  "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.1489/lat/57.3081/data.json"
)
  .then((response) => response.json())
  .then((data) => {
    const weatherToDisplay = parseSMHIWeather(data);

    displayWeather(weatherToDisplay);
  });

function parseSMHIWeather(data) {
  const weatherHours = [6, 12, 18];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const filteredWeather = data.timeSeries.filter((weatherAtTime) => {
    const date = new Date(weatherAtTime.validTime);
    if (
      (date.getDate() === today.getDate() ||
        date.getDate() === tomorrow.getDate()) &&
      weatherHours.includes(date.getHours())
    ) {
      return weatherAtTime;
    }
  });
  /*
  Parameters:
  t = Air temperature in degrees Celsius
  wd = Wind direction in degrees
  ws = Wind speed in meters per second
  tcc_mean = Mean value of total cloud cover in octas
  */
  const weatherWithRelevantParameters = filteredWeather.map((weatherData) => {
    const date = new Date(weatherData.validTime);

    return {
      day: date.getDate(),
      hour: date.getHours(),
      temperature: weatherData.parameters.find((p) => p.name === "t").values[0],
      windDirection: weatherData.parameters.find((p) => p.name === "wd")
        .values[0],
      windSpeed: weatherData.parameters.find((p) => p.name === "ws").values[0],
      cloudCover: weatherData.parameters.find((p) => p.name === "tcc_mean")
        .values[0],
    };
  });
  return {
    today: weatherWithRelevantParameters.filter(
      (w) => w.day === today.getDate()
    ),
    tomorrow: weatherWithRelevantParameters.filter(
      (w) => w.day === tomorrow.getDate()
    ),
  };
}

function displayWeather(weatherTodayAndTomorrow) {
  const smhiWidget = document.querySelector("#smhi-widget");

  if (weatherTodayAndTomorrow.today.length > 0) {
    smhiWidget.appendChild(createElementWithText("h3", "Idag"));
    const todayTable = createWeatherTable(weatherTodayAndTomorrow.today);
    smhiWidget.appendChild(todayTable);
  }

  smhiWidget.appendChild(createElementWithText("h3", "Imorgon"));
  const tomorrowTable = createWeatherTable(weatherTodayAndTomorrow.tomorrow);
  smhiWidget.appendChild(tomorrowTable);
}

function createWeatherTable(weather) {
  const cloudCoverDescriptions = {
    0: "Mycket molnigt", //"Klart",
    1: "Enstaka moln",
    2: "Lite moln",
    3: "Lite moln",
    4: "Halvklart",
    5: "Molnigt",
    6: "Mycket molnigt",
    7: "Nästan mulet",
    8: "Mulet",
  };

  const table = document.createElement("table");

  const headerRow = document.createElement("tr");
  const headers = ["Kl", "Temp", "Vind (m/s)", "Himmel"];
  headerRow.appendChild(createElementWithText("th", "Kl"));
  headerRow.appendChild(createElementWithText("th", "Temp"));
  const windHeader = createElementWithText("th", "Vind ");
  const windSpeedUnit = createElementWithText("span", "(m/s)");
  windSpeedUnit.style = "font-size: 0.7rem";
  windHeader.appendChild(windSpeedUnit);
  headerRow.appendChild(windHeader);
  headerRow.appendChild(createElementWithText("th", "Himmel"));
  table.appendChild(headerRow);

  const weatherRows = weather.map((weatherData) => {
    const row = document.createElement("tr");

    row.appendChild(createElementWithText("td", weatherData.hour));

    row.appendChild(
      createElementWithText("td", Math.round(weatherData.temperature) + "°")
    );

    const windElement = document.createElement("td");
    windElement.innerHTML = rotatedArrowSvg(weatherData.windDirection);
    windElement.style = "display: flex; align-items: center";
    const windSpeedElement = createElementWithText(
      "span",
      Math.round(weatherData.windSpeed)
    );
    windSpeedElement.style = "margin-left: 0.4rem";
    windElement.appendChild(windSpeedElement);
    row.appendChild(windElement);

    row.appendChild(
      createElementWithText(
        "td",
        cloudCoverDescriptions[weatherData.cloudCover]
      )
    );

    return row;
  });
  weatherRows.forEach((row) => table.appendChild(row));

  return table;
}

function createElementWithText(elementType, text) {
  const element = document.createElement(elementType);
  element.textContent = text;
  return element;
}

function rotatedArrowSvg(degrees) {
  return `<svg style="transform: rotate(${degrees}deg)" width="12.5" height="20" viewBox="7.5 2 10 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.6568 8.96219L16.2393 10.3731L12.9843 7.10285L12.9706 20.7079L10.9706 20.7059L10.9843 7.13806L7.75404 10.3532L6.34314 8.93572L12.0132 3.29211L17.6568 8.96219Z" fill="currentColor" /></svg>`;
}
