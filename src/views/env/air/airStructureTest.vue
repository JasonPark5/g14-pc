<template>
  <div>
    <c-card title="배출구-방지시설-배출시설 구조도" class="cardClassDetailForm air-structure-card">
      <template v-slot:card-detail>
        <div class="vue-flow-wrapper">
          <VueFlow :nodes="nodes" :edges="edges" fit-view>
            <Background />
            <!-- <Controls /> -->
          </VueFlow>
        </div>
      </template>
    </c-card>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
import { VueFlow, Position } from '@vue-flow/core'
import { Background } from '@vue-flow/additional-components'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const popupOptions = ref({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)

const nodes = ref([
  {
    id: '배출구1',
    label: '배출구1',
    position: { x: 0, y: 100 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Bottom,
    style: { backgroundColor: '#a0c4ff' }
  },
  {
    id: '배출구2',
    label: '배출구2',
    position: { x: 0, y: 200 },
    sourcePosition: Position.Top,
    targetPosition: Position.Top,
    style: { backgroundColor: '#a0c4ff' }
  },
  {
    id: '방지시설1',
    label: '방지시설1',
    position: { x: 200, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { backgroundColor: '#ffadad' }
  },
  {
    id: '방지시설2',
    label: '방지시설2',
    position: { x: 200, y: 200 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { backgroundColor: '#ffadad' }
  },
  {
    id: '배출시설1',
    label: '배출시설1',
    position: { x: 400, y: 60 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Bottom,
    style: { backgroundColor: '#caffbf' }
  },
  {
    id: '배출시설2',
    label: '배출시설2',
    position: { x: 400, y: 150 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    style: { backgroundColor: '#caffbf' }
  },
  {
    id: '배출시설3',
    label: '배출시설3',
    position: { x: 400, y: 240 },
    sourcePosition: Position.Top,
    targetPosition: Position.Top,
    style: { backgroundColor: '#caffbf' }
  }
])

const edges = ref([
  { id: 'e1', source: '배출구1', target: '배출구2', type: 'smoothstep' },
  { id: 'e2', source: '배출구1', target: '방지시설1', type: 'smoothstep' },
  { id: 'e3', source: '배출구1', target: '방지시설2', type: 'smoothstep' },
  { id: 'e4', source: '배출구2', target: '방지시설1', type: 'smoothstep' },
  { id: 'e5', source: '배출구2', target: '방지시설2', type: 'smoothstep' },
  { id: 'e6', source: '방지시설1', target: '배출시설1', type: 'smoothstep' },
  { id: 'e7', source: '방지시설2', target: '배출시설1', type: 'smoothstep' },
  { id: 'e8', source: '방지시설2', target: '배출시설2', type: 'smoothstep' },
  { id: 'e9', source: '방지시설2', target: '배출시설3', type: 'smoothstep' },
  { id: 'e10', source: '배출시설1', target: '배출시설2', type: 'smoothstep' },
  { id: 'e11', source: '배출시설2', target: '배출시설3', type: 'smoothstep' }
])

onMounted(() => {
  editable.value = Boolean(route.meta.editable)
})
</script>

<style scoped>
.air-structure-card {
  height: 1000px;
}
.vue-flow-wrapper {
  height: 600px;
  width: 100%;
  border: 1px solid #ccc;
}
</style>
