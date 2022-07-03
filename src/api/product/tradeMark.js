import request from '@/utils/request'
//获取品牌管理的模块   /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page,limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 添加品牌   /admin/product/baseTrademark/save  携带品牌名称品牌logo  post    修改 /admin/product/baseTrademark/update  put 携带id 名称  logo
export const reqAddOrUpdateTradeMark = (tradeMark)=>{
    if (tradeMark.id) {
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
    } else {
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
    }
}
//删除品牌 /admin/product/baseTrademark/remove/{id}   delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })

