let api = null;

function set_instance(axios_instance) {
    api = axios_instance
    console.log("GOT INSTANCE: " + axios_instance);
    console.log("SAT INSTANCE: " + api);
}
export { set_instance }
export default api;