import request from '@/utils/request'
//平台属性
//获取一级分类   /admin/product/getCategory1
export const reqCategory1 = () => request({ url: "/admin/product/getCategory1", method: 'get' })
//获取二级分类  /admin/product/getCategory2/{category1Id}   get
export const reqCategory2 = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })
//获取三级分类/admin/product/getCategory3/{category2Id}   get
export const reqCategory3 = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 获取商品 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}       get
export const reqattrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
//添加属性与属性值的接口   /admin/product//saveAttrInfo     post
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product//saveAttrInfo', method: 'post', data })
// attrName:String,  --属性名
// attrValueList:[     --属性值，因为很多个，数组
//     {
//         attrid:0,    --属性的id
//         valueName:String --属性名
//     }
// ],
// categoryId:0     --3id
// categoreyLevel:3


