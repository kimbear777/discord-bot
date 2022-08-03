const { Discord, Client, Intents, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
module.exports = client;
const fs = require("fs");
const { prefix, token } = require("./config.json");
const mongoose = require("mongoose");

mongoose
    .connect(
        "몽고DB",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(console.log("데이터베이스 연결 완료"));

client.once("ready", () => {
    console.log("ready!");
});

client.commands = new Collection();

const commandsFile = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandsFile) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("messageCreate", (message) => {
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift();
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
    }
});

client.once("ready", () => {
    // 디스코드 봇 상태 메세지
    let number = 0;
    setInterval(() => {
        const list = ["일하는중!", "작업중!"];
        if (number == list.length) number = 0;
        client.user.setActivity(list[number], {
            type: "PLAYING",
        });
        number++;
    }, 2000); //몇초마다 상태메세지를 바꿀지 정해주세요 (1000 = 1초)
    console.log("봇이 준비되었습니다");
});

client.on("messageCreate", (message) => {
    //디스코드 봇 기초!
    if (message.content == "핑") {
        message.reply("퐁!");
    }

    if (message.content == `${prefix}도우미`) {
        // 명령어의 방법이 나옴
        const HelpEmbed = new (require("discord.js").MessageEmbed)();
        HelpEmbed.setColor("BLUE");
        HelpEmbed.setTitle("**도움말**");
        HelpEmbed.addFields(
            { name: "!계산기", value: "버튼식 계산기를 사용할 수 있습니다." },
            { name: "!도박", value: "도박을 할 수 있습니다" },
            {
                name: "!이체",
                value: "도박에서 얻은 돈을 다른사람에게 이체 할 수 있습니다",
            },
            { name: "!bmi", value: "비만도를 확인 할 수 있습니다." },
            { name: "!문제", value: "수학문제를 풀어서 돈을 얻을 수 있습니다." },
            { name: "!현금", value: "잔액을 확인 할 수 있습니다." },
            { name: "!돈줘", value: "돈줘는 도박,출석체크를 위한 기초 단계입니다" },
            {
                name: "!순위표",
                value: "순위표는 모든 사람의 돈을 확인 할 수 있습니다",
            },
            { name: "!야", value: "야 라는 단어에 대답이 나옵니다." }
        );
        HelpEmbed.setTimestamp();
        message.channel.send({ embeds: [HelpEmbed] });
        return;
    }
});

client.login(token);
