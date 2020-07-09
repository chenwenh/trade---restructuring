
/* eslint-disable */
export let apiUrl = {
    loginUrl: apiGateway + '/auth/api/v1.0/token/new',
    queryContract:currentApiUrl + '/asset/query',//合同查询
    orguserList:apiGateway + '/orguser/org/v1.0/list',//获取企业列表
    orguserDetail:apiGateway + '/orguser/org/v1.0/detail/',//根据id去查询详情
    fileQuery:apiGateway + '/files/file/query/',//文件预览
    businessAuthorize:currentApiUrl,//企业授权
    tradeAuthQuery:currentApiUrl+ '/auth/query',//已授权企业查询
}
