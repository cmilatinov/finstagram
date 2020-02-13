<template>
    <div class="background-container">
        <div class="login-container">
            <div class="form-container">
                <div class="form">
                    <div class="title">Login</div>
                    <div class="hint">Don't have an account yet? <a href="/#/register">Create an account.</a></div>
                    <div class="content">
                        <b-form-group :state="validUsername" :invalid-feedback="usernameState" label-for="username" label="Username">
                            <b-input-group>
                                <b-input-group-prepend is-text>
                                    <icon icon="user-alt" :style="{ color: '#777' }"/>
                                </b-input-group-prepend>
                                <b-input id="username" :state="validUsername" v-model="username" type="text" placeholder="Enter your username or email"/>
                            </b-input-group>
                        </b-form-group>
                        <b-form-group :state="validPassword" :invalid-feedback="passwordState" label-for="password" label="Password">
                            <b-input-group>
                                <b-input-group-prepend is-text>
                                    <icon icon="key" :style="{ color: '#777' }"/>
                                </b-input-group-prepend>
                                <b-input id="password" :state="validPassword" v-model="password" type="password" placeholder="Enter your password"/>
                            </b-input-group>
                        </b-form-group>
                    </div>
                    <b-button :disabled="!validForm" class="button" variant="outline-primary" @click="onSubmitLogin">Continue</b-button>
                </div>
            </div>
            <div class="image-container"/>
        </div>
    </div>
</template>

<script>
import network from '../helpers/network';

export default {
    data() {
        return {
            username: null,
            password: null
        };
    },

    methods: {
        onSubmitLogin() {
            if(!this.validForm)
                return;

            network.post('/users/login', {
                username: this.username,
                password: this.password
            }, { withCredentials: true }).then(res => {
                this.$store.commit('authSuccess', res.data);
                this.$router.push({ path: '/' });
            }).catch(err => this.$swal({
                title: 'Login Failed',
                text: (err.response ? err.response.data.error : err.message) || 'Could not connect to server.',
                icon: 'error'
            }));
        }
    },

    computed: {
        validUsername() {
            if(this.username === null)
                return null;
            return this.username.length > 0;
        },
        validPassword() {
            if(this.password === null)
                return null;
            return this.password.length > 0 && this.password.length <= 50;
        },
        validForm() {
            return this.validUsername && this.validPassword;
        },

        usernameState() {
            return 'Please enter a valid username or email.';
        },
        passwordState() {
            return 'Please enter a valid password.';
        }
    }
}
</script>

<style lang="scss" scoped>

.background-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(45deg, #7474BF, #348AC7);

    .login-container {
        width: 80%;
        height: 75%;
        overflow: hidden;
        background-color: #f8f8f8;
        border-radius: 5px;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        box-shadow: 0px 0px 129px 35px rgba(0,0,0,0.35);
        animation-name: fadeIn;
        animation-duration: 0.5s;

        .form-container {
            width: 30%;
            overflow: auto;

            .form {
                width: 100%;
                min-height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 2em;

                .title {
                    font-weight: 600;
                    font-size: 20pt;
                    margin: 1em 1em 0 1em;
                }

                .hint {
                    font-size: 10pt;
                    color: #555;
                    margin: 1em 1em 3em 1em;
                }

                .button {
                    margin: 3em 1em 1em 1em;
                }

                .content {
                    width: 100%;

                    & > * {
                        margin: 1em;
                    }
                }
            }
        }
        

        .image-container {
            flex: 1;
            background: url('../assets/img/login.jpg');
            background-size: cover;
            background-position: center center;
            box-shadow: inset 0 0 300px;
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(100px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

</style>