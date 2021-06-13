require('dotenv').config();
const Discord = require('discord.js')
const bot = new Discord.Client();
const commandHandler = "!";
const token = process.env.TOKEN;

const fetch = require('node-fetch');

bot.once('ready',()=> {
    console.log(`Bot conecado ${bot.user.tag}`)
})

bot.on("message", message => {
if(!message.content.startsWith(commandHandler) || message.author.bot) return;

 const agruments = message.content.slice(commandHandler.length).split(/ +/);
 const command = agruments.shift().toLowerCase();
 
if(command === "ping") {
    message.channel.send(`>>> pong!`);
}

//command
else if(command === "commands") {
const commandList = `!ping 
!time
!cryptorate
!tiempo <ciudad> 
!bin <BIN>
!dicc <palabra>
!git <usuario_github>
!syt <busqueda>
`;
message.channel.send(`>>> ${commandList}`);
}

///Weather Status
else if(command === "tiempo") {
    const apiKey = "89ef8a05b6c964f4cab9e2f97f696c81"; 
    const kelvin = 273; 
    let location = capitalizeFirstLetter(agruments[0])
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    fetch(api)
    .then(resposne => resposne.json())
    .then(data => {

 let weather = data['weather'][0]['main'];
 let description = data['weather'][0]['description'];
 let temp = data['main']['temp'];
     temp = temp - kelvin;
 let feels_like = data['main']['feels_like'];
 let humedad = data['main']['humidity'];
 let country = data['sys']['country'];
 let name = data['name'];
 let feels = feels_like - kelvin;

let weatherSatus = `Clima en ${name}: ${weather}
Estado: ${description}
Temp : ${temp} °C
Sensacion : ${feels} °C
Humedad : ${humedad} %
Pais: ${country} `;
     message.channel.send(`>>> ${weatherSatus}`)
    })
    .catch(error => {
        console.error('Error:', error);
        message.reply("Error Ciudad no encontrada");
      });
}

///BIN Checker 
else if(command === "bin"){
    let bin = agruments[0];
    fetch(`https://binssuapi.vercel.app/api/${bin}`)
    .then(resposne => resposne.json())
    .then(data => {
        let bank = data['data']['bank'];
        let country = data['data']['country'];
        let brand = data['data']['vendor'];
        let level = data['data']['level'];
        let type = data['data']['type'];
        let flag = data['data']['countryInfo']['emoji'];

        let binData = `Bin: ${bin}
Brand: ${brand}
Level: ${level}
Banco: ${bank}
Tipo:${type}
Pais: ${country} ${flag}`;
        message.channel.send(`>>> ${binData}`)

    })
    .catch(error => {
        console.error('Error:', error);
        message.reply("BIN Incorrecto");
      });
}


///Dictionary
else if(command === "dicc") {
    let dict = agruments[0];
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/es/${dict}`)
    .then(resposne => resposne.json())
    .then(data=> {
       let n = data[0].meanings;
       let definition = "";
       let example = "";
           for(i = 0; i < n.length; i++) {
              definition += (i+1) + ": " + data[0].meanings[i].definitions[0].definition + "\n";
              example += (i+1) + ": " + data[0].meanings[i].definitions[0].example + "\n";
           }
        let dictMeanings = `Definicion: \n${definition}
                           \nEjemplos: \n${example}`
             message.channel.send(`>>> ${dictMeanings}`)
    })
    .catch(error => {
  console.error('Error:', error);
  message.reply("Invalid Input")
});  
}


///Time
else if(command === "time"){
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let time = `${h}:${m}:${s}`
    message.channel.send(`>>> ${time} IST`)
}


///Echo
else if(command === "echo"){
    let echo = "";
    for(i =0; i < agruments.length; i++ ){
        echo += agruments[i]+ " ";
    }
    message.channel.send(echo)
}
 else if(command === "start"){
     message.channel.send(">>> Bot creado por JkDev en Node.js")
 }


///Youtube Search
 else if(command === "yt"){
     let syt = ""
    for(i =0; i < agruments.length; i++ ){
        syt += "+" + agruments[i];
    }
    let query = `https://www.youtube.com/results?search_query=${syt}`

    message.channel.send(`>>> ${query}`)
 }

////Github
else if(command === "git"){
    let git = agruments[0];
    fetch(`https://api.github.com/users/${git}`)
    .then(resposne => resposne.json())
    .then(data => {
        let gusername = data['login'];
        let glink = data['html_url'];
        let gname = data['name'];
        let gcompany = data['company'];
        let blog = data['blog'];
        let gbio = data['bio'];
        let grepo = data['public_repos'];
        let gfollowers = data['followers'];
        let gfollowings = data['following'];

        let gitData = `Name: ${gname}
Usuario: ${gusername}
Bio: ${gbio}
Seguidores: ${gfollowers}
Siguiendo : ${gfollowings}
Repositorios: ${grepo}
Web: ${blog}
Compañia: ${gcompany}
Github url: ${glink}`

        message.channel.send(`>>> ${gitData}`)

    })
    .catch(error => {
        console.error('Error:', error);
        message.reply("Usuario Incorrecto");
      });
    }


/// Crypto Rate
else if(command === "cryptorate"){
    message.channel.send(`>>> Los precios se obtienen de la API de Coinbase.
uso !rate <coinname> para verificar la tasa de criptografía actual.
ej: !rate btc o !rate eth`)
}

else if(command === "rate"){
    let crypto = agruments[0].toUpperCase();
    let coinbaseApi = `https://api.coinbase.com/v2/prices/${crypto}-USD/spot`

    fetch(coinbaseApi)
    .then(response => response.json())
    .then(data => {

     let cryptoRate = data['data']['amount'];
     let cryptoData = `1 ${crypto}
USD = ${cryptoRate}`
      
     message.channel.send(`>>> ${cryptoData}`)

    })
    .catch(error => {
        console.error('Error:', error);
        message.reply(`Error: ${error}`);
      });

}



//////------

})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  

bot.login(token)

