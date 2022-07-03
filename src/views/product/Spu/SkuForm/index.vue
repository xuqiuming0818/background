<template>
    <div>
        <el-form ref="form"  label-width="100px">
            <!-- SKU的名称 -->
            <el-form-item label="SKU的名称">{{spu.spuName}}
            </el-form-item>
            <el-form-item label="SKU名称">
                <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>
            <!-- 价格(元) -->
            <el-form-item label="价格(元)">
                <el-input placeholder="价格(元)" type="number"  v-model="skuInfo.price"></el-input>
            </el-form-item>
            <!-- 重量 -->
            <el-form-item label="重量(kg)">
                <el-input placeholder="重量(kg)" v-model="skuInfo.weight"></el-input>
            </el-form-item>
            <!-- 规格描述 -->
            <el-form-item label="规格描述">
                <el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item> 
            <!-- 平台属性 -->
            <el-form-item label="平台属性">
                <el-form ref="form" :inline="true" label-width="80px">
                    <el-form-item label="屏幕尺寸" v-for="(attr,index) in attrInfoList" :key="attr.id">
                        <el-select placeholder="请选择" value=''>
                            <el-option label="屏幕尺寸" value="value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="无线通讯">
                        <el-select placeholder="请选择" value=''>
                            <el-option label="屏幕尺寸" value="value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form ref="form" :inline="true" label-width="80px">
                    <el-form-item label="颜色">
                        <el-select placeholder="请选择" value=''>
                            <el-option label="屏幕尺寸" value="value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表">
                <el-table border style="width: 100%" :data="spuImageList" @selection-change="selectionchange">
                    <el-table-column prop="prop" width="80" align="center"  type="selection"></el-table-column>
                    <el-table-column prop="prop" label="图片" width="width">
                        <template slot-scope="{row,$index}">
                            <img :src="row.imgUrl"  style="width:100px;height:100px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="名称" width="width">
                        <template slot-scope="{row,$index}">
                            <span>{{row.imgName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <el-button type="primary" v-if="row.isDefault==0" @click="changeisDefault(row)">设为默认</el-button>
                            <el-button v-else>默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name:'SkuForm',
    data() {
        return {
            spuImageList:[],        //skuform图片的数据
            spuSaleAttrList:[],     //存储销售属性
            attrInfoList:[],        //平台属性的数据
            spu:{},
            //收集sku信息
            skuInfo:{
                category3Id:0,  //父组件已经给予
                spuId:0,
                tmId:0,
                price:0,       //通过双向绑定得来
                skuName:'',
                weight:'',
                skuDesc:'',
                // 默认图片
                skuDefaultImg:'',
                // 收集图片
                skuImageList:[      //需要自己书写代码
                
                ],
                // 收集销售属性列表的数据
                skuSaleAttrValueList:[

                ],
                // 平台属性
                skuAttrValueList:[

                ]
                

            },
            //收集未处理的图片字段{缺少isDefault}字段
            QMimageList:[]
        };
    },
    methods: {
        //获取skuform图片的数据
        async getData(category1Id,category2Id,spu){
            //收集父组件给予的数据
            this.spu = spu
            this.skuInfo.category3Id = spu.category3Id;
            this.skuInfo.tmId = spu.tmId;
            this.skuInfo.spuId = spu.id;

            //获取图片的接口
            let result = await this.$API.spu.reqSpuImageList1(spu.id)
            if (result.code == 200) {
                let list = result.data
                list.forEach(item => {
                    item.isDefault = 0
                });
                this.spuImageList = list

            }
            //获取销售属性列表
            let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
            if (result1.code == 200) {
                this.spuSaleAttrList = result.data
            }
            //获取平台属性的数据
            let result2 = await this.$API.spu.reqattrInfoList(category1Id,category2Id,spu.category3Id)
            if (result2.code == 200) {
                // console.log(result,'平台属性');
                this.attrInfoList = result.data
            }
            console.log(spu);
        },
        // table复选框按钮的事件
        selectionchange(selection){
            this.QMimageList = selection
        },
        changeisDefault(row){
            // 排他思想
            this.spuImageList.forEach(item => {
                item.isDefault = 0
            });
            row.isDefault = 1;
        },
        // 点击取消,通知父亲
        cancel(){
            // 自定义事件
            Object.assign(this._data,this.$options.data())
            this.$emit('changeshow',1)
        },
        //保存按钮的回调
        save(){
            this.$emit('changeshow',1)
        }
    },
}
</script>

<style>

</style>