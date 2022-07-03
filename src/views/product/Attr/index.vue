<template>
    <div>
        <el-card>
        <CategorySelect @getCategoryId='getCategoryId' :show="!isShowTable"></CategorySelect>
        </el-card>
        <!-- 下方内容 -->
        <el-card>
            <div v-show="isShowTable">
                <el-button type="primary" style="margin:5px 5px" :disabled='!category3Id' @click="addAttr">添加属性</el-button>
                <el-table border :data="attrInfoList" stripe  style="width: 100%">
                    <el-table-column align="center" label="序号" width="80" type="index"></el-table-column>
                    <el-table-column  prop="attrName"  label="属性名称"  width="250"></el-table-column>
                    <el-table-column  prop="address"  label="属性值列表">
                        <template slot-scope="{row,$index}">
                            <el-tag style="margin:0 10px" type="success" v-for="(attrvalue,index) in row.attrValueList" :key="attrvalue.id">{{attrvalue.valueName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="address"  label="操作" width="150">
                        <template slot-scope="{row,$index}">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updataattr(row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- //修改属性的结构 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" ref="form" label-width="70px">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" :disabled='!attrInfo.attrName' @click="addAttrValue">添加属性值</el-button>
                <el-button @click="isShowTable=true">取消</el-button>
                <el-table border style="width: 100%;margin-top:25px" :data="attrInfo.attrValueList">
                    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column label="属性值名称" >
                        <template slot-scope="{row,$index}">
                            <el-input :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="tolook(row)" @keyup.native.enter="tolook(row)"></el-input>
                            <span v-else style="display:block" @click="toEdit(row,$index)">{{row.valueName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="{row,$index}">
                            <!-- 气泡确认框 -->
                            <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                            <el-button type="danger" slot="reference" size="mini">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" style="margin-top:20px" @click="addUpdateAttr" :disabled='attrInfo.attrValueList<1'>保存</el-button>
                <el-button @click="isShowTable=true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
    name:'Attr',
    data() {
        return {
            category1Id: '',
            category2Id: '',
            category3Id: '',
            // 商品属性数组
            attrInfoList:[],
            // 控制表格显示与隐藏
            isShowTable:true,
            // 收集添加属性||修改
            attrInfo:{
                attrName:'', //属性名
                attrValueList:[ //属性值，因为属性可以有多个  所以用数组  每一个属性都是一个对象
                    // {
                    //     attrId:0, //属性名的id
                    //     valueName:''    
                    // }
                ],
                categoryLevel:3,
                categoryId:0,
            },
        };
    },
    methods: {
        ///自定义事件
        getCategoryId({categoryId,level}) {
            if (level == 1) {
                this.category1Id = categoryId
                this.category2Id=''
                this.category3Id=''
            }else if (level == 2) {
                this.category3Id=''
                this.category2Id = categoryId
            }else{
                this.category3Id = categoryId
                this.getAttrList()
            }
        },
        //获取平台的属性数组
        async getAttrList(){
            const{category1Id,category2Id,category3Id}=this
            let result =  await this.$API.attr.reqattrInfoList(category1Id,category2Id,category3Id)
            if (result.code == 200) {
                this.attrInfoList = result.data
            }
        },
        // 添加属性值
        addAttrValue(){
            this.attrInfo.attrValueList.push({
                attrId:this.attrInfo.id,  //对于修改某一个属性的时候，可以在已有的基础之上（新增的时候，可以把已有的id赋值给id）
                valueName:'',
                flag:true,      //给每一个属性值添加一个flag     区分查看模式 和 编辑模式
            })
            this.$nextTick(()=>{
                this.$refs[this.attrInfo.attrValueList.length-1].focus()
            })
        },
        // 添加属性按钮
            addAttr(){
                this.isShowTable=false //切换显示与隐藏
                // 清楚数据
                this.attrInfo={
                attrName:'', //属性名
                attrValueList:[ //属性值，因为属性可以有多个  所以用数组  每一个属性都是一个对象
                    // {
                    //     attrId:0, //属性名的id
                    //     valueName:''    
                    // }
                ],
                categoryLevel:3,
                categoryId:this.category3Id,    //收集三级分类的id
            }
        },
        //修改属性按钮
        updataattr(row){
            this.isShowTable=false
            //由于数据结构存在对象里面套数组，数组又套对象，因此需要使用深拷贝
            this.attrInfo=cloneDeep(row)
            this.attrInfo.attrValueList.forEach(item=>{
                //这样书写可以给属性添加flag字段，但不是响应式数据
                // item.flag = false
                this.$set(item,'flag',false)    //$set的使用(元素，属性，属性值)
            })
        },
        // 查看与编辑
        tolook(row){ //row最新的值
        //如果属性值为空  不可以作为属性值
        if (row.valueName.trim()=='') {
            this.$message('属性值不可以为空')
            return
        }
        // 新增的属性值不可以重复
        let isRepat = this.attrInfo.attrValueList.some(item=>{
            //row是最新的数组
            if (row!==item) {
                return row.valueName == item.valueName
            }
        })
        if (isRepat) return;
        console.log(isRepat);
        row.flag = false
        },
        // 点击span变为输入框   编辑模式
        toEdit(row,index){
            row.flag = true 
            //注意：点击span时候切换为input编辑模式，但是需要注意，对于浏览器而言，页面重新渲染也要消耗时间的  
            //$nextTick,当节点渲染完毕会执行一次 
            this.$nextTick(()=>{
                this.$refs[index].focus()
            })
        },
        // 点击泡泡确认按钮     版本问题  多加on
        deleteAttrValue(index){
            //删除属性值操作不需要发请求
            this.attrInfo.attrValueList.splice(index,1);
        },
        // 保存
        async addUpdateAttr(){
            // 整理参数 1,如果属性值为空不应该提交给服务器 2 提交服务器数据当中不应该出现falg字段
            this.attrInfo.attrValueList =  this.attrInfo.attrValueList.filter(item=>{
                if (item.valueName != '') {
                    delete item.flag
                    return true
                }
            })
            try {
                let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
                if (result.code == 200) {
                    this.$message({type:'success',message:'保存成功'})
                    this.getAttrList()
                    this.isShowTable = true
                }
            } catch (error) {
                alert(error.message)
            }
        }
    },
}
</script>

<style>

</style>