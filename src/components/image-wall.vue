<template>
    <div class="image-row">
        <div class="image-column" :key="i" v-for="i in (0, cols)">
            <imageblock class="image" :key="post.id" v-for="post in getPostCol(i - 1, cols)" :post="post"/> 
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
        },
        cols: {
            type: Number,
            default: 3
        }
    },
    methods: {
        getPostCol(offset, multiple) {
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
    flex: 33%;
    max-width: 33%;
    padding: 0 1rem;

    .image {
        vertical-align: middle;
        width: 100%;
        margin: 3rem auto
    }
}

@media screen and (max-width: 1400px) {
    .image-column {
        flex: 50%;
        max-width: 50%;
    }
}
@media screen and (max-width: 900px) {
    .image-column {
        flex: 100%;
        max-width: 100%;
    }
}
</style>