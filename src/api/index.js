// 将四个模块接口函数统一暴露
import * as trademark from '@/api/product/tradeMark.js'
import * as attr from '@/api/product/attr.js'
import * as spu from '@/api/product/spu.js'
import * as sku from '@/api/product/sku.js'

// 对外暴露
export default {
    trademark,
    attr, 
    spu, 
    sku
}