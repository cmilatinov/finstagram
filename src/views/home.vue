<template>
	<div class="scroll-container">
		<div class="content">
			<imagewall :posts="posts"/>
		</div>
	</div>
</template>

<script>
import imagewall from '@/components/image-wall';
import network from '@/helpers/network';

export default {
	components: {
		imagewall
	},
	data() {
		return {
			posts: []
		};
	},
	mounted() {
		network.get('/posts/newest', { withCredentials: true })
			.then(res => this.posts = res.data.posts);
	}
};
</script>

<style lang="scss" scoped>
.scroll-container {
	flex: 1;
	overflow: auto;

	.content {
		width: 100%;
		min-height: 100%;
	}
}
</style>