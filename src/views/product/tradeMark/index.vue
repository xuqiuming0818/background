<template>
    <div><el-button type="primary" icon="el-icon-plus" style="margin:10px 10px" @click="showDialog">添加</el-button>
        <el-table border  style="width: 100%" :data="List">
        <el-table-column
            label="序号"
            width="80"
            align="center"
            type='index'>
        </el-table-column>
        <el-table-column
            prop="tmName"
            label="品牌名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="logoUrl"
            label="品牌LOGO">
            <template slot-scope="{row,$index}">
                <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
            </template>
        </el-table-column>
        <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="{row,$index}">
                <el-button type="primary" icon="el-icon-delete-solid" @click="deleleTradeMark(row)">删除</el-button>
                <el-button type="primary" icon="el-icon-help" @click="updateTradeMark(row)">修改</el-button>
            </template>
        </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top:20px;textAlign:center"
            @size-change="handleSizeChange"
            @current-change="getPagesList"
            :current-page="page"
            :page-sizes="[3, 6, 9]"
            :page-size="limit"
            :pager-count="7"
            layout=" prev, pager, next, jumper,->,sizes,total"
            :total="total">
        </el-pagination>

        <!-- 对话框 -->
        <!-- :visible.sync控制对话框显示隐藏用的 -->
        <el-dialog :title="this.tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
        <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm" >
            <el-form-item label="活动名称" label-width="100px" prop="tmName">
            <el-input  autocomplete="off" v-model="tmForm.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌图片" label-width="100px" prop="logoUrl">
            <!-- 弹出框 -->
            <el-upload
                class="avatar-uploader"
                
                action="/dev-api/admin/product/fileUpload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
            </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
        </div>
        </el-dialog>
    </div>
    
</template>

<script>
export default {
    name:'tradeMark',
    data() {
    return {
        page:1,   //当前页面
        limit:3,    //一夜显示
        List:[],  //数组
        total:99,
        // 显示与隐藏对话框属性
        dialogFormVisible:false,
        // 收集品牌信息：
        tmForm:{
            tmName:'',
            logoUrl:''
        },
        rules: {
            //品牌名称验证规则
            tmName: [
                { required: true, message: '请输入品牌名称', trigger: 'change' },
                { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
            ],
            //图片验证规则
            logoUrl: [
                { required: true, message: '请选择品牌的图片', trigger: 'change' }
            ]
            }
    }
    },
    // 挂载完毕
    mounted() {
        this.getPagesList()
    },
    // 方法
    methods: {
        //当分页器某一页展示数据的条数发送变化时
        handleSizeChange(limit) {
            this.limit = limit
            this.getPagesList()
        },
        //获取品牌数据
        async getPagesList(pager = 5){
            this.page = pager
            const {page,limit} = this
            let result =  await this.$API.trademark.reqTradeMarkList(page,limit)
            if (result.code == 200) {
                this.total=result.data.total
                this.List=result.data.records
            }
        },
        // 点击添加按钮
        showDialog(){
            // 显示对话框
            this.dialogFormVisible =true
            this.tmForm={tmName:'',logoUrl:''}
        },
        // 修改某个品牌
        updateTradeMark(row){
            this.dialogFormVisible =true
            this.tmForm = {...row}
        },
        // 图片上传之前
        beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //图片上传成功
        handleAvatarSuccess(res,file){
            if (res.code == 200) {console.log(res);
                this.tmForm.logoUrl = res.data
            }
        },
        //添加按钮
        addOrUpdateTradeMark(){
            this.$refs.ruleForm.validate(async(valid) => {
            if (valid) {
                this.dialogFormVisible=false
                let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
                    if (result.code == 200) {
                        //弹出
                        this.$message({
                            type:'success',
                            message:this.tmForm.id?'修改品牌成功':'添加品牌成功'
                        })
                        //如果添加品牌 停在第一页 修改  停在当前页面
                        this.getPagesList(this.tmForm.id?this.page:1)
                    }
            } else {
                this.$message({ message:'格式不对'})
                return false;
                
            }
            });
            
        },
        //删除品牌
        deleleTradeMark(row){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async() => {
                let result =  await this.$API.trademark.reqDeleteTradeMark(row.id)
                if (result.code == 200) {
                    this.$message({
                    type: 'success',
                    message: '删除成功!',
                });
                this.getPagesList(this.List.length >= 1?this.page:this.page-1)
                }
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
        }
    },
    
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
border-color: #409EFF;
}
.avatar-uploader-icon {
font-size: 28px;
color: #8c939d;
width: 178px;
height: 178px;
line-height: 178px;
text-align: center;
}
.avatar {
width: 178px;
height: 178px;
display: block;
}
</style>