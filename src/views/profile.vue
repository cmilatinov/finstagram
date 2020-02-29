<template>
	<div class="scroll-container" v-if="profileduser && !loading">
		<b-jumbotron
		bg-variant="transparent"
		header-level="5"
		:header="`${profileduser.firstname} ${profileduser.lastname}`">
			<template v-slot:lead>
				<p style="font-size: 1.2em"><i>@{{profileduser.username}}</i></p>
				<p>
					{{profileduser.nbPosts}} POST{{profileduser.nbPosts === 1 ? '' : 'S'}} &nbsp;
					{{profileduser.nbFollowers}} FOLLOWER{{profileduser.nbFollowers === 1 ? '' : 'S'}} &nbsp;
					{{profileduser.nbFollowings}} FOLLOWING
				</p>
			</template>
			<template v-if="user && profileduser.id !== user.id">
				<b-button
					v-if="!profileduser.followed"
					variant="outline-primary"
					@click="onFollowClick">Follow</b-button>
				<b-button v-else variant="outline-danger" @click="onUnfollowClick">
					Unfollow
				</b-button>
			</template>
		</b-jumbotron>
		<div class="content">
			<template v-if="posts.length > 0">
				<imageblock :key="post.id" :post="post" v-for="post in posts"/>
			</template>
			<p class="d-flex justify-content-center align-items-center" v-else>
				<i style="font-size: 1.3em; opacity: 0.6">This user has no posts.</i>
			</p>
		</div>
	</div>
	<div class="scroll-container" v-else-if="loading">
		<div class="content h-100">
			<b-spinner variant="secondary" />
		</div>
	</div>
	<div class="scroll-container" v-else>
		<div class="content h-100">
			<p><i style="font-size: 1.3em; opacity: 0.6">This user does not exist.</i></p>
		</div>
	</div>
</template>

<script>
import imageblock from "@/components/image-block.vue";
import network from "@/helpers/network";

export default {
	components: {
		imageblock
	},
	data() {
		return {
			profileduser: null,
			posts: [],
			loadingFollow: false,
			loading: false
		};
	},
	activated() {
		this.refreshUser();
	},
	methods: {
		refreshUser(showLoading = true) {
			if(showLoading) this.loading = true;
			network.get(`/users/${this.$route.params.userid}`, { withCredentials: true })
				.then(res => { 
					this.profileduser = res.data;
					network.get(`/users/${this.$route.params.userid}/posts`, { withCredentials: true })
						.then(res => { 
							this.posts = res.data.posts;
							if(showLoading) this.loading = false;
						})
						.catch(_ => { 
							if(showLoading) this.loading = false;
						});
				})
				.catch(_ => this.loading = false);
		},
		onFollowClick() {
			if(this.loadingFollow) return;

			this.loadingFollow = true;
			network.post('/users/follow', {
					userid: this.user.id,
					followerid: this.profileduser.id
				}, { withCredentials: true })
				.then(_ => { 
					this.refreshUser(false);
					this.loadingFollow = false;
				})
				.catch(err => { 
					this.$swal({
						title: 'Follow Failed',
						text: err.response && err.response.data ? err.response.data.error : 'Could not follow user.',
						icon: 'error'
					});
					this.loadingFollow = false;
				});
		},
		onUnfollowClick() {
			if(this.loadingFollow) return;

			this.loadingFollow = true;
			network.post('/users/unfollow', {
					userid: this.user.id,
					followerid: this.profileduser.id
				},{ withCredentials: true })
				.then(_ => { 
					this.refreshUser(false);
					this.loadingFollow = false;
				})
				.catch(err => { 
					this.$swal({
						title: 'Unfollow Failed',
						text: err.response && err.response.data ? err.response.data.error : 'Could not unfollow user.',
						icon: 'error'
					});
					this.loadingFollow = false;
				});
		}
	},
	watch: {
        '$route.params.userid': function (id) {
			if(!id)
				return;
			this.refreshUser();
		},
    }
};
</script>

<style lang="scss" scoped>

.scroll-container {
	flex: 1;
	overflow: auto;
	
	.content {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
        justify-content: center;
        align-items: center;
	}
}

.jumbotron {
	margin: auto;
	text-align: center;
}

</style>
