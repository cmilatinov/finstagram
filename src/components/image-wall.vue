<template>
    <div class="image-row">
        <div class="image-column" :key="i" v-for="i in (0, 4)">
            <imageblock class="image" 
                :caption="item.caption" 
                :key="item.id" v-for="item in get(i - 1, 4)" /> 
        </div>
    </div>
</template>

<script>
import imageblock from '@/components/image-block';

export default {
    components: {
        imageblock
    },
    props: {
        posts: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        get(offset, multiple) {
            let arr = [];
            for(let i = offset; i < this.posts.length; i += multiple)
                arr.push(this.posts[i]);
            return arr;
        }
    }
}
</script>

<style lang="scss" scoped>
.image-row {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}
.image-column {
    flex: 25%;
    max-width: 25%;
    padding: 0 1rem;

    .image {
        vertical-align: middle;
        width: 100%;
        margin: 3rem auto
    }
}

@media screen and (max-width: 1000px) {
    .image-column {
        flex: 33%;
        max-width: 33%;
    }
}
@media screen and (max-width: 800px) {
    .image-column {
        flex: 50%;
        max-width: 50%;
    }
}
@media screen and (max-width: 600px) {
    .image-column {
        flex: 100%;
        max-width: 100%;
    }
}
</style>