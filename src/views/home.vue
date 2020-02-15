<template>
	<div class="scroll-container">
		<div class="content">
			<imagewall :posts="posts"/>
		</div>
	</div>
</template>

<script>
import imagewall from "@/components/image-wall.vue";

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
		for(let i = 0; i < 50; i++)
			this.posts.push({ id: i, caption: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec.` });
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