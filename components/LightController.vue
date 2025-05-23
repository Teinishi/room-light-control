<script setup lang="ts">
const commandTypes = ref(COMMAND_TYPES);
</script>

<template>
  <div class="grid grid-cols-2 grid-rows-3 grid-flow-col gap-4">
    <RemoteButton
      v-for="command in commandTypes"
      :key="command.type"
      :command-type="command.type"
      :color="command.buttonColor"
      :variant="command.buttonVariant"
    >{{ command.label }}</RemoteButton>
  </div>
</template>
