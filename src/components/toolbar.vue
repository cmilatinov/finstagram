<template>
	<div class="navbar">
		<div class="left">
			<h4 class="title">Finstagram</h4>
		</div>
		<div class="center">
			<div class="nav-item" :class="{ active: $route.path === '/' }" @click="$router.push({ path: '/' })">
				<icon class="nav-item-icon" icon="home" />
				<div class="nav-item-text">Home</div>
			</div>
			<div class="nav-item" :class="{ active: $route.path === '/post' }" @click="$router.push({ path: '/post' })">
				<icon class="nav-item-icon" icon="edit" />
				<div class="nav-item-text">Post</div>
			</div>
			<div class="nav-item" :class="{ active: $route.path === '/profile' }" @click="$router.push({ path: '/profile' })">
				<icon class="nav-item-icon" icon="user-alt" />
				<div class="nav-item-text">Profile</div>
			</div>
		</div>
		<div class="right">
			<b-input-group>
				<b-input ref="search" id="search" v-model="search" type="text" placeholder="Search here" @focus="showResults = true" @blur="showResults = false"></b-input>
				<b-input-group-append>
					<b-button variant="outline-primary" @click="onSubmitSearch">
						<icon icon="search" />
					</b-button>
				</b-input-group-append>
				<div class="dropdown" :class="{ shown: showResults }">
					<div :key="result.id" v-for="result in results">
						{{result.firstname}} {{result.lastname}} ({{result.username}})
					</div>
				</div>
			</b-input-group>
		</div>
	</div>
</template>

<script>
import network from '../helpers/network';

export default {
	data() {
		return {
			search: '',
			results: [],
			showResults: false
		};
	},
	methods: {
		onSubmitSearch() {
			network.post('/search', {
				search: this.search
			}, { withCredentials: true }).then(res => {
				this.results = res.data.users;
				this.$refs.search.focus();
			});
		}
	}
}
</script>

<style lang="scss" scoped>

.dropdown {
	position: absolute;
	top: 100%;
	width: 100%;
	border: 1px solid rgba(0, 0, 0, 0.15);
	padding: 1em;
	background-color: white;
	border-radius: 3px;
	margin-top: 0.3em;
	z-index: 100;
	opacity: 0;
	transition: 0.2s;

	&.shown {
		opacity: 1;
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
	
	.right > *{
		margin: 1em 0 1em 0;
	}

	.title {
		margin: 0 !important;
	}
}

.center {
	display: flex;
	height: 100%;
	flex-direction: row;
	align-items: flex-end;
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

	&:hover{
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
		content: '';
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #ffc107;
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
