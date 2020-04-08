<template>
	<div class="navbar">
		<div class="left">
			<h4 class="title">Finstagram</h4>
		</div>
		<div class="center">
			<div class="nav-item" :class="{ active: $route.path === '/' }" 
				@click="_ => onClickNav('/')">
				<icon class="nav-item-icon" icon="home" />
				<div class="nav-item-text">Home</div>
			</div>
			<div class="nav-item" :class="{ active: $route.path === '/post' }" 
				@click="_ => onClickNav('/post')">
				<icon class="nav-item-icon" icon="edit" />
				<div class="nav-item-text">Post</div>
			</div>
			<div class="nav-item" :class="{ active: user && $route.path === `/profile/${user.id}` }" 
				@click="_ => onClickNav(`/profile/${user.id}`)">
				<icon class="nav-item-icon" icon="user-alt" />
				<div class="nav-item-text">Profile</div>
			</div>
		</div>
		<div class="right">
			<b-input-group>
				<b-input
					id="search"
					ref="search" 
					v-model="search" 
					type="text" 
					placeholder="Search here" 
					@focus="_ => showResults = true" 
					@blur="_ => showResults = false"
					@keyup.13="onSubmitSearch"/>
				<div class="dropdown" :class="{ shown: showResults }">
					<b-spinner style="margin: 1em" variant="secondary" small v-if="searchLoading"/>
					<div class="p-3 text-center" v-else-if="!searchLoading && results.length === 0"><i>No users found</i></div>
					<template v-else>
						<div class="hint">
							Displaying {{results.length}} results for "{{lastSearch}}"
						</div>
						<div class="dropdown-item" :key="result.id" v-for="result in results"
							@mousedown="_ => { if(showResults) navigate(`/profile/${result.id}`); }">
							<div class="overflow-container">
								{{result.firstname}} {{result.lastname}} (<i>@{{result.username}}</i>)
							</div>
						</div>
					</template>
				</div>
				<b-input-group-append>
					<b-button variant="outline-primary" @click="onSubmitSearch">
						<icon icon="search" />
					</b-button>
				</b-input-group-append>
			</b-input-group>
			<b-button variant="outline-primary" @click="onLogout">Logout</b-button>
		</div>
	</div>
</template>

<script>
import network from '@/helpers/network';

export default {
	data() {
		return {
			search: '',
			lastSearch: '',
			searchLoading: false,
			results: [],
			showResults: false
		};
	},
	methods: {
		onClickNav(route){
			this.navigate(route);
			this.$emit('click');
		},
		onLogout() {
			network.get('/users/logout', { withCredentials: true })
				.then(_ => { 
					this.$store.commit('logoutSuccess');
					this.navigate('/login');
				})
				.catch();
		},
		onSubmitSearch() {
			if(this.search === '') return;

			this.searchLoading = true;
			this.lastSearch = this.search;
			this.$refs.search.focus();
			network.post('/search', {
				search: this.search
			}, { withCredentials: true }).then(res => {
				this.results = res.data.users;
				this.searchLoading = false;
			}).catch(_ => { 
				this.results = [];
				this.searchLoading = false;
			});
		}
	}
}
</script>

<style lang="scss" scoped>

.dropdown {
	position: absolute;
	top: 100%;
	right: 50%;
	transform: translateX(50%);
	min-width: 100%;
	max-width: 140%;
	display: flex;
	flex-direction: column;
	align-items: center;
	border: 1px solid rgba(0, 0, 0, 0.15);
	background-color: white;
	border-radius: 3px;
	margin-top: 0.5em;
	z-index: 100;
	opacity: 0;
	transition: 0.3s;
	max-height: 30rem;
	overflow: hidden auto;
	pointer-events: none;
	
	.hint {
		font-size: 0.9em;
		opacity: 0.7;
		padding: 0.5em;
		border-bottom: 1px solid rgba(0, 0, 0, 0.15);
		font-style: italic;
		text-align: center;
		align-self: stretch;
	}

	.dropdown-item {
		user-select: none;
		padding: 1em;
		border-bottom: 1px solid rgba(0, 0, 0, 0.15);
		align-self: stretch;

		.overflow-container {
			overflow-x: hidden;
			text-overflow: ellipsis;
		}

		&:last-of-type {
			border: none;
		}
	}

	&.shown {
		pointer-events: all;
		opacity: 1;

		.dropdown-item {
			cursor: pointer;
		}
	}
}

.navbar {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	padding: 0 2em;
	border-bottom: 1px solid rgba(0, 0, 0, 0.125);
	background-color: white;

	.left {
		height: 71px;
		width: 342.24px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.right {
		display: flex;
		flex-direction: row;
		align-items: center;

		& > * {
			margin: 1em 0 1em 0.6em;
		}
	}

	.center {
		display: flex;
		height: 71px;
		flex-direction: row;
		align-items: flex-end;
	}

	.title {
		margin: 0 !important;
	}
}



.nav-item {
	position: relative;
	font-weight: 600;
	font-size: 1.15em;
	margin: 0 0.5em;
	display: flex;
	flex-direction: row;
	align-items: center;
	color: black;
	opacity: 0.4;
	cursor: pointer;

	.nav-item-icon {
		margin-left: 15px;
		transition: 0.2s;
	}

	.nav-item-text {
		padding: 15px;
		transition: 0.2s;
	}

	&:hover {
		opacity: 0.6;

		.nav-item-icon {
			transform: translateX(3px);
		}

		.nav-item-text {
			transform: translateX(-3px);
		}
	}

	&:after {
		position: absolute;
		width: 0;
		height: 3px;
		display: block;
		content: "";
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #ff9000;
		transition: 0.2s;
	}

	&.active {
		opacity: 0.9;

		.nav-item-icon {
			transform: translateX(3px);
		}

		.nav-item-text {
			transform: translateX(-3px);
		}
	}

	&.active:after {
		width: 100%;
	}
}
</style>
