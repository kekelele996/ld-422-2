<template>
  <section>
    <div class="dashboard-cards">
      <el-card class="stat-card">
        <div class="stat-label">进行中项目</div>
        <div class="stat-value">{{ dashboard?.activeProjects.length ?? 0 }}</div>
        <div v-if="dashboard?.activeProjects?.length" class="stat-items">
          <el-tag v-for="p in dashboard.activeProjects" :key="p.id" size="small" class="project-tag">
            {{ p.name }}
          </el-tag>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-label">最近一周实验</div>
        <div class="stat-value highlight">{{ dashboard?.recentExperimentCount ?? 0 }}</div>
        <div class="stat-sub">条记录</div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-label">待审核实验</div>
        <div class="stat-value warning">{{ dashboard?.pendingReviews ?? 0 }}</div>
      </el-card>
    </div>

    <el-card v-if="dashboard?.lowStockReagents?.length" class="section-card">
      <template #header>
        <div class="card-header">
          <span>库存预警</span>
        </div>
      </template>
      <StockAlert
        v-for="r in dashboard.lowStockReagents"
        :key="r.id"
        :name="r.name"
        :stock="r.stock"
        :min-stock="r.minStock"
      />
    </el-card>

    <el-card v-if="dashboard?.activeProjects?.length" class="section-card">
      <template #header>
        <div class="card-header">
          <span>进行中项目状态</span>
        </div>
      </template>
      <div v-for="p in dashboard.activeProjects" :key="p.id" class="project-status">
        <div class="project-row">
          <span class="project-name">{{ p.name }}</span>
          <StatusBadge :value="p.status" />
        </div>
        <ProgressBar :used="p.usedBudget" :total="p.totalBudget" />
      </div>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { dashboardApi, type DashboardSummary } from "../api/dashboard";
import StatusBadge from "../components/common/StatusBadge.vue";
import StockAlert from "../components/common/StockAlert.vue";
import ProgressBar from "../components/common/ProgressBar.vue";

const dashboard = ref<DashboardSummary | null>(null);

onMounted(async () => {
  dashboard.value = await dashboardApi.summary();
});
</script>

<style scoped>
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}
.stat-card {
  text-align: center;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #303133;
}
.stat-value.highlight {
  color: #409eff;
}
.stat-value.warning {
  color: #e6a23c;
}
.stat-sub {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 4px;
}
.stat-items {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}
.project-tag {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.section-card {
  margin-bottom: 16px;
}
.card-header {
  font-weight: 600;
}
.project-status {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.project-status:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.project-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.project-name {
  font-weight: 500;
  color: #303133;
}
</style>
