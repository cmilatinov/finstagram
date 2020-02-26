<template>
	<div class="scroll-container">
		<div class="post-container">
			<b-card class="card">
				<template v-slot:title>
					<h4 style="margin-bottom: 1em"><icon icon="image" />&nbsp;&nbsp;Create New Post</h4>
				</template>
				<b-row class="card-row">
					<b-form-group class="w-100" label="Picture" label-for="image" :state="validFile" :invalid-feedback="fileState">
						<div class="preview" :class="{ invalid: validFile !== null && !validFile }">
							<div class="hint">
								<div>Preview</div>
							</div>
							<b-img v-if="imageSrc" :src="imageSrc" />
						</div>
						<b-form-file
							id="image"
							v-model="image"
							:state="validFile"
							accept="image/*"
							placeholder="Choose a picture"
							@change="onFileChange" />
					</b-form-group>
				</b-row>
				<b-row class="card-row">
					<b-form-group class="w-100" label="Caption (Optional)" label-for="caption" :state="validCaption" :invalid-feedback="captionState">
						<b-form-textarea
							id="caption"
							v-model="caption"
							:state="validCaption"
							placeholder="Enter an inspiring description of your picture"
							rows="3"
							no-resize/>
					</b-form-group>
				</b-row>
				<b-row class="card-row">
					<b-button
						variant="outline-primary"
						@click="onPostPicture">Post Picture</b-button>
				</b-row>
			</b-card>
		</div>
	</div>
</template>

<script>
import network from "@/helpers/network.js";

export default {
	data() {
		return {
			image: [],
			imageSrc: null,
			caption: null
		};
	},
	methods: {
		imageToBase64() {
			return new Promise((resolve, reject) => {
				let reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = err => reject(err);
				reader.readAsDataURL(this.image);
			});
		},
		onFileChange(event) {
			if(event.target.files.length > 0)
				this.imageSrc = URL.createObjectURL(event.target.files[0]);
			else 
				this.imageSrc = null;
		},
		async onPostPicture(){
			if(!this.validForm)
				return this.imageSrc = false;
			try {
				let res = await network.post('/posts/new', {
					image: await this.imageToBase64(),
					caption: this.caption
				}, { withCredentials: true });

				this.$swal({
					title: 'Post Successfully Created',
					text: 'You will now be redirected to your new post.',
					icon: 'success'
				}).then(_ => this.$router.push(`/post-view/${res.data.postid}`));
			} catch(err) {
				this.$swal({
					title: 'Post Upload Failed',
					text: err.response && err.response.data.error ? err.response.data.error : 'An error occurred while attempting to upload the picture.',
					icon: 'error'
				});
			}
		}
	},
	computed: {
		validFile() {
			if(this.imageSrc === null)
				return null;
			return !!this.imageSrc;
		},
		validCaption() {
			if(this.caption === null || this.caption === '')
				return null;
			return this.caption.length <= 200;
		},
		validForm() {
			return this.validFile && (this.validCaption === null || this.validCaption);
		},

		fileState() {
			return 'Please select a file.';
		},
		captionState() {
			return `Please enter a caption with a maxium length of 200 characters (${this.caption ? this.caption.length : 0}).`
		}
	}
};
</script>

<style lang="scss" scoped>

.scroll-container {
	width: 100%;
	height: 100%;
	overflow: auto;

	.post-container {
		position: relative;
		width: 100%;
		min-height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: auto;
		
		.card {
			margin: 3em;
			width: 30rem;

			.card-row {
				margin: 0.5em 1em 0 1em;
				justify-content: center;
				align-items: center;
			}
		}
	}
}

	
.preview {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 0 0 1.5em 0;
	padding: 1em;
	border: 1px solid rgb(206, 212, 218);
	border-radius: 4px;
	min-height: 15rem;
	width: 100%;

	&.invalid {
		border: 1.5px solid #DC3545;
	}

	.hint {
		color: #6C757D;
		font-size: 1rem;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		justify-content: center;
		align-items: center;
		display: flex;
		z-index: 0;
	}

	img {
		z-index: 10;
		max-width: 100%;
	}
}
</style>
