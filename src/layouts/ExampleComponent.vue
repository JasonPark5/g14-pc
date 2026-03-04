<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <q-btn label="Add" icon="add" color="primary" @click="appendList" />
    <q-btn label="Delete" icon="delete" color="secondary" @click="deleteList" />
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface Todo {
  id: number
  content: string
}
export interface Meta {
  totalCount: number
}

interface Props {
  title: string
  todos?: Todo[]
  meta: Meta
  active: boolean
}

const props = withDefaults(defineProps<Props>(), {
  todos: () => []
})

const clickCount = ref(0)

function increment() {
  clickCount.value += 1
  return clickCount.value
}
// `todos`를 반응형 데이터로 복사
const todos = ref([...props.todos])
function appendList() {
  todos.value.push({
    id: todos.value.length + 1,
    content: `ct${todos.value.length + 1}`
  })
}
function deleteList() {
  todos.value.pop()
}

const todoCount = computed(() => todos.value.length)
</script>
