<template>
  <v-card title="Панель администратора" max-width="60rem" class="mx-auto">
    <v-card-text>
      <v-file-input name="admin_file_upload" v-model="file" label="Выберите скан договора"></v-file-input>
      <v-btn @click="uploadFile" style="margin-bottom: 1em;" variant="tonal">
        Добавить файл
      </v-btn>
      <v-btn style="margin-bottom: 1em; margin-left: 1em !important;" @click="$router.push({ name: 'logout' })"
        variant="tonal" class="mx-auto">
        Выйти из аккаунта
      </v-btn>
      <v-btn @click="requestDump" style="margin-bottom:  1em; margin-left: 1em !important;" variant="tonal"
        class="mx-auto">
        Резервная копия БД
      </v-btn>
      <v-divider></v-divider>
      <v-list lines="one">
        <v-list-item v-for="model in models" :key="model" :title="model"
          :to="{ name: 'admin_single_table', params: { table: model } }" />
      </v-list>
    </v-card-text>
  </v-card>

  <v-snackbar v-model="snackbar.show">
    <span>{{ snackbar.text }}</span>
    <template v-slot:actions>
      <v-btn icon="mdi-close" @click="snackbar.show = false" />
    </template>
  </v-snackbar>
</template>

<script setup>
import { VCard, VCardText } from "vuetify/components/VCard";
import { VList, VListItem } from "vuetify/components/VList";
import { VFileInput } from "vuetify/components/VFileInput"
import { VSnackbar } from "vuetify/components/VSnackbar";
import { VDivider } from "vuetify/components/VDivider"
import { VBtn } from "vuetify/components/VBtn"
import { ref, onMounted, reactive } from "vue";
// import axios from "../utils/axios";



import { getCurrentInstance } from 'vue'
const app = getCurrentInstance()
const axios = app.appContext.config.globalProperties.$axios


const file = ref([]);
const models = ref([]);
const loading = ref(false);
const snackbar = reactive({
  show: false,
  text: null,
});

const uploadFile = async () => {
  if (file.value?.length > 0) {
    let formData = new FormData();
    formData.append("admin_file_upload", file.value[0]);

    let response = await axios.post("/uploads", formData)
    if (!response.data) {
      return
    }
    snackbar.show = true
    snackbar.text = `Файл ${file.value[0].name} успешно добавлен на сервер. Используйте его имя в качестве значения для поля Contract_File`
  }
}

const requestDump = async () => {
  try {
    let response = await axios.get("/users/admin_dump")
    let blob = new Blob([response.data], { type: 'text/sql' }),
      url = window.URL.createObjectURL(blob)
    window.open(url)
  } catch (error) {

  }
}

onMounted(() => {
  getModels();
});

const getModels = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get("/crud/models/");
    models.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
