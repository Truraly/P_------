// {
//     "high": 120,
//     "low": 70,
//     "heartRate": 70,
//     "time": 1713013906314,
//     "remark": "",
//     "location": "右手",
//     "year": 2024,
//     "month": 4,
//     "day": 13,
//     "hour": 21,
//     "device": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0",
//     "ip": "::ffff:127.0.0.1"
//   },

// 随机生成血压数据
let datas = [];
for (let i = 0; i < 1000; i++) {
  let data = {};
  data.high = Math.floor(Math.random() * 100 + 100);
  data.low = Math.floor(Math.random() * 50 + 50);
  data.heartRate = Math.floor(Math.random() * 50 + 50);
  // 日期为最近10天内的随机日期
  let now = new Date();
  let time =
    now.getTime() -
    Math.floor(Math.random() * 864000000 * 3) +
    12 * 60 * 60 * 1000;
  let date = new Date(time);
  data.time = date.getTime();
  data.year = date.getFullYear();
  data.month = date.getMonth() + 1;
  data.day = date.getDate();
  data.hour = date.getHours();
  data.remark = "";
  data.location = ["左手", "右手", "其他"][Math.floor(Math.random() * 3)];
  data.device =
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0";
  data.ip = "::ffff";

  datas.push(data);
}
// console.log(datas)
// 输出到文件
const fs = require("fs");
fs.writeFileSync(
  "./data.json",
  JSON.stringify(
    {
      records: datas,
    },
    null,
    2
  )
);
console.log("生成成功");
