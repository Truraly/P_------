<template>
  <!-- - 今日平均收缩压/舒张压/心率 距离目标的差值
  - 近 3 日平均收缩压/舒张压/心率 距离目标的差值
  - 近 7 日平均收缩压/舒张压/心率 距离目标的差值 -->

  <el-checkbox-group v-model="showType1" style="margin-bottom: 12px">
    <el-checkbox-button
      v-for="i in ['普通', '左右手', '早中晚']"
      :key="i"
      :value="i"
    >
      {{ i }}
    </el-checkbox-button>
  </el-checkbox-group>
  <el-checkbox-group v-model="showType2" style="margin-bottom: 12px">
    <el-checkbox-button
      v-for="i in ['收缩压', '舒张压', '心率']"
      :key="i"
      :value="i"
    >
      {{ i }}
    </el-checkbox-button>
  </el-checkbox-group>
  <v-chart
    class="chart"
    :forceFit="false"
    style="height: 40vh"
    :option="echartsOption"
  />

  <el-divider />
  <el-form :model="newRecord" label-width="60px" style="max-width: 300px">
    <el-form-item label="新信息">
      <el-text class="mx-1">上压：</el-text>
      <el-text class="mx-1" :type="newRecord.high > 130 ? 'warning' : ''"
        >{{ newRecord.high }}
      </el-text>
      <el-divider direction="vertical" />
      <el-text class="mx-1">下压：</el-text>
      <el-text class="mx-1" :type="newRecord.low > 80 ? 'warning' : ''"
        >{{ newRecord.low }}
      </el-text>
      <el-divider direction="vertical" />
      <el-text class="mx-1">心率：</el-text>
      <el-text class="mx-1">{{ newRecord.heartRate }}</el-text>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="newRecord.remark"> </el-input>
    </el-form-item>
    <el-form-item label="位置">
      <!-- <el-select v-model="newRecord.location">
        <el-option label="右手" value="right"> </el-option>
        <el-option label="左手" value="left"> </el-option>
        <el-option label="其他位置" value="other"> </el-option>
      </el-select> -->
      <el-segmented
        v-model="newRecord.location"
        :options="['右手', '左手', '右脚', '左脚', '其他']"
        size="small"
        block
      />
    </el-form-item>
    <!-- 快速输入栏，以空格分割 -->
    <el-form-item>
      <el-input
        v-model="input"
        placeholder="快速输入上压 下压 心率"
        @keyup.enter="submit"
      >
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit">Submit</el-button>
    </el-form-item>
  </el-form>
  <el-divider />
  <!-- 只展示前5条 -->
  <el-text> 最近记录：</el-text>
  <el-table :data="records_list_all.slice(0, 6)" stripe="true" size="small">
    <el-table-column prop="high" label="上压" min-width="40px">
    </el-table-column>
    <el-table-column prop="low" label="下压" min-width="40px">
    </el-table-column>
    <el-table-column prop="heartRate" label="心率" min-width="40px">
    </el-table-column>
    <el-table-column prop="time" label="Time" min-width="120px">
    </el-table-column>
    <el-table-column prop="location" label="位置" min-width="40px">
    </el-table-column>
    <el-table-column prop="remark" label="备注" min-width="40px">
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import * as APIS from "@/apis/controller/index";
import * as models from "@/apis/interface/index";

