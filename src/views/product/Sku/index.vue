<template>
    <div>
        <!-- 表格 -->
        <el-table  style="width: 100%" border :data="records">
            <el-table-column type="index"  label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="skuName"  label="名称" width="200"></el-table-column>
            <el-table-column prop="skuDesc"  label="属性" width="300"></el-table-column>
            <el-table-column prop="prop"  label="默认图片" width="110">
                <template slot-scope="{row,$index}">
                    <img :src="row.skuDefaultImg" alt="" style="width:100px;heiht:100px">
                </template>
            </el-table-column>
            <el-table-column prop="weight"  label="重量(KG)" width="80"></el-table-column>
            <el-table-column prop="price"  label="价格(元)" width="80"></el-table-column>
            <el-table-column prop="prop"  label="操作" width="300">
                <template slot-scope="{row,$index}">
                    <HintButton type="success" icon="el-icon-download" size="mini" v-if="row.isSale == 1" title="下架" @click="cancel(row)"></HintButton>
                    <HintButton type="success" icon="el-icon-upload2" size="mini" v-else title="上架" @click="sale(row)"></HintButton>
                    <HintButton type="primary" icon="el-icon-edit" size="mini" title="编辑" @click="edit"></HintButton>
                    <HintButton type="info" icon="el-icon-key" size="mini" @click="getSkuinfo(row)"></HintButton>
                    <HintButton type="danger" icon="el-icon-delete-solid" size="mini"></HintButton>
                </template>
            </el-table-column>


        </el-table>
        <!-- 分页器 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="getSKUlsit"
            style="textAlign:center"
            :current-page="page"
            :page-sizes="[3, 5, 10]"
            :page-size="limit"
            layout="  prev, pager, next, jumper,->,sizes,total"
            :total="total">
        </el-pagination>
        <el-drawer :visible.sync="show" :show-close='false' size='50%'>
            <el-row>
                <el-col :span="5" style="">名称</el-col>
                <el-col :span="16">{{skuInfo.skuName}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5" style="">描述</el-col>
                <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5" style="">价格</el-col>
                <el-col :span="16">{{skuInfo.price}}元</el-col>
            </el-row>
            <el-row>
                <el-col :span="5" style="">平台属性</el-col>
                <el-col :span="16">
                    <template>
                        <el-tag style="margin-right:8px" type="success" v-for="(skuAttr,index) in skuInfo.skuAttrValueList" :key="skuAttr.id">{{skuAttr.attrId}}-{{skuAttr.valueId}}</el-tag>
                    </template>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5" style="">商品图片</el-col>
                <el-col :span="16">
                    <el-carousel height="350px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id" >
                            <img :src="item.imgUrl" style="width:100%;height:100%">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
import HintButton from '@/components/HintButton'
export default {
    name:'Sku',
    components:{HintButton},
    data() {
        return {
            show: false,

            page: 4,
            limit:5,
            records:[], //存储sku列表数据
            total:0,
            skuInfo:{},//存储sku详细信息
        };
    },
    // 方法
    methods: {
        
        //获取SKu列表
        async getSKUlsit(pages = 1) {
            this.page = pages
            const {page,limit} = this //解构
            let result = await this.$API.sku.reqSKUList(page,limit)
            // console.log(result,'获取SKu列表');
            if (result.code == 200) {
                this.records = result.data.records
                this.total = result.data.total
            }
        },
        // 修改展示的条数
        handleSizeChange(limit){
            this.limit = limit
            this.getSKUlsit()
        },
        //上架
        async sale(row){
            let result = await this.$API.sku.reqonSale(row.id) 
            if (result.code == 200) {
                console.log(result,'上架成功');
                this.$message({type:'success',message:'上架成功'})
                this.getSKUlsit(this.page)
            } 
        },
        //下架
        async cancel(row){
            let result = await this.$API.sku.reqcancelSale(row.id)
            if (result.code == 200) {
                console.log(result,'下架成功');
                this.$message({type:'success',message:"下架成功"})
                this.getSKUlsit(this.page)
            }
        },
        // 编辑按钮-正在开发中
        edit(){
            this.$message({type:'warning',message:"正在开发中........."})
        },
        // 获取sku详细信息--右边拉框
        async getSkuinfo(row){
            this.show = true    //右边拉框 开启
            let result =await this.$API.sku.reqgetSkuInfo(row.id)
            if (result.code == 200) {
                console.log(result,'获取sku详细信息');
                this.skuInfo = result.data
            }
        }
    },
    // 挂载完毕
    mounted() {
        this.getSKUlsit()
    },
    
}
</script>

<style scoped>
    >>>.el-col-5{
        text-align: right;
        font-size: 18px;font-weight: 700;
        margin-right: 10px;
    }
    >>>.el-row{
        margin: 15px;
    }
    .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
    >>>.el-carousel__button{
        width: 10px;
        height: 10px;
        background: red;
        border-radius: 50%;
    }
    
</style>