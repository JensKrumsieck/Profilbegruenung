<script>
  export let isChecked;
  export let onChange
</script>

<label for="toogleA" class="flex items-center cursor-pointer">
  <!-- toggle -->
  <div class="relative">
    <!-- input -->
    <input
      id="toogleA"
      type="checkbox"
      class="sr-only"
      bind:checked={isChecked}
      on:change={onChange}
    />
    <!-- line -->
    <div class="w-10 h-4 bg-black rounded-full shadow-inner" />
    <!-- dot -->
    <div
      class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"
    />
  </div>
  <!-- label -->
  <div class="ml-3 text-white font-medium"><slot/></div>
</label>

<style>
  input:checked ~ .dot {
    transform: translateX(100%);
    background-color: #48bb78;
  }
</style>
