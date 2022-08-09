<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <UploadExcel />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UploadExcel from '@/components/UploadExcel'
import { mixins } from '@/utils/mixins'

export default {
  name: 'Dashboard',
  components: { UploadExcel },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'name'
    ])
  }
  // mounted() {
  //   this.hello()
  // }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
