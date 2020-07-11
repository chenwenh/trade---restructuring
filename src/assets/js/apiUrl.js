
/* eslint-disable */
export let apiUrl = {
    loginUrl: apiGateway + '/auth/api/v1.0/token/new',
    queryContract:currentApiUrl + '/asset/query',//合同查询
    orguserList:apiGateway + '/orguser/org/v1.0/list',//获取企业列表
    orguserDetail:apiGateway + '/orguser/org/v1.0/detail/',//根据id去查询详情
    fileQuery:apiGateway + '/files/file/query/',//文件预览
    businessAuthorize:currentApiUrl,//企业授权
    tradeAuthQuery:currentApiUrl+ '/auth/query',//已授权企业查询
    querySettlementByContract:currentApiUrl + '/asset/querySettlementByContract',//根据合同查询结算单
    pushFullAssetPackage:currentApiUrl + '/asset/pushFullAssetPackage',//合同下的结算单推送
    getAssetGraphUuid:currentApiUrl + '/graph/pattern-graph/asset-graph-uuid/',//获取patterenGraphUuid
    getUpStreamAllAssetType:currentApiUrl +　'/graph/getUpStreamAllAssetType/',//获取上游资产类型
    getDownStreamAllAssetType:currentApiUrl + '/graph/getDownStreamAllAssetType/',//获取下游资产类型
    queryUpNoRelatedAssets:currentApiUrl +'/asset/true/patternGraph/',//获取上游资产
    queryDownNoRelatedAssets:currentApiUrl + '/asset/true/patternGraph/',//获取下游资产
    queryAssetsById:currentApiUrl + '/graph/',//根据UUID去查询详情
}
