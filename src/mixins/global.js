export default {

    computed: {
        isAuthenticated() {
            return this.$session.exists();
        },
        user() {
            if(this.isAuthenticated)
                return this.$session.getAll();
            else
                return {};
        }
    }

}