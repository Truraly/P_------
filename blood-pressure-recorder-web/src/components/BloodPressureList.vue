<template>
  <el-table :data="records" stripe="true" size="small">
    <el-table-column prop="high" label="上压" min-width="40px">
    </el-table-column>
    <el-table-column prop="low" label="下压" min-width="40px">
    </el-table-column>
    <el-table-column prop="heartRate" label="心率" min-width="40px">
    </el-table-column>
    <el-table-column prop="time" label="Time"> </el-table-column>
    <el-table-column prop="location" label="位置" min-width="40px">
    </el-table-column>
    <el-table-column prop="remark" label="备注"> </el-table-column>
    <el-table-column fixed="right" label="Operations">
      <template #default="{ row }">
        <el-button link type="danger" @click="deleteRecord(row)">
          删除
        </el-button>
        <el-button
          link
          type="primary"
          @click="ElMessage.success('man! what can I say')"
        >
          修改
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { defineComponent, ref, defineProps } from "vue";
// 获取传入的数据

import { type BloodPressureRecord } from "../models/BloodPressureRecord";
import * as APIS from "@/apis/controller/index";
import { de } from "element-plus/es/locale/index.mjs";
const records = ref<BloodPressureRecord[]>([]);
function loadList() {
  const config: APIS.GetRecordsLatestByCountParams = {
    count: 0,
  };
  APIS.getRecordsLatestByCount(config, APIS.axiosConfig).then((res) => {
    // @ts-ignore
    res.data.forEach((record) => {
      record.timestamp = record.time;
      record.time = new Date(record.time).toLocaleString();
    });
    // 倒序排列
    // @ts-ignore
    res.data.reverse();
    // @ts-ignore
    records.value = res.data;
  });
}

loadList();
import { ElMessage, ElMessageBox } from "element-plus";

// 删除函数
const deleteRecord = (record: BloodPressureRecord) => {
  // 弹出确认框
  ElMessageBox.confirm("确定删除吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 确认删除
      console.log(record);
      let config: APIS.DeleteRecordsByIdParams = {
        //@ts-ignore
        id: record.timestamp,
      };
      APIS.deleteRecordsById(config, APIS.axiosConfig)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            loadList();
            ElMessage.success("删除成功");
          } else {
            ElMessage.error("删除失败");
          }
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("删除失败");
        });
    })
    .catch(() => {
      // 取消删除
      ElMessage.info("已取消删除");
    });
};
</script>
