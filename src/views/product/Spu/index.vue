<template>
    <div>
        <!-- 三级联动部分  下拉框 -->
        <el-card style="margin:15px 0">
            <CategorySelect @getCategoryId='getCategoryId' :show='show!=1'></CategorySelect>
        </el-card>
        <el-card>
            <!-- 下面部分 -->
            <div v-show="show==1">
                <!-- 展示Spu列表的结构 -->
                <el-button :disabled='!category3Id' type="primary" icon="el-icon-plus" style="margin:20px" @click="addSpu">添加Spu</el-button>
                <el-table
                    :data="records"
                    border
                    style="width: 95%">
                    <el-table-column prop="prop" label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
                    <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></HintButton>
                            <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></HintButton>
                            <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></HintButton>
                            <el-popconfirm title="这是一段内容确定删除吗?" @onConfirm='deleteSpu(row)'>
                                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></HintButton>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                    <!-- 分页器 -->
                <el-pagination
                    style="text-align:center"
                    :current-page="page"
                    :page-sizes="[3, 5, 10]"
                    :page-size="limit"
                    layout=" prev, pager, next, jumper,->    ,sizes, total"
                    :total="total"
                    @current-change="getSpuList"
                    @size-change="handleSizeChange"
                    >
                </el-pagination>
            </div>
            <SpuForm v-show="show==2" @changeShow='changeShow' ref="spu"></SpuForm>
            <SkuForm v-show="show==3" ref="addsku" @changeshow="changeshow"></SkuForm>
        </el-card>
        <el-dialog :title="`${skuspu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
            <el-table :data="SKUList" border v-loading="loading">
                <el-table-column property="skuName" label="名称" width="150"></el-table-column>
                <el-table-column property="price" label="价格" width="200"></el-table-column>
                <el-table-column property="weight" label="重量" width="200"></el-table-column>
                <el-table-column label="默认图片">
                    <template slot-scope="{row,$index}">
                        <img :src="row.skuDefaultImg" style="width:100px;heiht:100px">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
    name:'Spu',
    components:{SkuForm,SpuForm},
    data() {
        return {
            loading:true,
            dialogTableVisible: false,
            skuspu:{},
            SKUList:[],//存储sku列表的数据


            category1Id:'',
            category2Id:'',
            category3Id:'',
            //控制三级联动的可操作性
            show:1,
            page:1, //当前第几页
            limit:3,    //每一页多少条数据
            records:[],  //存储spu数组
            total:0, //分页器一共几条数据
        };
    },
    // 方法
    methods: {
        //修改spu按钮
        updateSpu(row){
            this.show = 2
            // 获取子组件SpuForm的方法
            //在父组件当中可以通过ref获取子组件等等
            this.$refs.spu.initSpuData(row)
        },
        // 添加spu按钮
        addSpu(){
            // 点击添加按钮也是要发请求的
            this.show = 2
            //通知子组件发请求
            this.$refs.spu.addSpuData(this.category3Id)
        },
        //改变一页的数量
        handleSizeChange(limit){
            this.limit = limit
            this.getSpuList()
        },
        //三级联动自定义事件
        getCategoryId({categoryId,level}) {
            //level区分几级id
            if (level == 1) {
                // 清楚其他id
                this.category1Id = categoryId
                this.category2Id=''
                this.category3Id=''
            }else if (level == 2) {
                this.category3Id=''
                this.category2Id = categoryId
            }else{
                this.category3Id = categoryId
                this.getSpuList()
            }
        },
        //获取spu数据
        async getSpuList(pages = 1){
            this.page = pages
            const {page,limit,category3Id} = this
            //携带三个参数  page 第几页 limit 每一页展示多少条  category3Id 三级分类id
            let result = await this.$API.spu.reqSpuList(page,limit,category3Id);
            if (result.code == 200) {
                // console.log(result.data);
                this.total = result.data.total
                this.records = result.data.records
            }
        },
        // 切换场景自定义事件(show)
        changeShow({show,flag}){
            this.show=show
            // 子组件保存之后  要再次获取列表数据
            this.getSpuList(this.page)
            if (flag =='修改') {
                this.getSpuList(this.page)
            } else {
                this.getSpuList()
            }
        },
        //删除spu
        async deleteSpu(row){
            let result = await this.$API.spu.reqDeleteSpu(row.id)
            // console.log(result+'删除成功');
            if (result.code == 200) {
                this.$message({type:'success',message:"删除SPU成功"})
                this.getSpuList(this.records.length>1?this.page:this.page-1)
            }
            
        },
        //点击添加sku按钮
        addSku(row){
            this.show = 3
            // 父组件调用子组件方法,让子组件发三个请求
            this.$refs.addsku.getData(this.category1Id,this.category2Id,row)
        },
        // 添加sku子组件自定义回调
        changeshow(show){
            this.show = show
        },
        //点击sku的按钮
        async handler(spu){
            this.dialogTableVisible=true
            // reqSkuList
            this.skuspu = spu
            let result = await this.$API.spu.reqSkuList(spu.id)  
            if (result.code == 200) {
                this.SKUList = result.data
                this.loading=false
            }
        },
        //关闭对话框的回调
        close(done){
            //清除
            this.SKUList=[];
            this.loading=true;
            done()
        }
    },
}
</script>

<style>

</style>