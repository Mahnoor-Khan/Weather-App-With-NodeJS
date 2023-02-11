const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceData = (tempValue, orignalValue) => {
  let temprature = tempValue.replace("{%tempVal%}", orignalValue.main.temp);
  temprature = temprature.replace("{%tempMin%}", orignalValue.main.temp_min);
  temprature = temprature.replace("{%tempMax%}", orignalValue.main.temp_max);
  temprature = temprature.replace("{%location%}", orignalValue.name);
  temprature = temprature.replace("{%country%}", orignalValue.sys.country);
  temprature = temprature.replace(
    "{%tempStatus%}",
    orignalValue.weather[0].main
  );
  return temprature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=murree&appid=493bb0a5d78209715449e258b3dfb9e2"
    )
      .on("data", (chunk) => {
        let objData = JSON.parse(chunk);
        const arrData = [objData];
        const realTimeData = arrData
          .map((val) => replaceData(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) console.log(err);
        res.end();
      });
  }
});

server.listen(7000);
