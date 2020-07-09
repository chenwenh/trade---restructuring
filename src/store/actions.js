
import appConst from '@/assets/js/appConst'
import http from '@/assets/js/http'
import { apiUrl } from '@/assets/js/apiUrl'
import global from '@/assets/js/global'

// 通过orgName 获取orgId
// export const GET_ORG_INFO = async function({ commit, state }, params) {
// 	let url = `${apiUrl.orguserList}`;
// 	let response = await http.get(url, { params: {orgName: params.orgName} })
// 	if(response.data.status === appConst.status) {
//         let orgId = {orgId: response.data.data[0].orgId}
//         return getOrgInfo(orgId, {commit, state})
// 	}
// }


// async function getOrgInfo(params, commit) {
// 	let url = `${apiUrl.orguserDetail}${params.orgId}`;
// 	let response = await http.get(url, {params})
// 	if(response.data.status === appConst.status) {
// 		let json = response.data.data;
// 		if (json["status"] === "PENDING" || json["status"] === "CONFIRMED") {
// 			commit.commit("SET_MY_ORGINFO", response.data.data)
//         } else {
//             global.errMsg("企业未通过审核，请通知管理员审核")
//             return
//         }
// 	}
// }