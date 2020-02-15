<template>
    <b-card
		body-bg-variant="border-white"
		class="card">

		<b-card-body>
			<b-card-text>
				Posted by <strong><i>{{poster.username}}</i></strong>
				<span style="float: right">{{Math.floor(Math.random() * 7 + 3)}}{{Math.random() > 0.5 ? 'd' : 'h'}}</span>
			</b-card-text>
		</b-card-body>

		<div class="card-image">
			<b-card-img :src="image"/>
			<div class="image-overlay"></div>
		</div>

		<b-card-body>
			<b-card-text>
				<i>{{caption}}</i>
			</b-card-text>
		</b-card-body>

    </b-card>
</template>

<script>
export default {
	props: {
		caption: {
			type: String,
			default: ''
		},
		image: {
			type: String,
			default:() => `https://picsum.photos/${Math.floor(Math.random() * 300 + 200)}/${Math.floor(Math.random() * 300 + 200)}`
		},
		poster: {
			type: Object,
			default: () => ({ username: 'anonymous' })
		}
	},
	data() {
		return {};
	}
}
</script>

<style lang='scss' scoped>
.card {
	min-width: 5rem;
	max-width: 25rem;
	margin: 2rem 1rem;

	& > * {
		padding: 0;
	}
}

.card-image {
	position: relative;

	.image-overlay {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: 0.2s;
		border-radius: calc(0.25rem - 1px);

		&:hover {
			opacity: 1;
		}
	}
}
</style>