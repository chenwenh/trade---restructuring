
/* eslint-disable */
export let apiUrl = {
    tokenRefresh:apiGateway + '/auth/api/v1.0/token/refresh/v2',//获取最新的token用户信息
    loginUrl: apiGateway + '/auth/api/v1.0/token/new',
    queryContract:currentApiUrl + '/asset/query',//合同查询
    orguserList:apiGateway + '/orguser/org/v1.0/list',//获取企业列表
    orguserDetail:apiGateway + '/orguser/org/v1.0/detail/',//根据id去查询详情
    fileQuery:apiGateway + '/files/file/query/',//文件预览
    uploadFileApi:uploadFile + fileQuery,//文件上传
    businessAuthorize:currentApiUrl,//企业授权
    tradeAuthQuery:currentApiUrl+ '/auth/query',//已授权企业查询
    // getOrgInfoByOrgId:currentApiUrl + '/org-info/getOrgInfoByOrgId/' , //根据orgId查询企业
    querySettlementByContract:currentApiUrl + '/asset/querySettlementByContract',//根据合同查询结算单
    pushFullAssetPackage:currentApiUrl + '/asset/pushFullAssetPackage',//合同下的结算单推送
    getAssetGraphUuid:currentApiUrl + '/graph/pattern-graph/asset-graph-uuid/',//获取patterenGraphUuid
    getUpStreamAllAssetType:currentApiUrl +　'/graph/getUpStreamAllAssetType/',//获取上游资产类型
    getDownStreamAllAssetType:currentApiUrl + '/graph/getDownStreamAllAssetType/',//获取下游资产类型
    queryUpNoRelatedAssets:currentApiUrl +'/asset/true/patternGraph/',//获取上游资产
    queryDownNoRelatedAssets:currentApiUrl + '/asset/true/patternGraph/',//获取下游资产
    queryAssetsById:currentApiUrl + '/graph/',//根据UUID去查询详情
    addAttach:currentApiUrl +　'/asset/asset-type/',//附件修改
    queryAssetNoGraph: currentApiUrl+ '/asset/patternGraph/queryAssetNoGraph',
    assetStart: currentApiUrl + '/asset', // 以asset开头的接口
    assetGraphStart: currentApiUrl + '/graph/asset-graph', // 以asset开头的接口
    assetConnectStart: currentApiUrl + '/graph/asset-connect', // 以asset开头的接口
    saveAsset:{
        order:currentApiUrl + "/asset/saveAsset/TRADEORDER", //添加订单
        dlvr:currentApiUrl + "/asset/saveAsset/TRADEDLVRGOODS",//添加发货单
        receive: currentApiUrl + "/asset/saveAsset/TRADERECVGGOODS",//添加收货单
        settlement: currentApiUrl + "/asset/saveAsset/TRADESETTLEMENT",//添加结算单
    },
    saveAsset2:currentApiUrl + "/asset/saveAsset/",//添加保存
    queryBusiness:currentApiUrl + '/org-info/query',//企业查询
    deleteBusiness:currentApiUrl + '/org-info/delete',//删除企业
    saveBusiness:currentApiUrl + '/org-info/save',//添加企业
    getStatistic:currentApiUrl + '/asset/statistic',//首页获取统计数据
    confirmRecvgGoods:currentApiUrl + '/asset/confirmRecvgGoods/by',//单条确认收货
    confirmRecvgGoodsByBatch:currentApiUrl + '/asset/confirmRecvgGoodsByBatch',//批量确认收货
    getPatternGraphInfos:currentApiUrl + '/pattern-graph-infos/get',//获取业务类型
    createAssetGraph:currentApiUrl + '/asset-graph/create',//创建
    updateAsset:currentApiUrl +　'/asset/updateAsset',//编辑合同
    sumTotalAmount:currentApiUrl + '/asset/sumTotalAmount',//查询总额
    queryEagleCoinListBySettlement:currentApiUrl + '/asset/queryEagleCoinListBySettlement/',//根据结算单查询山鹰币
}
