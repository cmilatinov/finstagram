<template>
    <b-card
		body-bg-variant="border-white"
		class="card">

		<b-card-body>
			<b-card-text>
				Posted by 
				<a :href="`#/profile/${post.user.id}`"><strong><i>{{post.user.username}}</i></strong></a>
				<span style="float: right">{{timePosted}}</span>
			</b-card-text>
		</b-card-body>

		<div class="card-image">
			<b-card-img ref="image" v-viewer="{ navbar: false }" :src="post.image.id ? `${IMG_URL}/${post.image.id}` : image"/>
			<div class="image-overlay" @click="_ => navigate(`/post-view/${post.id}`)">
				<div class="overlay-row" :key="i" v-for="i in (0, reactionRows)">
					<div class="icon" :class="{ active: post.reacted === reaction.id }" 
						:key="`${post.id}-${reaction.id}`" 
						v-for="reaction in getReactionRow(i - 1)"
						@click.stop="_ => onReactToPost(reaction.id === post.reacted ? null : reaction.id)">
						<icon :icon="reaction.icon"/>
						<div class="hint">{{post.reactions[reaction.id] || 0}}</div>
					</div>
				</div>
				<div class="fullscreen" @click.stop="onClickFullscreen">
					<icon icon="expand"/>
				</div>
			</div>
		</div>

		<b-card-body v-if="post.image.caption !== ''">
			<b-card-text>
				<i>{{post.image.caption}}</i>
			</b-card-text>
		</b-card-body>

    </b-card>
</template>

<script>
import network from '@/helpers/network';
import utils from '@/helpers/utils';

export default {
	props: {
		post: {
			type: Object,
			default: _ => ({ 
				user: { id: 0, username: 'anonymous' }, 
				image: { caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec.' },
				posted: new Date(new Date().getTime() - Math.floor(Math.random() * 4.234e+9))
			})
		}
	},
	data() {
		return {
			image: `https://picsum.photos/${Math.floor(Math.random() * 300 + 200)}/${Math.floor(Math.random() * 300 + 200)}`,
			IMG_URL: process.env.VUE_APP_IMG_URL,
			reactionRows: 2
		};
	}, 
	computed: {
		timePosted() {
            if(!this.post)
                return '';
            return utils.dateDiffFromNow(this.post.posted);
        },
	},
	methods: {
		getReactionRow(index) {
            let arr = [];
			for(let i = this.reactions.length * index / this.reactionRows; 
				i < this.reactions.length * (index + 1) / this.reactionRows; i++)
                arr.push(this.reactions[i]);
            return arr;
		},
		onReactToPost(reactionid) {
			if(this.post.reacted === reactionid)
				return;

			network.post('/posts/react', {
				postid: this.post.id,
				reactionid
			}, { withCredentials: true })
			.then(res => { 
				this.post.reactions = res.data.reactions;
				this.post.reacted = reactionid;
			});
		},
		onClickFullscreen() {
            if(this.$refs.image)
                this.$refs.image.$viewer.show();
        },
	}
}
</script>

<style lang='scss' scoped>
.card {
	min-width: 15rem;
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
		background: rgba(0, 0, 0, 0.7);
		opacity: 0;
		transition: 0.2s;
		border-radius: calc(0.25rem - 1px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.5em;
		font-size: 2em;
		flex-wrap: wrap;
		cursor: pointer;

		.overlay-row {
			display: flex;
			flex-direction: row;
			justify-content: space-evenly;
			align-items: center;

			.icon {
				padding: 0.6em;
				display: flex;
				flex-direction: column;
				align-items: center;
				color: white;
				opacity: 0.6;
				transition: 0.1s;

				.hint {
					margin-top: 0.3em;
					font-size: 0.8rem;
				}

				&.active {
					color: #ffc107;
					opacity: 0.7;
				}

				&:hover {
					opacity: 1;
				}

				&:active {
					transform: translate(3px, 3px);
					opacity: 0.3;
				}
			}
		}

		.fullscreen {
			position: absolute;
			top: 0;
			right: 0;
			padding: 0.2em 0.6em;
			color: white;
			opacity: 0.6;
			transition: 0.1s;
			font-size: 0.8em;
			cursor: pointer;

			&:hover {
				opacity: 1;
			}
		}

		&:hover {
			opacity: 1;
		}
	}
}
</style>