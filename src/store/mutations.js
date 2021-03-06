import Vue from 'vue'

export default {
  SET_ITEM: (state, { resource, id, item }) => {
    item._id = id
    Vue.set(state[resource].items, id, item)
  }
}
