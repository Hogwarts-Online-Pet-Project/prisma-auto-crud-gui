import Tables from "./views/Tables.vue";
import Items from "./views/Items.vue";
import Item from "./views/Item.vue";

import axios from "axios";
import api, { set_instance } from './utils/axios'

export default {
  install: (app, options) => {
    const { router, apiUrl } = options;
    set_instance(app.config.globalProperties.$axios)
    // axios.defaults.baseURL = apiUrl;
    const routes = [
      {
        path: "/admin/tables",
        component: Tables,
        name: "admin_tables"
      },
      {
        path: "/admin/:table",
        component: Items,
        name: "admin_single_table"
      },
      {
        path: "/admin/:table/:primaryKey",
        component: Item,
        name: "admin_table_item"
      },
    ];

    routes.forEach(router.addRoute);
  },
};
