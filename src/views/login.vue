<template>
    <div class="background-container">
        <div class="login-container">
            <div class="form">
                <div class="title">Login</div>
                <div class="hint">Don't have an account yet? <a href="/">Create an account.</a></div>
                <b-input-group>
                    <b-input-group-prepend is-text>
                        <icon icon="user-alt" :style="{ color: '#777' }"/>
                    </b-input-group-prepend>
                    <b-input v-model="username" type="text" placeholder="Username"/>
                </b-input-group>
                <b-input-group>
                    <b-input-group-prepend is-text>
                        <icon icon="key" :style="{ color: '#777' }"/>
                    </b-input-group-prepend>
                    <b-input v-model="password" type="text" placeholder="Password"/>
                </b-input-group>
                <b-button :style="{ marginTop: '3em' }" variant="outline-primary">Continue</b-button>
            </div>
            <div class="image-container"/>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: ''
        };
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
            height: 70%;
            overflow: hidden;
            background-color: #f8f8f8;
            border-radius: 5px;
            display: flex;
            flex-direction: row;
            align-items: stretch;
            box-shadow: 0px 0px 129px 35px rgba(0,0,0,0.35);
            animation-name: fadeIn;
            animation-duration: 0.3s;

            

            .form {
                width: 30%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 3em;

                .title {
                    font-weight: 600;
                    font-size: 20pt;
                    margin-bottom: 0;
                }

                .hint {
                    font-size: 10pt;
                    color: #555;
                    margin-bottom: 3em;
                }

                & > * {
                    margin: 1em;
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