<template>
  <section>
    <el-card v-if="!selectedId" class="list-card">
      <template #header>
        <div class="card-header">
          <span>研究项目列表</span>
          <el-button type="primary" size="small">新建项目</el-button>
        </div>
      </template>
      <el-table :data="projects" style="width: 100%" @row-click="selectProject">
        <el-table-column prop="projectNo" label="项目编号" width="180" />
        <el-table-column prop="name" label="项目名称" min-width="220" />
        <el-table-column label="方向" width="120">
          <template #default="{ row }">{{ directionLabel(row.direction) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <StatusBadge :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="预算" width="200">
          <template #default="{ row }">
            <ProgressBar :used="row.usedBudget" :total="row.totalBudget" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click.stop="selectProject(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-else class="detail-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button link size="small" @click="selectedId = null">← 返回列表</el-button>
            <span class="detail-title">{{ detail?.name }}</span>
            <StatusBadge :value="detail?.status ?? ''" />
          </div>
          <div class="header-right">
            <span class="project-no">{{ detail?.projectNo }}</span>
          </div>
        </div>
      </template>

      <div v-if="detail" class="detail-body">
        <el-descriptions :column="2" border size="default" class="info-section">
          <el-descriptions-item label="研究方向">{{ directionLabel(detail.direction) }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ leaderName }}</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ detail.startedAt }}</el-descriptions-item>
          <el-descriptions-item label="预计结束">{{ detail.expectedEndAt }}</el-descriptions-item>
          <el-descriptions-item label="总预算">¥{{ detail.totalBudget.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="已使用">¥{{ detail.usedBudget.toLocaleString() }}</el-descriptions-item>
        </el-descriptions>

        <div class="budget-section">
          <div class="section-label">预算使用情况</div>
          <ProgressBar :used="detail.usedBudget" :total="detail.totalBudget" />
        </div>

        <div class="members-section">
          <div class="section-label">项目成员 ({{ detail.members?.length ?? 0 }})</div>
          <div v-if="detail.members?.length" class="members-list">
            <el-tag
              v-for="m in detail.members"
              :key="m.id"
              size="default"
              :type="memberTagType(m.role)"
              effect="light"
              class="member-tag"
            >
              {{ memberName(m.userId) }} · {{ m.role }}
            </el-tag>
          </div>
          <el-empty v-else description="暂无成员" :image-size="80" />
        </div>

        <div class="timeline-section">
          <div class="section-label">实验记录时间线 ({{ detail.timeline?.length ?? 0 }})</div>
          <Timeline v-if="detail.timeline?.length" :items="detail.timeline" />
          <el-empty v-else description="暂无实验记录" :image-size="80" />
        </div>
      </div>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { projectApi } from "../api/project";
import type { ResearchProject } from "../types/project";
import StatusBadge from "../components/common/StatusBadge.vue";
import ProgressBar from "../components/common/ProgressBar.vue";
import Timeline from "../components/common/Timeline.vue";

const projects = ref<ResearchProject[]>([]);
const selectedId = ref<string | null>(null);
const detail = ref<ResearchProject | null>(null);

const leaderMap: Record<string, string> = {
  "u-pi": "王教授",
  "u-researcher": "李博士",
  "u-student": "赵同学",
  "u-admin": "平台管理员"
};

const leaderName = computed(() => detail.value ? (leaderMap[detail.value.leaderId] ?? detail.value.leaderId) : "");

const directionLabel = (dir: string) => {
  const map: Record<string, string> = {
    Biology: "生物",
    Chemistry: "化学",
    Physics: "物理",
    Materials: "材料",
    CS: "计算机",
    Other: "其他"
  };
  return map[dir] ?? dir;
};

const memberName = (userId: string) => leaderMap[userId] ?? userId;

const memberTagType = (role: string): "primary" | "success" | "warning" | "info" | "danger" => {
  if (role === "PI") return "danger";
  if (role === "SubPI") return "warning";
  if (role === "Researcher") return "primary";
  if (role === "Student") return "success";
  return "info";
};

const selectProject = async (row: ResearchProject) => {
  selectedId.value = row.id;
  detail.value = await projectApi.detail(row.id);
};

onMounted(async () => {
  projects.value = await projectApi.list();
});
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.project-no {
  font-size: 13px;
  color: #909399;
  font-family: monospace;
}
.list-card {
  cursor: pointer;
}
.detail-card {
  margin-bottom: 16px;
}
.detail-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.info-section {
  margin-top: 8px;
}
.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}
.budget-section {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 6px;
}
.members-section,
.timeline-section {
  margin-top: 4px;
}
.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.member-tag {
  font-size: 13px;
  padding: 4px 10px;
}
</style>
