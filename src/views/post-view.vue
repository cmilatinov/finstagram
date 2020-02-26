<template>
	<div class="scroll-container">
		<div class="content">
			<b-card
                body-bg-variant="border-white"
                class="card" v-if="post">

                <b-card-body>
                    <b-card-text>
                        Posted by <strong><i>{{post.user.username}}</i></strong>
                        <span style="float: right">{{timePosted}}</span>
                    </b-card-text>
                </b-card-body>

                <div class="card-image">
                    <b-card-img :src="image"/>
                    <div class="image-overlay"></div>
                </div>

                <b-card-body>
                    <b-card-text>
                        <i>{{post.image.caption}}</i>
                    </b-card-text>
                </b-card-body>
            </b-card>
		</div>
	</div>
</template>

<script>
import network from '../helpers/network';
import utils from '../helpers/utils';
export default {
	data() {
		return {
            post: null
        };
    },
    activated() {
        network.get(`/posts/${this.$route.params.id}`)
            .then(res => this.post = res.data);
    },
    computed: {
        timePosted() {
            if(!this.post)
                return '';
            return utils.dateDiffFromNow(this.post.posted);
        },
        image() {
            if(!this.post)
                return '';
            return process.env.VUE_APP_API_URL + `/images/${this.post.image.id}`;
        }
    },
    watch: {
        '$route.params.id': function(id){
            network.get(`/posts/${id}`)
            .then(res => this.post = res.data);
        }
    }
}
</script>

<style lang="scss" scoped>
.scroll-container {
	flex: 1;
	overflow: auto;

	.content {
		width: 100%;
		min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
	}
}

.card {
	min-width: 15rem;
	max-width: 25rem;
	margin: 2rem 1rem;

	& > * {
		padding: 0;
	}
}
</style>
