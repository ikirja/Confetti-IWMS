<template>
  <div v-if="product">
    <div
      class="modal fade"
      :class="{ show: show, 'd-block': show }"
      tabindex="-1"
      :aria-labelledby="'modalImageUpload' + product._id"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              class="modal-title"
              :id="'modalImageUpload' + product._id"
            >
              Загрузка изображений товара
            </h5>
            <button
              @click="toggleModal"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-hidden="true"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 d-flex flex-wrap">
                <div v-for="index in uploadingCount" :key="index" class="image mb-3">
                  <div class="spinner-grow text-primary" role="status"></div>
                </div>
                <div v-for="image in uploadedImages" :key="image" class="image mb-3">
                  <img class="w-100" :src="'/upload/' + image.file + '.jpg'" :alt="product.title">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <label for="1" class="form-label"
                  >Изображения</label
                >
                <input
                  type="file"
                  class="form-control"
                  @change="uploadFiles"
                  multiple
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              @click="toggleModal"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import request from "@/modules/request";

export default {
  props: ["show", "product"],
  setup(props, { emit }) {
    const store = useStore();
    const uploadingCount = ref(0);
    const uploadedImages = ref([]);

    async function uploadFiles(event) {
      const images = await getImagesForUpload(event.target.files);
      uploadingCount.value = images.length;

      const uploadingImages = [];
      images.forEach(image => uploadingImages.push(request('/api/v1/image', 'POST', store.state.token, image)));

      const uploaded = await Promise.allSettled(uploadingImages);
      showUploadedImages(uploaded);

      uploadingCount.value = 0;
    }

    async function imageToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    async function getImagesForUpload(files) {
      const images = [];

      for (let i = 0; i < files.length; i++) {
        if (files[i].type === 'image/jpeg') {
          let base64Image = await imageToBase64(files[i]);
          base64Image = base64Image.substring(23);
          images.push({ image: base64Image, type: 'product', productId: props.product._id });
        }
      }

      return images;
    }

    function showUploadedImages(finishedPromises) {
      finishedPromises.forEach(promise => {
        if (promise.status === 'fulfilled' && promise.value.file) uploadedImages.value.push(promise.value);
      });
    }

    function toggleModal() {
      emit("toggleModal", props.product._id);
    }

    return {
      uploadingCount,
      uploadedImages,
      uploadFiles,
      toggleModal
    };
  },
};
</script>

<style scoped>
.image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 150px;
  margin: 10px;
  border: 1px solid rgb(210, 213, 217);;
  border-radius: 4px;
}
</style>