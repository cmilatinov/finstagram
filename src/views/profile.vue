<template>
	<div class="scroll-container" v-if="profileduser && !loading">
		<b-jumbotron
		bg-variant="transparent">
			<template v-slot:header>
				<div class="d-flex flex-row justify-content-center align-items-end header">
					<template v-if="isEditing">
						<b-input
							ref="firstname" 
							v-model="editedFirstname" 
							type="text" 
							placeholder="First name"/>
						<b-input
							ref="lastname" 
							v-model="editedLastname" 
							type="text" 
							placeholder="Last name"/>
					</template>
					<h1 class="display-5" v-else>{{profileduser.firstname}} {{profileduser.lastname}}</h1>
					
					<icon 
						class="header-icon red"
						icon="times"
						v-if="profileduser.id === user.id && isEditing && !editLoading" 
						@click="_ => isEditing = false"/>
					<icon 
						class="header-icon green"
						icon="check"
						v-if="profileduser.id === user.id && isEditing && !editLoading" 
						@click="onSumbitProfileEdit"/>
					<icon 
						class="header-icon blue"
						icon="pencil-alt"
						v-if="profileduser.id === user.id && !isEditing" 
						@click="_ => isEditing = true"/>

				</div>
			</template>
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
			loading: false,
			isEditing: false,
			editLoading: false,
			editedFirstname: '',
			editedLastname: ''
		};
	},
	activated() {
		this.refreshUser();
	},
	methods: {
		refresh(){
			this.refreshUser();
		},
		refreshUser(showLoading = true) {
			if (showLoading) 
				this.loading = true;

			network.get(`/users/${this.$route.params.userid}`, { withCredentials: true })
				.then(res => { 
					this.profileduser = res.data;
					this.editedFirstname = this.profileduser.firstname;
					this.editedLastname = this.profileduser.lastname;
					network.get(`/users/${this.$route.params.userid}/posts`, { withCredentials: true })
					.then(res => { 
						this.posts = res.data.posts;
						if (showLoading) this.loading = false;
					})
					.catch(_ => { 
						if (showLoading) this.loading = false;
					});
				})
				.catch(_ => this.loading = false);
		},
		onFollowClick() {
			if (this.loadingFollow) 
				return;

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
			if (this.loadingFollow) 
				return;

			this.loadingFollow = true;
			network.post('/users/unfollow', { userid: this.user.id, followerid: this.profileduser.id }, { withCredentials: true })
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
		},
		onSumbitProfileEdit() {
			this.editLoading = true;
			network.post('/users/edit', { firstname: this.editedFirstname, lastname: this.editedLastname }, { withCredentials: true })
			.then(res => {
				this.$swal({
					title: 'Profile Name Changed',
					text: 'You have successfully updated your profile name.',
					icon: 'success'
				});
				this.editLoading = false;
				this.profileduser = res.data.user;
				this.isEditing = false;
			})
			.catch(err => { 
				this.$swal({
					title: 'Profile Change Failed',
					text: err.response && err.response.data ? err.response.data.error : 'There was an unexpected error when attempting to change your profile name.',
					icon: 'error'
				});
				this.editLoading = false;
				this.isEditing = false;
				this.editedFirstname = this.profileduser.firstname;
				this.editedLastname = this.profileduser.lastname;
			});
		}
	},
	watch: {
        '$route.params.userid': function (id) {
			if (!id)
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

.header {

	.header-icon {
		opacity: 0.3;
		margin: 0 0 1rem 0.6rem;
		font-size: 1.2em;
		transition: 0.2s;
		color: black;
		cursor: pointer;

		&.green:hover {
			opacity: 0.7;
			color: #28a745;
		}

		&.blue:hover {
			opacity: 0.7;
			color: #007bff;
		}

		&.red:hover {
			opacity: 0.7;
			color: #dc3545;
		}

	}

	& > input {
		max-width: 150px;
		margin: 0.3em;
	}
}

</style>
