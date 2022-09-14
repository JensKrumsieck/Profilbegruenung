<script>
  import Cropper from "svelte-easy-crop";
  import { onMount } from "svelte";

  let image, original;
  let canvasArray = [];
  let images = [];
  let preview;

  const files = [
    "endlichmachen.png",
    "endlichmachen2.png",
    "endlichmachen3.png",
    "endlichmachen4.png",
    "endlichmachen5.png",
    "endlichmachen6.png",
    "grünwählen.png",
    "pride.png",
    "pride2.png",
    "flower.png",
    "flower2.png",
    "logo.png",
    "gj.png",
    "femin.png",
    "femin2.png",
    "atom.png",
  ];

  onMount(() => {
    //Create canvasses (is that the plural?)
    files.forEach((f) => {
      createCanvas();  
      let badge = new Image();
      badge.src = "frames/" + f;
      images.push(badge);
    });
  });

  function createCanvas() {
    preview = document.getElementById("preview");
    var canvas = document.createElement("canvas");
    canvas.addEventListener("click", downloadfile);
    canvas.classList.add(
      "md:w-48",
      "w-24",
      "md:h-48",
      "h-24",
      "rounded-full",
      "cursor-pointer"
    );
    preview.append(canvas);
    canvasArray.push(canvas);
  }

  function onFileSelected(e) {
    let imageFile = e.currentTarget.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      image = e.target.result;
      //add missing props
      original = new Image();
      original.src = image;
      previewCrop(original.width, original.height, 0, 0);
    };
    fileReader.readAsDataURL(imageFile);
  }

  function downloadfile(e) {
    var canvas = e.srcElement;
    var anchor = document.createElement("a");
    anchor.download = "grün.png";
    anchor.href = canvas.toDataURL();
    anchor.click();
  }

  function onCropComplete(e) {
    let px = e.detail.pixels;
    previewCrop(px.width, px.height, px.x, px.y);
  }

  function previewCrop(width, height, dx, dy) {
    for (var i = 0; i < files.length; i++) {
      var canvas = canvasArray[i];
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(original, dx, dy, width, height, 0, 0, width, height);
      ctx.drawImage(images[i], 0, 0, width, height);
    }
  }
</script>

<div class="flex flex-wrap md:w-1/2 container mx-auto bg-green">
  <div class="p-6 flex gap-4">
    <img src="logo.png" alt="logo" class="h-8" />
    <span class="font-bold text-xl text-yellow italic">Profilbildrahmen Generator</span>
  </div>
  <div class="bg-green relative w-full h-[50vh]">
    {#if image}
      <Cropper
        bind:image
        aspect={1}
        cropShape="round"
        showGrid={true}
        on:cropcomplete={onCropComplete}
      />
    {/if}
  </div>
  <div class="p-7">
    <input
      class="text-sm text-white
    file:mr-5 file:py-2 file:px-6
    file:rounded-full file:border-0
    file:text-sm file:font-medium
    file:bg-orange file:text-black
    hover:file:cursor-pointer hover:file:bg-yellow
    hover:file:text-black"
      type="file"
      accept=".jpg, .jpeg, .png"
      on:change={(e) => onFileSelected(e)}
    />
    <ol class="list-decimal text-white font-bold m-6">
      <li>
        <strong class="italic my-4"
          >Auf Schaltfläche tippen und Bild auswählen.</strong
        >
      </li>
      <li>
        <strong class="italic my-4">Bild zurechtschneiden.</strong>
      </li>
      <li>
        <strong class="italic my-4"
          >Zum Speichern auf das gewünschte Muster tippen.</strong
        >
      </li>
    </ol>
    <div id="preview" class="w-full flex flex-wrap gap-4 my-4" />
  </div>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
