<template>
  <div class="vModel">
    <button type="button" @click="handleClick(value - 1)">-</button>
    <span>{{ value }}</span>
    <button type="button" @click="handleClick(value + 1)">+</button>
  </div>
</template>

<script>
export default {
  props: ["value"],
  model: {
    event: "changeNumber",
  },
  methods: {
    handleClick(e) {
      this.$emit("changeNumber", e);
    },
  },
};
</script>

<style>
button {
  display: inline-block;
}
span {
  margin: 0 5px;
}
.vModel {
  display: none;
}
</style>