export default{
    breadcrumbs:{
        "TRADEDLVRGOODS":['贸易管理', '发货单管理'],
        "TRADERECVGGOODS":['贸易管理', '收货单管理'],
        "TRADESETTLEMENT":['贸易管理', '结算单管理'],
        "TRADEORDER":['贸易管理', '订单管理'],
        "TRADEINVOICE":['贸易管理', '发票管理'],
        "TRADEPONDERATION":['贸易管理', '过磅单管理'],
        "TRADEQUALITY":['贸易管理', '质检单管理'],
        "TRADESUPPLIER":['贸易管理', '供应商管理'],
        "TRADEAVIATIONSERVICEFEE":['贸易管理', '航空服务费管理'],
        "TRADEAVIATIONOILDATA":['贸易管理', '航油数据管理'],
        "TRADEEAGLECOINTRANSACTION":['贸易管理', '山鹰币数据管理'],
        "TRADETICKETSALES":['贸易管理', '机票销售管理'],
        "TRADEWAREHOUSE":['贸易管理', '库存单管理']
    },
    // 查询条件
    queryTerms:{
        "TRADEDLVRGOODS":{
            "entityNo":"发货单单号",
            "name":"发货单名称"
        },
        "TRADERECVGGOODS":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"收货单单号",
            "TradeRecvgGoods_drDate":"收货日期",
            "TradeRecvgGoods_createTime":"创建日期"
        },
        "TRADESETTLEMENT":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"结算单单号",
            "name":"结算单名称",
            "TradeContract_amount":"结算单总金额区间",
            "TradeSettlement_settleDate":"结算日期区间"
        },
        "TRADEORDER":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"订单单号"
        },
        "TRADEINVOICE":{
            "entityNo":"发票代码",
            "fphm":"发票号码"
        },
        "TRADEPONDERATION":{
            "orgName":"买方或卖方企业名称",
            "entityNo":"过磅单编号",
            "TradePonderation_weighingDate":"过磅日期区间"
        },
        "TRADEQUALITY":{
            "orgName":"买方或卖方企业名称",
            "batch":"校验批次",
            "TradeQuality_qualityDate":"质检日期区间"
        },
        "TRADESUPPLIER":{
            "entityNo":"供货商编号",
            "orgName":"供货商名称"
        },
        "TRADEAVIATIONSERVICEFEE":{
            "flightNumber":"航班号",
            "airplaneNumber":"飞机号"
        },
        "TRADEAVIATIONOILDATA":{
            "flightNumber":"航班号",
            "airplaneNumber":"飞机号"
        },
        "TRADEEAGLECOINTRANSACTION":{
            "buyerName":"代理人名称"
        },
        "TRADETICKETSALES":{
            "orgName":"代理人名称"
        },
        "TRADEWAREHOUSE":{
            "warehouseName":"仓库名称",
            "orgName":"买方或卖方企业名称"
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
        },
        "TRADESETTLEMENT":{
            entityNo: "结算单单号",
            name: "结算单名称",
            buyer: "买方",
            seller: "卖方",
            settlePrice: "结算单价",
            totalAmount: "结算单总金额",
            paidAmount: "结算单支付金额",
            balanceAmount: "余额",
            settleDate: "结算日期",
            startDate: "结算开始日期",
            endDate: "结算结束日期",
        },
        "TRADEORDER":{
            name: "订单名称",
            entityNo: "订单单号",
            orderAmount: "订单金额",
            buyer: "买方名称",
            seller: "卖方名称",
            createTime: "订单创建日期",
            startDate: "订单发起日期",
            goodsHead:{
                title: "商品信息",
                children: {
                    skuId: "货品编号",
                    goodsName: "货品名称",
                    remarks: "货品描述",
                    spec: "商品规格",
                    quantity: "数量",
                    unit: "单位",
                    manufacturer: "制造商",
                    unitPrice: "单价",
                    taxRate: "税率(%)",
                }
            }
        },
        "TRADEINVOICE":{
            fpdm: "发票代码",
            fphm: "发票号码",
            code: "发票校验码",
            kprq: "开票日期",
            num: "发票机器码",
            taxamount: "税额合计",
            goodsamount: "价格合计",
            sumamount: "价税合计",
            quantityAmount: "数量合计",
            checkStatus: "状态",
            updateTime: "更新时间"
        },
        "TRADEPONDERATION":{
            entityNo: "过磅单编号",
            name:"过磅单名称",
            buyer: "买方",
            seller: "卖方",
            carPlateNumber: "车牌号",
            driver: "司机名称",
            netWeight: "净重",
            weighingDate: "过磅日期"
        },
        "TRADEQUALITY":{
            inspectionBatch: "校验批次",
            remarks: "备注",
            qualityDate:'质检日期',
            buyer: "买方",
            seller: "卖方"
        },
        "TRADESUPPLIER":{
            entityNo:"供应商编号",
            seller: "供应商名称",
            supplierSh: "供应商税号",
            supplierAddr: "供应商地址",
            contractUser: "联系人",
            telPhone: "联系人电话",
            email: "联系人邮箱",
            remarks: "备注"
        },
        "TRADEAVIATIONSERVICEFEE":{
            flightNumber: "航班号",
            airplaneNumber: "飞机号",
            passage: "航段",
            airportServiceFee2: "机场服务费",
            civilAviationDevelopmentFund2: "民航发展基金",
            serviceDate: "日期"
        },
        "TRADEAVIATIONOILDATA":{
            lightNumber: "航班号",
            airplaneNumber: "飞机号",
            passage: "航段",
            fuelAmount: "加油量",
            unit: "单位",
            unitPrice: "单价",
            money2: "金额",
            flightDate: "航班日期"
        },
        "TRADEEAGLECOINTRANSACTION":{
            agentName: "代理人名称",
            accountingTime: "入账时间",
            changeMoney2: "变动金额",
            balance2: "余额"
        },
        "TRADETICKETSALES":{
            agentName: "代理人名称",
            daySaleAmount: "日销售数量",
            daySaleMoney2: "日销售金额",
            dayRefundsAmount: "日退票数量",
            dayRefundsMoney2: "日退票金额",
            saleDate: "销售日期"
        },
        "TRADEWAREHOUSE":{
            buyer: "公司名称",
            warehouseName: "仓库名称",
            seller: "供应商明细",
            checkDate: "盘点日期",
            goodsHead:{
                title: "商品信息",
                children: {
                    skuId: "货品编号",
                    goodsName: "货品名称",
                    remarks: "货品描述",
                    spec: "商品规格",
                    quantity: "数量",
                    unit: "单位",
                    manufacturer: "制造商",
                    unitPrice: "单价",
                    taxRate: "税率(%)",
                    totalAmount: "合计(元)"
                }
            }
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
        },
        "TRADESETTLEMENT":{
            entityNo: "结算单单号",
            name: "结算单名称",
            settlePrice: "结算单价",
            totalAmount: "结算单总金额",
            paidAmount: "结算单支付金额",
            balanceAmount: "余额",
            startDate: "结算开始日期",
            endDate: "结算结束日期",
            settleDate: "结算日期",
            myRoleType: "我方角色",
            buyer: "买方名称",
            seller: "卖方名称",
            settleCompany: "结算单位",
            detailEntry: "明细录入",
        },
        "TRADEORDER":{
            name: "订单名称",
            entityNo: "订单单号",
            deliveryType: "订单类型",
            amount: "订单金额",
            myRoleType: "我方角色",
            buyer: "买方名称",
            orderAddress: "订单地址",
            unloadAddress: "下货地址",
            seller: "卖方名称",
            clientName: "客户名称",
            startDate: "订单发起日期",
            endDate: "订单结束日期",
            inputDate: "订单录入日期",
            remarks: "备注"
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
        },
        "TRADESETTLEMENT":{
            skuId: "货品编号",
            goodsName: "货品名称",
            remarks: "货品描述",
            spec: "商品规格",
            quantity: "数量",
            unit: "单位",
            manufacturer: "制造商",
            unitPrice: "单价",
            taxRate: "税率(%)",
            totalAmount: "合计(元)",
        },
        "TRADEORDER":{
            skuId: "货品编号",
            goodsName: "货品名称",
            remarks: "货品描述",
            spec: "商品规格",
            quantity: "数量",
            unit: "单位",
            manufacturer: "制造商",
            unitPrice: "单价",
            taxRate: "税率(%)",
            totalAmount: "合计(元)"
        },
    }
}