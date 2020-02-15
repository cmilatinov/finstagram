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
				<b-input id="search" type="text" placeholder="Search here"></b-input>
				<b-input-group-append>
					<b-button variant="outline-primary">
						<icon icon="search" />
					</b-button>
				</b-input-group-append>
			</b-input-group>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	}
}
</script>

<style lang="scss" scoped>
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
