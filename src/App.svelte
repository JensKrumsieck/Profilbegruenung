<script>
  import Cropper from "svelte-easy-crop";
  import { onMount } from "svelte";
  import Toggle from "./lib/components/Toggle.svelte";

  let image, original, px, preview, filename;
  let frame = new Image();
  let ltwBadge = new Image();
  let ltwAlt = new Image();
  let rect = new Image();
  let claim = new Image();
  let canvasArray = [];
  let images = [];
  let useFrame = false;
  let useBadge = true;
  let useRect = false;
  let useClaim = true;
  let useAltBadge = false;
  const folder = "../public";
  let fileformat = "png";

  onMount(async () => {
    //firefox does not like svg file, chrome does
    if (window.chrome) fileformat = "svg";
    var files = import.meta.glob(`../public/logos/*.png`);
    //Create canvasses (is that the plural?)
    await Promise.all(
      Object.entries(files).map(async ([path]) => {
        createCanvas();
        let badge = new Image();
        badge.src = path.slice(folder.length);
        images.push(badge);
      })
    );
    frame.src = `items/frame.${fileformat}`;
    ltwBadge.src = `items/stoerer.${fileformat}`;
    rect.src = `items/rect.${fileformat}`;
    claim.src = `items/claim.${fileformat}`;
    ltwAlt.src = `items/vote.${fileformat}`;
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
      "cursor-pointer",
      "hover:rounded-lg",
      "hover:border-4",
      "hover:border-yellow"
    );
    preview.append(canvas);
    canvasArray.push(canvas);
  }

  function onFileSelected(e) {
    let imageFile = e.currentTarget.files[0];
    filename = imageFile.name.slice(0, -4);
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      image = e.target.result;
      //add missing props
      original = new Image();
      original.src = image;
      px = { width: original.width, height: original.height, x: 0, y: 0 };
      previewCrop();
    };
    fileReader.readAsDataURL(imageFile);
  }

  function downloadfile(e) {
    var canvas = e.srcElement;
    var anchor = document.createElement("a");
    anchor.download = filename + "_begruent.png";
    anchor.href = canvas.toDataURL();
    anchor.click();
  }

  function onCropComplete(e) {
    px = e.detail.pixels;
    previewCrop();
  }

  function previewCrop() {
    for (var i = 0; i < images.length; i++) {
      var canvas = canvasArray[i];
      canvas.width = px.width;
      canvas.height = px.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(
        original,
        px.x,
        px.y,
        px.width,
        px.height,
        0,
        0,
        px.width,
        px.height
      );
      if (useFrame) drawItem(ctx, frame);
      if (useBadge) drawItem(ctx, ltwBadge);
      if (useRect) drawItem(ctx, rect);
      if (useClaim) drawItem(ctx, claim);
      if (useAltBadge) drawItem(ctx, ltwAlt);
      drawItem(ctx, images[i], useAltBadge);
    }
  }
  function drawItem(ctx, item, offset = false) {
    if(!offset)    
      ctx.drawImage(item, 0, 0, px.width, px.height);
    else    
      ctx.drawImage(item, -px.width/10.5, -px.height/2.5, px.width * 1.25, px.height * 1.25);
  }
</script>

<div class="flex flex-wrap container mx-auto bg-green md:max-w-[75%]">
  <div class="p-6 flex gap-4">
    <img class="h-8 w-8" srcset="logo-192.webp, logo-192.png" alt="logo" width="64px" height="64px" />
    <span class="font-bold text-xl text-yellow italic">Profilbegrünung</span>
  </div>
  <div class="bg-green relative w-full h-[35vh] md:h-[50vh]">
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
    <div class="flex flex-wrap gap-6 my-4">
      <Toggle bind:isChecked={useClaim} onChange={() => previewCrop()}
        >Claim einblenden</Toggle
      >
      <Toggle
        bind:isChecked={useBadge}
        onChange={() => {
          useAltBadge = false;
          previewCrop();
        }}>Wahlhinweis einblenden</Toggle
      >
      <Toggle bind:isChecked={useRect} onChange={() => previewCrop()}
        >Grüner Hintergrund unten</Toggle
      >
      <Toggle bind:isChecked={useFrame} onChange={() => previewCrop()}
        >Rahmen um Bild</Toggle
      >      
      <Toggle
        bind:isChecked={useAltBadge}
        onChange={() => {
          useBadge = false;
          useClaim = false;
          useFrame = true;
          previewCrop();
        }}>Wahlhinweis einblenden (Andere Darstellung)</Toggle
      >
    </div>
  </div>
  <ol class="list-decimal text-white font-bold mx-6 px-7">
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
  <div id="preview" class="w-full flex flex-wrap gap-4 my-4 md:px-6" />
  <div class="px-6 py-4 mt-4 text-green text-sm bg-orange rounded-tr-xl">
    Ein Projekt von <a
      class="hover:text-black font-semibold underline"
      href="https://jenskrumsieck.de">Jens Krumsieck</a
    >
    (<a
      class="hover:text-black font-semibold underline"
      href="https://gruene-braunschweig.de/">KV Braunschweig</a
    >)
  </div>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
