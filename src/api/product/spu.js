import request from '@/utils/request'
//SPU接口
// 获取spu列表数据        /admin/product/{page}/{limit}   get
export const reqSpuList = (page,limit,category3Id) =>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

//SPU
// 获取某一个spu信息     /admin/product/getSpuById/{spuId}       get
export const reqSpu = (spuId) =>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})
//品牌数据需要发请求     /admin/product/baseTrademark/getTrademarkList      get
export const reqTradeMarkList = () =>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})
// 获取spu的图片      /admin/product/spuImageList/{spuId}     get
export const reqSpuImageList = (spuId) =>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})
// 获取平台中的全部销售属性   整个平台只有三个可选  /admin/product/baseSaleAttrList         get
export const reqBaseSaleAttrList = () =>request({url:'/admin/product/baseSaleAttrList',method:'get'})

// 修改和添加 SPU      判断是否带id进行修改 或 添加
export const reqAddOrUpdataSpu = (spuInfo) =>{
    //如果有id  修改
    if (spuInfo.id) {
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    } else { //添加
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
    }
}

// 删除spu   /admin/product/deleteSpu/{spuId}   delete
export const reqDeleteSpu=(spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

//获取图片的接口    /admin/product/spuImageList/{spuId}     get
export const reqSpuImageList1 = (spuId) =>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})
//获取销售属性列表    /admin/product/spuSaleAttrList/{spuId}     get
export const reqSpuSaleAttrList = (spuId) =>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})
//获取平台属性的数据    /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}     get
export const reqattrInfoList = (category1Id,category2Id,category3Id) =>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加sku最终接口
export const reqAddSku = (skuInfo) =>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

// 获取sku列表数据   /admin/product/findByspuId/{spuId}     get
export const reqSkuList = (spuId) =>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})

