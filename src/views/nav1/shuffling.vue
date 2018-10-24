<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" v-on:click="addVideoButton">添加轮播</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="轮播图类型" :label-width="formLabelWidth">
                    <el-select v-model="form.shufflingType" placeholder="请选择轮播图类型">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                        :label-width="formLabelWidth"
                        label="视频名称"
                        :prop="videoName"
                        v-show="form.shufflingType===0" prop="videoName">
                    <el-input v-model="form.videoName" autocomplete="off" style="width: 300px"></el-input>
                    <el-button @click.prevent="queryVideoByName(form.videoName)" type="primary"> 查询视频</el-button>
                </el-form-item>

                <el-form-item label="轮播图连接" :label-width="formLabelWidth" prop="adCoverImage">
                    <el-input v-model="form.adCoverImage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="或上传轮播图" :label-width="formLabelWidth" prop="">
                    <el-upload
                            class="upload-demo"
                            :before-upload="beforeupload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-error="uploadError"
                            :on-success="handleAvatarSuccess"
                            action="http://localhost:8080/file/img/upload"
                            :file-list="fileImageList"
                            list-type="picture">
                        <el-button size="small" type="primary" :disabled="!isButtonDisable">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="轮播图标题" :label-width="formLabelWidth" prop="adTitle">
                    <el-input v-model="form.adTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="点击跳转连接" :label-width="formLabelWidth" prop="adJumpUrl">
                    <el-input v-model="form.adJumpUrl" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="视频播放地址" :label-width="formLabelWidth" prop="videoPlayUrl">
                    <el-input v-model="form.videoPlayUrl" autocomplete="off"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addShuffling('form')">确 定</el-button>
            </div>
        </el-dialog>

        <!--列表-->
        <template>
            <el-table :data="tables" highlight-current-row v-loading="loading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="shufflingType" label="轮播类型" width="200" sortable :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <p v-if="scope.row.shufflingType=='0'">
                            视频
                        </p>
                        <p v-if="scope.row.shufflingType=='1'">
                            广告
                        </p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="封面图片"
                        prop="adCoverImage"
                        sortable
                        width="150">
                    <template slot-scope="scope">
                        <div style="padding: 10px">
                            <img :src="scope.row.adCoverImage" alt="" style="width: 50px;height: 30px"
                                 class="head_pic">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="adJumpUrl" label="跳转地址链接" width="400" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="adTitle" label="轮播标题" width="400" sortable
                                 :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>

    </section>
</template>
<script>
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                loading: false,
                tables: [],
                fileImageList: [],
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogTitle: "添加轮播",
                totalPage: 0,
                isButtonDisable: true,
                videoId: "",
                videoName: "",
                imgData: {
                    url: "",
                    uid: ""
                },
                form: {
                    shufflingType: 0,
                    videoId: "",
                    adCoverImage: "",
                    adJumpUrl: "",
                    adTitle: "",
                    id: "",
                    videoName: "",
                    uploadImageCover: ""
                }, rules: {
                    shufflingType: [
                        {required: true, message: '请输入视频名称', trigger: 'blur'},
                        {min: 1, max: 128, message: '', trigger: 'blur'}
                    ],
                    adCoverImage: [
                        {type: 'url', required: true, message: '请填写图片链接:http/https://**.***'}
                    ],
                    adTitle: [
                        {required: true, message: '请填标题'}
                    ]
                },
                formLabelWidth: '120px',
                options: [],
            }
        },
        methods: {
            uploadError: function (data) {
                console.log(data)
            }, handleAvatarSuccess: function (data) {
                if (data.success) {
                    this.form.uploadImageCover = data.data.url;
                    this.fileImageList.length = 0;
                    this.fileImageList.push(data.data);
                    this.$utils.showSuccess("上传成功");
                    this.isButtonDisable = false
                } else {
                    this.$utils.showError(data.msg)
                }

            }, beforeupload: function () {

            }, handleRemove: function () {
                this.form.uploadImageCover = "";
                this.isButtonDisable = true
            }, handlePreview: function () {

            },
            addVideoButton: function () {
                this.fileImageList = [];
                this.form = {
                    shufflingType: 0,
                    videoId: "",
                    adCoverImage: "",
                    adJumpUrl: "",
                    adTitle: "",
                    id: "",
                    videoName: "",
                    uploadImageCover: ""
                };
                this.imgData = {
                    url: "",
                    uid: ""
                };
                this.isButtonDisable = true;
                this.form.uploadImageCover = "";
                this.dialogFormVisible = true
            },
            addShuffling: function (form) {
                if (this.form.shufflingType === 0 && this.form.videoId == "null") {
                    this.$utils.showError("请先输入视频并点击查询");
                    return
                }
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (this.form.uploadImageCover !== "") {
                            this.form.adCoverImage = this.form.uploadImageCover;
                        }
                        this.$http.addShuffling(this.form).then((res) => {
                            if (res.success) {
                                this.$utils.showSuccess("操作成功");
                                this.dialogFormVisible = false;
                                this.queryShuffling()
                            } else {
                                this.$utils.showError(res.msg);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }, deleteVideo() {

            }, queryVideoByName: function (videoName) {
                if (videoName === "") {
                    this.$utils.showError("请填写视频名称");
                    return
                }
                this.$http.queryVideoByName(videoName).then((data) => {
                    if (data.success) {
                        this.form.videoId = data.data.id
                    } else {
                        this.$utils.showError(data.msg);
                        this.form.videoName = ""
                    }
                })
            },
            handleEdit: function (index, row) {
                console.log(row);
                this.form = {
                    shufflingType: 0,
                    videoId: "",
                    adCoverImage: "",
                    adJumpUrl: "",
                    adTitle: "",
                    id: "",
                    videoName: "",
                    uploadImageCover: ""
                };
                this.form = row;
                this.form.uploadImageCover = row.adCoverImage;
                this.imgData.uid = row.id;
                this.imgData.url = row.adCoverImage;
                this.fileImageList.length = 0;
                this.fileImageList.push(this.imgData);
                this.isButtonDisable = false;
                this.dialogFormVisible = true
            }, handleDelete: function (index, row) {
                this.$confirm('此操作将永久删除数据, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.deleteShuffling(row.id).then((data) => {
                        if (data.success) {
                            this.$utils.showSuccess("删除成功");
                            this.queryShuffling()
                        } else {
                            this.$utils.showError(data.msg);
                        }

                    })
                });
            }, queryShuffling() {
                this.$http.queryShuffling().then((data) => {
                    if (data.success) {
                        this.tables = data.data;
                    } else {
                        this.$utils.showError(data.msg)
                    }
                })
            }
        },
        mounted() {
            this.queryShuffling();
            this.$http.getConfig().then((data) => {
                this.options = data.data.shufflingType
            })
        }
    };

</script>

<style scoped>

</style>