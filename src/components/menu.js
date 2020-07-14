export default [
    {
        "icon": "el-icon-s-home",
        "index": "/readme",
        "title": "首页",
        "subs": []
    }, 
    {
        "icon": "el-icon-menu",
        "index": "11",
        "title": "企业管理",
        "subs": [
            {
                "icon": "el-icon-s-order",
                "index": "/wareHouseInformation",
                "title": "企业信息",
            },
            {
                "icon": "el-icon-s-order",
                "index": "/authorization",
                "title": "企业授权",
            },
            {
                "index": "/orgRolesManage",
                "title": "添加企业",
            }
        ]
    },
    {
        "icon": "el-icon-search",
        "index": "12",
        "title": "贸易管理",
        "subs": [
            {
                "index": "/contractQuery",
                "title": "合同管理",
            },
            {
                "index": "/orderQuery",
                "title": "订单管理",
                "subs": []
            }, 
            {
                "index": "/invoiceQuery",
                "title": "发票管理",
                "subs": []
            },
            {
                "index": "/delvgoodsQuery",
                "title": "发货单管理",
                "subs": []
            },
            {
                "index": "/revcgoodsQuery",
                "title": "收货单管理",
                "subs": []
            },
            {
                "index": "/settlementQuery",
                "title": "结算单管理",
                "subs": []
            }
        ]
    },
]
