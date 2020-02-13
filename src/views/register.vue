<template>
    <div class="background-container">
        <div class="login-container">
            <div class="form-container">
                <div class="form">
                    <div class="title">Create an Account</div>
                    <div class="hint">Already have an account? <a href="/#/login">Login to your account.</a></div>
                    
                    <div class="content-container">
                        <div class="content">
                            <b-form-group :state="validFirstname" :invalid-feedback="firstnameState" label-for="firstname" label="First Name">
                                <b-input-group>
                                    <b-input-group-prepend is-text>
                                        <icon icon="signature" :style="{ color: '#777' }"/>
                                    </b-input-group-prepend>
                                    <b-input id="firstname" :state="validFirstname" v-model="firstname" type="text" placeholder="Enter your first name"/>
                                </b-input-group>
                            </b-form-group>

                            <b-form-group :state="validLastname" :invalid-feedback="lastnameState" label-for="lastname" label="Last Name">
                                <b-input-group>
                                    <b-input-group-prepend is-text>
                                        <icon icon="signature" :style="{ color: '#777' }"/>
                                    </b-input-group-prepend>
                                    <b-input id="lastname" :state="validLastname" v-model="lastname" type="text" placeholder="Enter your last name"/>
                                </b-input-group>
                            </b-form-group>

                            <b-form-group :state="validEmail" :invalid-feedback="emailState" label-for="email" label="Email Address">
                                <b-input-group>
                                    <b-input-group-prepend is-text>
                                        <icon icon="envelope" :style="{ color: '#777' }"/>
                                    </b-input-group-prepend>
                                    <b-input id="email" :state="validEmail" v-model="email" type="text" placeholder="Enter your email address"/>
                                </b-input-group>
                            </b-form-group>
                            
                            <b-form-group :state="validUsername" :invalid-feedback="usernameState" label-for="username" label="Username">
                                <b-input-group>
                                    <b-input-group-prepend is-text>
                                        <icon icon="user-alt" :style="{ color: '#777' }"/>
                                    </b-input-group-prepend>
                                    <b-input id="username" :state="validUsername" v-model="username" type="text" placeholder="Enter your desired display name"/>
                                </b-input-group>
                            </b-form-group>

                            <b-form-group :state="validPassword" :invalid-feedback="passwordState" label-for="password" label="Password">
                                <b-input-group>
                                    <b-input-group-prepend is-text>
                                        <icon icon="key" :style="{ color: '#777' }"/>
                                    </b-input-group-prepend>
                                    <b-input id="password" :state="validPassword" v-model="password" type="password" placeholder="Enter your desired password"/>
                                </b-input-group>
                            </b-form-group>

                            <b-form-group :state="validPassword2" :invalid-feedback="password2State" label-for="password2" label="Confirm Password">
                                <b-input-group>
                                    <b-input-group-prepend is-text>
                                        <icon icon="key" :style="{ color: '#777' }"/>
                                    </b-input-group-prepend>
                                    <b-input id="password2" :state="validPassword2" v-model="password2" type="password" placeholder="Same password as above"/>
                                </b-input-group>
                            </b-form-group>
                        </div>
                    </div>

                    <b-button :disabled="!validForm" class="button" variant="outline-primary" @click="onSubmitRegister">Continue</b-button>
                </div>
            </div>
            <div class="image-container"/>
        </div>
    </div>
</template>

<script>
import utils from '../helpers/utils';
import network from '../helpers/network';

export default {
    data() {
        return {
            firstname: null,
            lastname: null,
            email: null,
            username: null,
            password: null,
            password2: null,
        };
    },

    methods: {
        async onSubmitRegister() {
            if(!this.validForm)
                return;

            network.post('/users/register', {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                username: this.username,
                password: this.password
            }).then(_ => this.$swal({
                title: 'Registration Complete',
                text: 'You will now be redirected to the login page.',
                icon: 'success'
            }).then(_ => this.$router.push({ name: 'login' })))
            .catch(err => this.$swal({
                title: 'Failed to Complete Registration',
                text: err.response.data.error || 'Could not connect to server.',
                icon: 'error'
            }));

           
        }
    },

    computed: {
        validFirstname() {
            if(this.firstname === null)
                return null;
            let regex = /^[A-Za-z]+$/;
            return regex.test(this.firstname) && this.firstname.length <= 30;
        },
        validLastname() {
            if(this.lastname === null)
                return null;
            let regex = /^[A-Za-z]+$/;
            return regex.test(this.lastname) && this.lastname.length <= 30;
        },
        validEmail() {
            if(this.email === null)
                return null;
            return utils.validateEmail(this.email);
        },
        validUsername() {
            if(this.username === null)
                return null;
            let regex = /^[A-Za-z0-9_-]+$/;
            return regex.test(this.username) && this.username.length <= 30;
        },
        validPassword() {
            if(this.password === null)
                return null;
            return this.password.length >= 8 && this.password.length <= 50;
        },
        validPassword2() {
            if(this.password2 === null)
                return null;
            return this.password === this.password2;
        },
        validForm() {
            return this.validFirstname && this.validLastname && this.validEmail && this.validUsername && this.validPassword && this.validPassword2;
        },

        firstnameState() {
            return this.firstname === null || this.firstname.length === 0 ? 'Please enter your first name.' : 'A first name must only be composed of letters.';
        },
        lastnameState() {
            return this.lastname === null || this.lastname.length === 0 ? 'Please enter your last name.' : 'A last name must only be composed of letters.';
        },
        emailState() {
            return this.email === null || this.email.length === 0 ? 'Please enter your email.' : 'Please enter a valid email address.';
        },
        usernameState() {
            return this.username === null || this.username.length === 0 ? 'Please enter your desired display name.' : 'A display name must only be composed of letters, numbers, underscores (_), or dashes (-).';
        },
        passwordState() {
            return 'Please enter a password with a minimum length of 8 characters.';
        },
        password2State() {
            return 'Passwords do not match.'
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
        align-items: safe stretch;
        box-shadow: 0px 0px 129px 35px rgba(0,0,0,0.35);
        animation-name: fadeIn;
        animation-duration: 0.5s;

        .form-container {
            width: 30%;
            height: 100%;
            overflow: auto;
            zoom: 90%;

            .form {
                min-height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 1em 2em;
                overflow: auto;

                .title {
                    font-weight: 600;
                    font-size: 20pt;
                    margin: 0.5em 0.5em 0 0.5em;
                }

                .hint {
                    font-size: 10pt;
                    color: #555;
                    margin: 0.7em 1em 1.4em 1em;
                }

                .content-container {
                    display: flex;
                    flex-grow: 1;
                    flex-direction: column;
                    justify-content: center;
                    align-items: stretch;
                    width: 100%;

                    .content > * {
                        margin: 1em 0;
                        width: 100%;

                        &:first-child {
                            margin: 0 0 1em 0;
                        }
                    }
                }

                .button {
                    margin: 1em;
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