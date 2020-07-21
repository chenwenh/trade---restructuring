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
                // "userRole": ["EM"], // 企业管理员
                // "authRole": ['CORE_ENT'],
                // "enterprise": ['ems', 'hsyy','jhyy', 'zhyy','tyjt', 'yzyy', 'tlyy', 'ycdl', 'rlhk', 'yjgf', 'yndl', 'bohai', 'kggm', 'mlf']
            },
            {
                "index": "/orgRolesManage",
                "title": "添加企业",
                "userRole": ["EM"], // 企业管理员
                "authRole": ['CORE_ENT'],
                "enterprise": ['ems', 'hsyy','jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'ycdl', 'rlhk', 'yjgf', 'yndl', 'bohai', 'kggm']
            }
        ]
    },
    {
        "icon": "el-icon-search",
        "index": "12",
        "title": "贸易管理",
        "subs": [
            {
                "index": "/supplierQuery",
                "title": "供应商管理",
                "subs": [],
                "enterprise": ['yndl'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/contractQuery",
                "title": "合同管理",
                "billType": "contract",
                "enterprise": ['ems', 'hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'ycdl', 'rlhk', 'yjgf', 'kggm', 'xydc', 'mlf'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/orderQuery",
                "title": "订单管理",
                "subs": [],
                "billType": "order",
                "enterprise": ['ems', 'hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'yndl', 'kggm', 'inspur', 'mlf'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            }, 
            {
                "index": "/invoiceQuery",
                "title": "发票管理",
                "subs": [],
                "billType": "invoice",
                "enterprise": ['tyjt', 'ycdl', 'inspur', 'mlf'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/delvgoodsQuery",
                "title": "发货单管理",
                "subs": [],
                "enterprise": ['hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'mlf'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/revcgoodsQuery",
                "title": "收货单管理",
                "subs": [],
                "enterprise": ['hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'ycdl', 'yndl', 'kggm', 'mlf'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/settlementQuery",
                "title": "结算单管理",
                "subs": [],
                "enterprise": ['ems', 'hsyy', 'jhyy', 'zhyy', 'tyjt', 'yzyy', 'tlyy', 'ycdl', 'rlhk', 'yjgf', 'yndl', 'kggm', 'mlf'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/aviationServiceQuery",
                "title": "航空服务费管理",
                "subs": [],
                "enterprise": ['rlhk'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/aviationOilQuery",
                "title": "航油数据管理",
                "subs": [],
                "enterprise": ['rlhk'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/mountainEagleCoin",
                "title": "山鹰币数据管理",
                "subs": [],
                "enterprise": ['rlhk'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/ticketSales",
                "title": "机票销售管理",
                "subs": [],
                "enterprise": ['rlhk'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/qualityQuery",
                "title": "质检单管理",
                "subs": [],
                "enterprise": ['tyjt', 'yjgf'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/ponderationQuery",
                "title": "过磅单管理",
                "subs": [],
                "enterprise": ['tyjt', 'yjgf', 'yth'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
            {
                "index": "/warehouseQuery",
                "title": "库存单管理",
                "subs": [],
                "enterprise": ['tyjt', 'yndl'],
                "authRole": ['CORE_ENT', 'SUPPLIER']
            },
        ]
    },
]
