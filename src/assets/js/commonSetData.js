export default{
    breadcrumbs:{
        "TRADEDLVRGOODS":['贸易管理', '发货单管理'],
        "TRADERECVGGOODS":['贸易管理', '收货单管理']
    },
    // 查询条件
    queryTerms:{
        "TRADEDLVRGOODS":{
            "entityNo":"发货单单号",
            "name":"发货单名称"
        },
        "TRADERECVGGOODS":{
            "orgName":" 买方或卖方企业名称",
            "entityNo":"收货单单号",
            "TradeRecvgGoods_drDate":"收货日期",
            "TradeRecvgGoods_createTime":"创建日期"
        }
    },
    // 表格展示列
    tableHeader:{
        "TRADEDLVRGOODS":{
            name: "发货单名称",
            entityNo: "发货单单号",
            delvAmount: "发货单总金额",
            seller: "卖方名称",
            buyer: "买方名称",
            recvgStatusFlag: "收货状态",
            delvDate: "发货日期"
        },
        "TRADERECVGGOODS":{
            entityNo: "收货单单号",
            buyer: "买方名称",
            seller: "卖方名称",
            createTime: '创建日期',
            drDate: "收货日期",
            revcAmount: "收货单总金额",
        }
    },
    // 添加表单时需要的字段
    addFormItem:{
        "TRADEDLVRGOODS":{
            name: "发货单名称",
            entityNo: "发货单单号",
            operator: "出货单操作人",
            amount: "发货单总金额",
            myRoleType: "我方角色",
            buyer: "买方名称",
            seller: "卖方名称",
            drDate: "发货日期",
            unloadAddress: "下货地址",
            sellerAddress: "买家地址",
            buyerAddress: "卖家地址",
            buyerTel: "买家电话",
            sellerTel: "卖家电话",
            detailEntry:''
        },
        "TRADERECVGGOODS":{
            name: "收货单名称",
            entityNo: "收货单单号",
            operator: "出货单操作人",
            amount: "收货单总金额",
            myRoleType: "我方角色",
            buyer: "买方名称",
            seller: "卖方名称",
            drDate: "收货日期",
            unloadAddress: "下货地址",
            sellerAddress: "买家地址",
            buyerAddress: "卖家地址",
            buyerTel: "买家电话",
            sellerTel: "卖家电话",
            detailEntry: "明细录入"
        }
    },
    // 详情
    detailsGoodsTableHeader:{
        "TRADEDLVRGOODS":{
            skuId: "货品编号",
            goodsName: "货品名称",
            remarks: "货品描述",
            spec: "商品规格",
            unit: "单位",
            manufacturer: "制造商",
            unitPrice2: "单价",
            taxRate: "税率(%)",
            quantity: "发货数量",
            receiveTotalAmount2: "收货金额",
            receiveQuantity: "收货数量",
            totalAmount2: "发货金额"
        },
        "TRADERECVGGOODS":{
            skuId: "货品编号",
            goodsName: "货品名称",
            remarks: "货品描述",
            spec: "商品规格",
            quantity: "数量",
            unit: "单位",
            manufacturer: "制造商",
            unitPrice2: "单价",
            taxRate: "税率(%)",
            totalAmount: "合计(元)",
        }
    }
}