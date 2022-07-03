<template>
    <div>
        <el-form ref="form"  label-width="80px" :model="spu">
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
            </el-form-item>
            <!-- 品牌 -->
            <el-form-item label="品牌">
                <el-select  placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in tradeMarkList" :key="tm.id"></el-option>
                </el-select>
            </el-form-item>
            <!-- SPU描述 -->
            <el-form-item label="SPU描述">
                <el-input type="textarea" rows='4' v-model="spu.description"></el-input>
            </el-form-item>
            <!-- 照片墙 -->
            <el-form-item label="SPU图片">
                <!-- action上传图片的地址  list-type:文件列表的类型 :on-preview预览的时候会触发 :on-remove删除的时候会触发-->
                <!-- file-list 照片墙需要展示的数据（必须有name，url） -->
                <el-upload
                    :file-list="imageList"  :on-success="handleSuccess"
                    action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <!-- 销售属性 -->
            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${noSeletSaleAttr.length}未选择`" v-model="attrIdandAttrName">
                    <el-option :label="noSelet.name" :value="`${noSelet.id}:${noSelet.name}`" v-for="(noSelet,index) in noSeletSaleAttr" :key="noSelet.id"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdandAttrName" @click="addSaleAttr">添加销售属性</el-button>
                <el-table style="width: 100%;margin-top:10px" border :data="spu.spuSaleAttrList">
                    <el-table-column prop="prop" label="序号" width="80" align="center" type="index"></el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="150"></el-table-column>
                    <el-table-column prop="prop" label="属性值名称列表" width="width">
                        <!-- 属性名的小泡泡 -->
                        <template slot-scope="{row,$index}">
                            <el-tag :key="tag"  v-for="(tag,index) in row.spuSaleAttrValueList" ::key="tag.id" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)"> {{tag.saleAttrValueName}}</el-tag>
                            <el-input  class="input-new-tag"  v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput"  size="small"
                                @keyup.enter.native="handleInputConfirm(row)"
                                @blur="handleInputConfirm(row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ 添加属性</el-button>
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column prop="prop" label="操作" width="180">
                        <template slot-scope="{row,$index}">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form-item style="margin-top:10px">
                    <el-button type="primary" @click="addorupdate">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name:'SpuForm',
    data() {
        return {

            dialogImageUrl: '',
            dialogVisible: false,
            //初始化的时候是一个空对象
            spu:{
                //三级分类的id
                category3Id:0,
                //描述
                description:'',
                //spu的名称
                spuName:'',
                // 品牌的id
                tmId:'',
                // 收集spu图片信息
                spuImageList:[],
                //平台属性与属性值的收集
                spuSaleAttrList:[]
            }, //spu信息
            tradeMarkList:[],       //品牌的信息
            imageList:[],       //spu图片的数组
            saleAttrList:[],        //全部销售属性数组
            attrIdandAttrName:'',          //收集未选择的销售属性id
        };},
    methods: {
        // 点击添加新的销售属性
        addSaleAttr(){
            // 分割
            const [baseSaleAttrId,saleAttrName] = this.attrIdandAttrName.split(':');
            console.log(baseSaleAttrId,saleAttrName,'123');
            // 想spu对象的spuSaleAttrList属性里面添加新的销售属性
            let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
            // 添加进去
            this.spu.spuSaleAttrList.push(newSaleAttr)
            this.attrIdandAttrName = '';
        },
        //照片墙图片上传成功的回调
        handleSuccess(response, file, fileList){
            this.imageList = fileList
        },
        // 点击小添加按钮
        showInput(row) {
            // 添加响应式数据inputVisible  控制输入框显示与隐藏
            this.$set(row,'inputVisible',true)
            //通过响应式数据inputValue  收集新增的属性值
            this.$set(row,'inputValue','')
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // input输入框失去焦点的回调
        handleInputConfirm(row) {
            console.log(row);
            const {baseSaleAttrId,inputValue} = row
            // 属性值不能为空
            if (inputValue.trim()=='') {
                this.$message('属性值不能为空')
                return
            }
            // 属性值不能重复
            let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName != inputValue
            )
            if (!result){
                this.$message('属性值不可以重复')
                return
            }
            // 新增的销售属性值
            let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
            row.spuSaleAttrValueList.push(newSaleAttrValue)
            row.inputVisible = false
            
        },
        //照片墙删除某个图片的时候触发
        handleRemove(file, fileList) {
            // file代表删除的那个图片
            // fileList照片墙删除某一张图片剩余的
            //收集照片墙图片的数据
            this.imageList = fileList
        },
        // 照片墙预览的回调
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url; //图片的地址
            this.dialogVisible = true;  
        },
        // 点击修改 要发的请求
        async initSpuData(row){
            // 获取spu信息
            const result = await this.$API.spu.reqSpu(row.id)
            if (result.code == 200) {
                this.spu = result.data
            }
            // 获取品牌的信息
            const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data
            }
            // reqSpuImageList
            // 获取品牌图片的
            const ImageResult = await this.$API.spu.reqSpuImageList(row.id)
            if (ImageResult.code == 200) {
                // console.log(ImageResult.data,'品牌图片');
                let listArr = ImageResult.data
                // 照片墙需要有name和url字段才可以显示  要先处理一下
                listArr.forEach(item => {
                    item.name = item.imgName;
                    item.url = item.imgUrl;
                });
                // 整理好重新赋值
                this.imageList = listArr
            }
            //获取平台中的全部销售属性reqBaseSaleAttrList
            const saleResult = await this.$API.spu.reqBaseSaleAttrList()
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data
            }

        },
        // 保存按钮的回调
        async addorupdate(){
            // 整理所有参数   重点整理照片墙的数据
            this.spu.spuImageList=this.imageList.map(item=>{
                return {
                    imgName:item.name,
                    imgUrl:(item.response&&item.response.data) || item.url
                }
            })
            let result = await this.$API.spu.reqAddOrUpdataSpu(this.spu)
            if (result.code == 200) {
                this.$message({type:'success',message:'添加spu成功'})
                // 成功回到场景1
                this.$emit('changeShow',{show:1,flag:this.spu.id?'修改':'添加'})
            }
            // 也要把数据清楚一下
            Object.assign(this._data,this.$options.data())
        },
        // 点击添加属性的按钮发请求
        async addSpuData(ID){
            // 获取品牌的信息
            const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data
            }
            //获取平台中的全部销售属性reqBaseSaleAttrList
            const saleResult = await this.$API.spu.reqBaseSaleAttrList()
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data
            }
            this.spu.category3Id = ID
        },
        // 取消按钮
        cancel(){
            this.$emit('changeShow',{show:1,flag:''})
            //清楚数据
            //组件实例this._data，可以操作data当中响应式数据
            // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
            Object.assign(this._data,this.$options.data())
        }
    },
    // 计算属性
    computed: {
        //计算出还未选择的销售属性
        noSeletSaleAttr() {
            // 整个平台的销售属性一共三个 颜色尺寸版本 --saleAttrList
            let result =  this.saleAttrList.filter(item=>{
                return this.spu.spuSaleAttrList.every(item1=>{
                    return item.name !== item1.saleAttrName
                })
            })
            return result
        },
    
    },
}
</script>

<style scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>