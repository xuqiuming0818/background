<template>
    <div>
        <!-- :inline行内表单 -->
        <el-form :inline="true"  class="demo-form-inline" :model="cForm" >
        <el-form-item label="一级分类">
            <el-select  placeholder="一级分类" v-model="cForm.category1id" @change="handler1" :disabled='show'>
            <el-option :label="c1.name" :value="c1.id" v-for="c1 in List1" :key="c1.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
            <el-select  placeholder="二级分类" v-model="cForm.category2id" @change="handler2" :disabled='show'>  
            <el-option :label="c2.name" :value="c2.id" v-for="c2 in List2" :key="c2.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
            <el-select  placeholder="三级分类" v-model="cForm.category3id" @change="handler3" :disabled='show'>
            <el-option :label="c3.name" :value="c3.id" v-for="c3 in List3" :key="c3.id"></el-option>
            </el-select>
        </el-form-item>
        </el-form>

    </div>
</template>

<script>
export default {
    name:'CategorySelect',
    props:['show'],
    data() {
        return {
            List1:[],
            List2:[],
            List3:[],
            // 收集123级分类id
            cForm:{
                category1id:'',
                category2id:'',
                category3id:'',
            }
        }
        },
        //方法
        methods: {
            // 获取一级分类
            async getcategory1(){
                let result = await this.$API.attr.reqCategory1()
                if (result.code == 200) {
                    this.List1 = result.data
                }
            },
            // 一级分类有数据时
            async handler1(){
                this.List2=[]
                this.List3=[]
                this.cForm.category2id=''
                this.cForm.category3id=''
                const{category1id} = this.cForm
                this.$emit('getCategoryId', {categoryId:category1id,level:1});
                let result = await this.$API.attr.reqCategory2(category1id)
                if (result.code == 200) {
                    this.List2 = result.data
                }
            },
            // 二级分类有数据时
            async handler2(){
                this.List3=[]
                this.cForm.category3id=''
                const{category2id} = this.cForm
                this.$emit('getCategoryId', {categoryId:category2id,level:2});
                let result = await this.$API.attr.reqCategory3(category2id)
                if (result.code == 200) {
                    console.log(result);
                    this.List3 = result.data
                }
            },
            //三级分类有数据时
            handler3(){
                const{category3id} = this.cForm
                this.$emit('getCategoryId', {categoryId:category3id,level:3});
            }
        },
        //挂载完成
        mounted() {
            this.getcategory1()
        },

        
}
</script>

<style>

</style>