<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-btn icon="mdi-arrow-left" :to="{ name: 'admin_tables' }" />
      <v-toolbar-title>{{ table }}</v-toolbar-title>
      <v-spacer />
      <NewItemDialog :table="table" />
    </v-toolbar>
    <v-divider />
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th v-for="field in primitiveFields" :key="`header_${field.name}`">
              <!-- <th class="text-left">See</th> -->
              <v-btn
                variant="text"
                class="text-capitalize"
                :append-icon="headerButtonIcon(field)"
                @click="headerButtonClicked(field)"
              >
                {{ field.name }}
              </v-btn>
            </th>
            
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>
              <v-btn
                v-if="primaryKeyField"
                icon="mdi-arrow-right"
                :to="{
                  name: 'admin_table_item',
                  params: { table, primaryKey: item[primaryKeyField] },
                }"
                flat
              />
            </td>
            <td
              v-for="field in primitiveFields"
              :key="`item_${index}_${field.name}`"
            >
              {{ item[field.name] }}
            </td>
          </tr>
        </tbody>
      </v-table>
      <TablePagination :total="total" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { VTable } from "vuetify/components/VTable";
import { VCard, VCardText } from "vuetify/components/VCard";
import { VDivider } from "vuetify/components/VDivider";
import { VToolbar, VToolbarTitle } from "vuetify/components/VToolbar";
import { VBtn } from "vuetify/components/VBtn";
import { VSpacer } from "vuetify/components/VGrid";

import NewItemDialog from "../components/NewItemDialog.vue";
import TablePagination from "../components/TablePagination.vue";

import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";
// import axios from "../utils/axios";

import { getCurrentInstance } from 'vue'
const app = getCurrentInstance()
const axios = app.appContext.config.globalProperties.$axios


const route = useRoute();
const router = useRouter();

const updateQuery = (newItem) => {
  const query = { ...route.query, ...newItem };
  // Preventing route duplicates
  if (JSON.stringify(route.query) !== JSON.stringify(query))
    router.push({ query });
};

const total = ref(0);
const items = ref([]);
const fields = ref([]);
const loading = ref(false);
const table = computed(() => route.params.table);
const query = computed(() => route.query);

// Overly complicated and needs to be done for every parameter
// Will be simplified when Vuetify 3 releases data-tables

const sort = computed({
  get() {
    return query.value.sort || primaryKeyField.value;
  },
  set(newVal) {
    updateQuery({ sort: newVal });
  },
});

const order = computed({
  get() {
    return query.value.order || "desc";
  },
  set(newVal) {
    updateQuery({ order: newVal });
  },
});

const primitiveFields = computed(() =>
  // TODO: consider field.type otherwise
  fields.value.filter(({ kind }) => kind === "scalar")
);

const primaryKeyField = computed(
  () => fields.value.find(({ isId }) => isId)?.name
);

onMounted(() => {
  getFields();
  getItems();
});

watch(table, () => {
  if (!table.value) return;
  getFields();
  getItems();
});

watch(query, () => {
  if (!table.value) return;
  getItems();
});

const getItems = async () => {
  loading.value = true;
  try {
    const route = `/crud/${table.value}/`;
    const params = { ...query.value };
    const { data } = await axios.get(route, { params });

    items.value = data.items;
    total.value = data.total;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getFields = async () => {
  try {
    const route = `/crud/models/${table.value}/`;
    const { data } = await axios.get(route);
    fields.value = data.fields;
  } catch (error) {
    console.error(error);
  }
};

const headerButtonIcon = (field) => {
  if (sort.value === field.name) {
    if (order.value === "desc") return "mdi-arrow-up";
    else return "mdi-arrow-down";
  } else return undefined;
};

const headerButtonClicked = (field) => {
  if (sort.value === field.name) {
    if (order.value === "desc") order.value = "asc";
    else order.value = "desc";
  } else {
    sort.value = field.name;
  }
};
</script>
