export default {

    methods: {
        navigate(path) {
            if (this.$route.path !== path)
                this.$router.push(path);
        }
    },

    computed: {
        user() {
            return this.$store.getters.user;
        },
        reactions() {
            return this.$store.getters.reactions;
        }
    }

};