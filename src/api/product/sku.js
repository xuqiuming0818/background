import request from '@/utils/request'
//获取sku列表的数据     /admin/product/list/{page}/{limit}
export const reqSKUList = (page,limit) =>request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

// 上架     /admin/product/onSale/{skuId}           get
export const reqonSale = (skuId) =>request({url:`/admin/product/onSale/${skuId}`,method:'get'})

// 下架     /admin/product/cancelSale/{skuId}           get
export const reqcancelSale = (skuId) =>request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

// 获取sku详情的  /admin/product/getSkuById/{skuId}    get
export const reqgetSkuInfo = (skuId) =>request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})