import { defineComponent, ref, watch } from "vue";
import { type BloodPressureRecord } from "@/models/BloodPressureRecord";
import type { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";

const newRecord = ref<BloodPressureRecord>({
  high: 120,
  low: 70,
  heartRate: 70,
  time: Date.now(),
  remark: "",
  location: "右手",
});

const input = ref<string>("");

// 监听输入框的变化
watch(input, (newValue) => {
  const parts = newValue.split(/\D+/).filter((part) => part !== "");
  if (parts.length === 3) {
    console.log(parts);
    newRecord.value.high = parseInt(parts[0]);
    newRecord.value.low = parseInt(parts[1]);
    newRecord.value.heartRate = parseInt(parts[2]);
  }
});

async function submit() {
  try {
    let body: APIS.PostRecordsInput = {
      high: newRecord.value.high,
      low: newRecord.value.low,
      heartRate: newRecord.value.heartRate,
      remark: newRecord.value.remark,
      location: newRecord.value.location,
    };
    let res = await APIS.postRecords(body, APIS.axiosConfig);
    if (res.status === 201) {
      ElMessage.success("提交成功");
      loadList();
    } else {
      ElMessage.error(
        "提交失败, code: " + res.status + ", message: " + res.data
      );
    }
  } catch (e) {
    // console.log(e)
    if ((e as any).response) {
      ElMessage.error("提交失败, message: " + (e as any).response.data.message);
    } else {
      ElMessage.error("提交失败, error: " + e);
    }
  }
}

const records_list_all = ref<BloodPressureRecord[]>([]);
const config: APIS.GetRecordsLatestByCountParams = {
  count: 0,
};
function loadList() {
  APIS.getRecordsLatestByCount(config, APIS.axiosConfig).then((res) => {
    // @ts-ignore
    res.data.forEach((record) => {
      record.time = new Date(record.time).toLocaleString();
    });
    // 倒序排列
    // @ts-ignore
    res.data.reverse();
    // @ts-ignore
    records_list_all.value = res.data;
  });
}

loadList();

// 获取今日，近 3 日，近 7 日的列表

// 使用computed计算平均值
import { computed } from "vue";
const oneDayTime = 24 * 60 * 60 * 1000;

// 获取平均数据
function getAverageArr(
  recordsArr: BloodPressureRecord[],
  otherConfig: {} = {}
): {
  high: number;
  low: number;
  heartRate: number;
} {
  if (recordsArr.length === 0) {
    return {
      ...otherConfig,
      high: null as unknown as number,
      low: null as unknown as number,
      heartRate: null as unknown as number,
    };
  }

  const high = recordsArr.reduce((acc, record) => acc + record.high, 0);
  const low = recordsArr.reduce((acc, record) => acc + record.low, 0);
  const heartRate = recordsArr.reduce(
    (acc, record) => acc + record.heartRate,
    0
  );
  return {
    ...otherConfig,
    high: parseFloat((high / recordsArr.length).toFixed(1)),
    low: parseFloat((low / recordsArr.length).toFixed(1)),
    heartRate: parseFloat((heartRate / recordsArr.length).toFixed(1)),
  };
}

// 通过回调函数，获取需要的数据
function getAverageByCallback(
  records: BloodPressureRecord[],
  callback: (records: BloodPressureRecord) => Boolean
): { high: number; low: number; heartRate: number } {
  console.log("records", records);
  const recordsArr = records.filter(callback);
  console.log("recordsArr", recordsArr);
  return getAverageArr(recordsArr);
}
// 挑选函数，获取x天内的数据
function getFun_getRecordsByDays(
  days: number
): (record: BloodPressureRecord) => Boolean {
  let daysAgoStamp = new Date().getTime();
  daysAgoStamp = daysAgoStamp - (daysAgoStamp % oneDayTime) - days * oneDayTime;
  return (record: BloodPressureRecord) => {
    const recordDate = new Date(record.time);
    return recordDate.getTime() >= daysAgoStamp;
  };
}

// 挑选函数，获取距今x天（一天）的数据
function getFun_getRecordsByDaysOne(
  days: number
): (record: BloodPressureRecord) => Boolean {
  let daysAgoStamp = new Date().getTime();
  daysAgoStamp = daysAgoStamp - days * oneDayTime;
  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  let date = new Date().getDate();

  return (record: BloodPressureRecord) => {
    const recordDate = new Date(record.time);
    return (
      recordDate.getFullYear() === year &&
      recordDate.getMonth() === month &&
      recordDate.getDate() === date - days
    );
  };
}

// 挑选函数，获取指定位置的数据
function getFun_getRecordsByLocation(
  location: string
): (record: BloodPressureRecord) => Boolean {
  return (record: BloodPressureRecord) => record.location === location;
}

// 挑选函数，获取指定时间的数据
// 早上：4-10，中午：10-18，晚上：18-4
function getFun_getRecordsByTime(
  time: string
): (record: BloodPressureRecord) => Boolean {
  let timeArr = time.split("-");
  let start = parseInt(timeArr[0]);
  let end = parseInt(timeArr[1]);
  return (record: BloodPressureRecord) => {
    let recordDate = new Date(record.time);
    let hour = recordDate.getHours();
    if (start < end) {
      return hour >= start && hour < end;
    } else {
      return hour >= start || hour < end;
    }
  };
}

// 将数据注入option
function injectData(
  data: {
    high: number;
    low: number;
    heartRate: number;
    _name: string[];
  },
  option: any
) {
  console.log("data", data);
  data._name.forEach((name) => {
    let index_ = option.series.findIndex(
      (series: { name: string }) => series.name === name
    );
    if (index_ === -1) return;
    else if (name.includes("收缩压"))
      option.series[index_].data.push(data.high);
    else if (name.includes("舒张压")) option.series[index_].data.push(data.low);
    else if (name.includes("心率"))
      option.series[index_].data.push(data.heartRate);
  });
}
// ECharts
const showType1 = ref(["普通"]);
const showType2 = ref(["收缩压", "舒张压", "心率"]);
const funList_1 = computed(() => {
  let funarr = [];
  if (showType1.value.includes("普通")) {
    funarr.push({
      _name: "",
      _fun: (() => true) as (record: BloodPressureRecord) => Boolean,
    });
  }
  if (showType1.value.includes("左右手")) {
    funarr.push({
      _name: "左手",
      _fun: getFun_getRecordsByLocation("左手"),
    });
    funarr.push({
      _name: "右手",
      _fun: getFun_getRecordsByLocation("右手"),
    });
  }
  if (showType1.value.includes("早中晚")) {
    funarr.push({
      _name: "早上",
      _fun: getFun_getRecordsByTime("4-10"),
    });
    funarr.push({
      _name: "白天",
      _fun: getFun_getRecordsByTime("10-18"),
    });
    funarr.push({
      _name: "晚上",
      _fun: getFun_getRecordsByTime("18-4"),
    });
  }
  return funarr;
});
import "echarts";
import VChart, { THEME_KEY } from "vue-echarts";
import { provide } from "vue";
// provide(THEME_KEY, 'dark');

const echartsOption = computed(() => {
  let first = true;
  let option = {
    title: {
      text: "近日平均血压",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      top: "9%",
      data: [
        // "收缩压",
        // "舒张压",
        // "心率",
        // "收缩压(左手)",
        // "舒张压(左手)",
        // "心率(左手)",
        // "收缩压(右手)",
        // "舒张压(右手)",
        // "心率(右手)",
        // "收缩压(早上)",
        // "舒张压(早上)",
        // "心率(早上)",
        // "收缩压(白天)",
        // "舒张压(白天)",
        // "心率(白天)",
        // "收缩压(晚上)",
        // "舒张压(晚上)",
        // "心率(晚上)",
      ] as string[],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [] as string[],
    },
    yAxis: {
      type: "value",
    },
    series: [
      //   {
      //     name: "收缩压",
      //     type: "line",
      //     data: [] as number[],
      //   },
      //   {
      //     name: "舒张压",
      //     type: "line",
      //     data: [] as number[],
      //   },
      //   {
      //     name: "心率",
      //     type: "line",
      //     data: [] as number[],
      //   },
    ] as any[],
    dataZoom: [
      {
        show: true,
        type: "inside",
        filterMode: "none",
        yAxisIndex: [0],
        startValue: 40,
        
   
      },
    ],
  };

  for (const j of funList_1.value) {
    console.log("j", j);
    // 创建线条
    let lineName = showType2.value.map((name) => {
      return name + ((j as any)._name ? `(${(j as any)._name})` : "");
    });
    console.log("lineName", lineName);
    lineName.forEach((name) => {
      option.series.push({
        name: name,
        type: "line",
        data: [] as number[],
      });
      option.legend.data.push(name);
    });
    for (const i of [
      {
        _name: "avg30",
        _fun: getFun_getRecordsByDays(30),
      },
      {
        _name: "avg7",
        _fun: getFun_getRecordsByDays(7),
      },
    ]) {
      if (first) option.xAxis.data.push(i._name);
      console.log("i", i);
      injectData(
        {
          ...getAverageByCallback(
            records_list_all.value,
            (record: BloodPressureRecord) => {
              return j._fun(record) && i._fun(record);
            }
          ),
          _name: lineName,
        },
        option
      );
    }

    for (let i = 4; i >= 0; i--) {
      if (first) {
        let date = new Date(new Date().valueOf() - i * oneDayTime);
        let mounth = date.getMonth() + 1;
        let day = date.getDate();
        option.xAxis.data.push(`${mounth}-${day}`);
      }
      injectData(
        {
          ...getAverageByCallback(
            records_list_all.value,
            (record: BloodPressureRecord) => {
              return j._fun(record) && getFun_getRecordsByDaysOne(i)(record);
            }
          ),
          _name: lineName,
        },
        option
      );
    }
    first = false;
  }

  //   // avg30, avg7
  //   const avg30 = getAverageArr(getAverage(records_list_all.value, 30));
  //   injectData({ ...avg30, _name: "avg30" }, option);

  //   const avg7 = getAverageArr(getAverage(records_list_all.value, 7));
  //   injectData({ ...avg7, _name: "avg7" }, option);
  //   // 遍历获取近5天每天的数据，若无则不放入
  //   for (let i = 4; i >= 0; i--) {
  //     const avg = getAverageByDays(records_list_all.value, i);
  //     console.log("avg", avg);
  //     if (avg.high !== 0) {
  //       option.xAxis.data.push(avg.date);
  //       option.series[0].data.push(avg.high);
  //       option.series[1].data.push(avg.low);
  //       option.series[2].data.push(avg.heartRate);
  //     } else {
  //       console.warn("no data");
  //     }
  //   }
  console.log("option", option);
  return option;
});
</script>
<style>
.chart {
  height: 50vh;
}
</style>
