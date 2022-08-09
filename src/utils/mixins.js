import store from '@/store'

export const mixins = {
//   created() {
//     console.log('混入对象的mixins')
//   },
//   mounted() {
//     console.log('这是mixins的mounted')
//   },
  methods: {
    checkPermission(key) {
      return !store.state.user.userInfor.roles.points.includes(key)
    }
  }
}
