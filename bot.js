const Discord = require("discord.js");
const Config = require("./config.json")
const client = new Discord.Client(); // new instance of discord client

client.on("ready", () => {
    console.log('I am ready.');
});

client.on("message", async message => {
    console.log(message.author.username + ": " + message); // logging messages

    const prefix = Config.prefix;
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const command = message.content.toLowerCase().substring(prefix.length, message.content.length);

    if (command==="help") {
        message.author.send("Translation App: !koen, !enko, !enja, !jaen, !jako, !koja (Korean=ko, Japanese=ja, English=en)");
    }

    if (command==="ping")
        message.channel.send("pong"); // send pong in same channel
    
    if (command.startsWith("pfp")) {
        let user = message.mentions.users.first();
        if (!user) {
            message.channel.send(new Discord.RichEmbed().setImage(message.author.avatarURL).setColor("#275BF0"));
        } else {
            message.channel.send(new Discord.RichEmbed().setImage(user.avatarURL).setColor("#275BF0"));
        }
    }

    if (command.startsWith("koen") || command.startsWith("enko") || command.startsWith("enja") || command.startsWith("jaen")) {
        var client_id = Config.client_id;
        var client_secret = Config.client_secret;
        if (command.length <= 5) {
            message.reply("You must enter a text to translate first.");
            return;
        }
        var query = command.substring(5, command.length);
        // var api_url = "https://openapi.naver.com/v1/language/translate"; // stat-based translation
        var api_url = "https://openapi.naver.com/v1/papago/n2mt"; // machine-learning-based translation
        var request = require("request");
        var options = {
            url: api_url,
            form: {"source":command.substring(0,2), "target":command.substring(2,4), "text":query},
            headers: {"X-Naver-Client-Id":client_id, "X-Naver-Client-Secret": client_secret},
        };
        request.post(options, function (error, response, body) {
            if (error) console.log("NMT Translation Error: "+error);
            else console.log("Successfully translated using NMT!");
            var result = JSON.parse(body);
            message.channel.send("Result: " + result.message.result.translatedText);
        });

    }

    if (command.startsWith("jako") || command.startsWith("koja")) {
        var client_id = Config.client_id;
        var client_secret = Config.client_secret;
        if (command.length <= 5) {
            message.reply("You must enter a text to translate first.");
            return;
        }
        var query = command.substring(5, command.length);
        var api_url = "https://openapi.naver.com/v1/language/translate"; // stat-based translation
        // var api_url = "https://openapi.naver.com/v1/papago/n2mt"; // machine-learning-based translation
        var request = require("request");
        var options = {
            url: api_url,
            form: {"source":command.substring(0,2), "target":command.substring(2,4), "text":query},
            headers: {"X-Naver-Client-Id":client_id, "X-Naver-Client-Secret": client_secret},
        };
        request.post(options, function (error, response, body) {
            if (error) console.log("SMT Translation Error: "+error);
            else console.log("Successfully translated using SMT!");
            var result = JSON.parse(body);
            message.channel.send("Result: " + result.message.result.translatedText);
        });

    }

    if (command.startsWith("mm")) {
        if (command.length <= 3) {
            message.reply("You must enter a city name! ex) !mm 서울")
            return;
        }
        var location = command.substring(3, command.length);
        location = location.trim();
        console.log(`Gathering microdust data for ${location}.`);
        location = encodeURIComponent(location);
        var request = require("request");

        /*
        http://openapi.airkorea.or.kr/openapi/services/rest/
        ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?
        sidoName=서울&pageNo=1&numOfRows=10&ServiceKey=서비스키&ver=1.3
        */

        var url = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?sidoName=${location}&pageNo=1&numOfRows=100&ServiceKey=${Config.serviceKey}&ver=1.3`;

        request(url, function (error, response, body) {
            if (error) {
                console.log(error);
                message.reply("Check to see if you entered the city correctly.\n" +
                "(서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종)");
                return;
            } else console.log("Successfully fetched microdust data for " + location + ".");
            var parser = require('xml2json');
            var jsonBody = parser.toJson(body);
            console.log("Successfully converted XML to JSON.");
            var result = JSON.parse(jsonBody);
            var itemList = result.response.body.items.item;
            var itemMap = itemList.map(item => {
                return `[${item.stationName}] PM10: ${item.pm10Value}, PM25: ${item.pm25Value}`;
            });
            message.channel.send(itemMap);
        });

    }

    
});

client.login(Config.token); // discord bot api token

