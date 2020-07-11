<template>
	<div>
        <div style="margin-bottom:20px;">
            <protle-title-component>
                <span class="el-dialog__title">附件</span>
            </protle-title-component>
        </div>
		<el-upload
		    class="upload-demo"
		    :action="upload"
		    :beforeUpload="handleBeforeUpload"
		    :on-preview="handlePreview"
		    :on-remove="handleRemove"
		    :headers="headers"
		    :multiple="multiple"
		    :limit="limit"
		    :on-success="handleSuccess"
		    :file-list="fileList"
		    :accept="acceptNew"
		    drag
		    :show-file-list="showFileList"
		    >
		    <i class="el-icon-upload"></i>
		    <div class="el-upload__text">将文件拖到此处，或
				<em>点击上传</em>
	    	</div>
		    <br>
  			<div class="el-upload__tip" slot="tip">只能上传{{ acceptNew }}文件，且不超过30M</div>
		    <slot>
		    </slot>
		</el-upload>
		<show-file-detail ref="showFileDetail"></show-file-detail>
	</div>
</template>
<script>
    import protleTitleComponent from "@/components/protleTitleComponent";
	import showFileDetail from './showFileDetail.vue'
	export default {
		props: [],
		data() {
			return {
		        fileList: [],
		        fileArr: [],
				fileListData: [], // 详情回显
				uuid:"",
                acceptNew:'PDF,pdf',
                limit:100,
                multiple:true
			}
		},
		computed: {
			headers(){
		        return{
					"Authorization": sessionStorage.getItem("access_token"),
					"client_id":"pGCXRYBmkbDS88Yls6CNBaD8YkHK7QPzFHFlG1m8IPIgD6T3L98ZnO82q67kj8R1",
					"org_id": sessionStorage.getItem("orgId"),
                }
		    },
			upload(){
				return this.$apiUrl.uploadFileApi + '/'+ this.uuid;
			},
			showFileList: function() {
				return true;
			}
		},
		methods: {
			handleBeforeUpload(file) {				
		    	const isLt30M = file.size / 1024 / 1024 < 30    
                if(!isLt30M) {  
                    global.errMsg("上传文件大小不能超过 30MB!")
                    return
                }
               	return isLt30M
		    },
			handlePreview(file) {
				let IEPDF = this.$global.isAcrobatPDFPluginInstalled();
				var vm = this;
	        	if(IEPDF) {
					vm.$refs.showFileDetail.showFile(file);
	        	}else{
	        		this.$message.error("对不起,您还没有安装PDF阅读器软件呢,为了方便预览PDF文档,请选择安装！");
	        		location = 'http://ardownload.adobe.com/pub/adobe/reader/win/9.x/9.3/chs/AdbeRdr930_zh_CN.exe';
	        	}
			},
			handleRemove(file, fileList) {
                fileList.map((val, index) => {
                    if(val.fileId == file.fileId) {
                        fileList.splice(index,1);
                    }
                })
                this.fileList = fileList;
		    },
			handleSuccess(response, fileList, data) {
				 if(data.length) {
                    let arr = [];
                    arr.push(fileList);
                    this.handleFileData(arr)
                }
				this.uuid = this.$global.uuid(13,10);
			},
			handleFileData(file) {
				 file.map((val, index) => {
					let json = {};
					json.uid = val.uid;
					json.size=val.size;
					json.fileId = val.response.data.uuid;
					json.fileName = val.name;
					json.name = val.name;
					json.dataPoolURL = this.$appConst.fileQuery + val.response.data.filepath;
                    this.fileList.push(json);
				})
		    },
            getFile() {
                return this.fileList;
            },
            init(row) {
                var currentRow = Object.assign({},row);
                this.fileList = currentRow.attachments;
                this.fileList.map(item=>{
                    item.name = item.fileName;
                });
            }
		},
		created() {
			
		
		},
        mounted() {
            this.uuid = this.$global.uuid(13,10);
        },
		components:{
			showFileDetail,
            protleTitleComponent
		},
	}
</script>
<style>
	.el-upload,el-upload--text,.el-upload-dragger {
		width: 100%;
	}
</style>