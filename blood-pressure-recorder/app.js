const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const Log4js = require("log4js");
const { log } = require("console");
Log4js.configure({
  appenders: {
    everything: { type: "file", filename: "all-the-logs.log" },
    console: { type: "console" },
  },
  categories: {
    default: { appenders: ["everything", "console"], level: "debug" },
  },
});

const logger = Log4js.getLogger();
const app = express();
app.use(bodyParser.json());

// 跨域
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const dataFilePath = path.join(__dirname, "data.json");

// 加载数据
function loadData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    logger.error("Error loading data:", err);
    return { records: [] };
  }
}

// 保存数据
function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// 新增血压记录
app.post("/records", (req, res) => {
  const { high, low, heartRate, remark, location } = req.body;
  const time = Date.now();
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const hour = new Date().getHours();
  // 检查数据是否合法
  if (!high || !low || !heartRate || !location) {
    return res.status(400).send({ message: "Invalid data" });
  }
  if (typeof high !== "number" || typeof low !== "number" || typeof heartRate !== "number") {
    return res.status(400).send({ message: "Invalid data type" });
  }

  // TODO:获取设备信息
  const device = req.get("User-Agent");
  // 获取请求ip
  const ip = req.ip;
  const data = loadData();
  data.records.push({
    high,
    low,
    heartRate,
    time,
    remark,
    location,
    year,
    month,
    day,
    hour,
    device,
    ip,
  });
  saveData(data);
  logger.info("/records POST", { high, low, heartRate, location }, ip, device);
  res.status(201).send({ message: "Record added successfully" });
});

// 获取某timestamp之后的血压记录
app.get("/records/after/:timestamp", (req, res) => {
  logger.info("/records/after/:timestamp GET", req.params.timestamp);
  const { timestamp } = req.params;
  const data = loadData();
  const filteredRecords = data.records.filter(
    (record) => record.time > timestamp
  );
  res.json(filteredRecords);
});

//    获取前x条血压记录
app.get("/records/latest/:count", (req, res) => {
  logger.info("/records/latest/:count GET", req.params.count);
  const { count } = req.params;
  const data = loadData();
  const latestRecords = data.records.slice(-count);

  res.json(latestRecords);
});

// 修改血压记录
// 对应项若无则沿用原值
app.put("/records/:timestamp", (req, res) => {
  const { timestamp } = req.params;
  const { high, low, heartRate, remark, location } = req.body;
  logger.info("/records/:timestamp PUT", req.params.timestamp, req.body);
  const data = loadData();
  const index = data.records.findIndex((r) => r.time === parseInt(timestamp));
  if (index === -1) {
    return res.status(404).send({ message: "Record not found" });
  }
  const record = data.records[index];
  data.records[index] = {
    ...record,
    high: high !== undefined ? high : record.high,
    low: low !== undefined ? low : record.low,
    heartRate: heartRate !== undefined ? heartRate : record.heartRate,
    remark: remark !== undefined ? remark : record.remark,
    location: location !== undefined ? location : record.location,
  };
  saveData(data);
  res.send({ message: "Record updated successfully" });
});

// 删除血压记录
app.delete("/records/:id", (req, res) => {
  const { id } = req.params;
  logger.info("/records/:id DELETE", id);
  const data = loadData();
  const index = data.records.findIndex((r) => r.time === parseInt(id));
  if (index === -1) {
    return res.status(404).send({ message: "Record not found" });
  }

  data.records.splice(index, 1);
  saveData(data);

  res.send({ message: "Record deleted successfully" });
});

// vue静态资源
app.use(express.static(path.join(__dirname, "dist")));
// 其余非/records的请求返回index.html
app.get(/^(?!\/records).*/, (req, res) =>
  res.sendFile(path.join(__dirname, "dist", "index.html"))
);

// 全局错误处理
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).send({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 1300;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
