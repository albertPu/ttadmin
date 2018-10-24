<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="query.queryVideoName" placeholder="视频名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="query.queryVideoType" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getVideos">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="addVideoButton">添加视频</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="视频名称" :label-width="formLabelWidth" prop="videoName">
                    <el-input v-model="form.videoName" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="封面图片链接" :label-width="formLabelWidth" prop="uploadImageCover">
                    <el-input v-model="form.uploadImageCover" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="或上传封面" :label-width="formLabelWidth" prop="">
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

                <el-form-item label="视频播放地址" :label-width="formLabelWidth" prop="videoPlayUrl">
                    <el-input v-model="form.videoPlayUrl" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="评论数" :label-width="formLabelWidth" prop="discussNumber">
                    <el-input v-model="form.discussNumber" autocomplete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" prop="desc">
                    <el-input v-model="form.desc" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="form.addVideoType" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可观看vip等级" :label-width="formLabelWidth">
                    <el-select v-model="form.vipLevel" placeholder="请选择">
                        <el-option
                                v-for="item in vips"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addVideo('form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加评论" :visible.sync="discussDialogVisible">
            <el-form :model="discussForm" :rules="discussRules" ref="discussForm">
                <el-form-item label="评论内容:" :label-width="formLabelWidth" prop="discussContent">
                    <el-input v-model="discussForm.discussContent" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="评论者姓名:" :label-width="formLabelWidth" prop="disucsserName">
                    <el-input v-model="discussForm.disucsserName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="评论者头像URL:" :label-width="formLabelWidth" prop="disucsserHeadUrl">
                    <el-input v-model="discussForm.disucsserHeadUrl" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>

            <el-table
                    :data="discussTable"
                    height="250"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="disucsserHeadUrl"
                        label="评论者头像"
                        width="180">
                    <template slot-scope="scope">
                        <img :src="scope.row.disucsserHeadUrl"
                             style="border-radius:50%;padding: 10px;width: 50px;height: 50px"/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="disucsserName"
                        label="评论者姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        width="400"
                        prop="discussContent"
                        label="评论内容"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDisDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="discussDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDiscuss('discussForm')">确定添加</el-button>
            </div>
        </el-dialog>

        <!--列表-->
        <template>
            <el-table :data="videos" highlight-current-row v-loading="loading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="videoName" label="视频名称" width="200" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="typeName" label="类型" width="100" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        label="封面图片"
                        prop="coverImageUrl"
                        sortable
                        width="150">
                    <template slot-scope="scope">
                        <div style="padding: 10px">
                            <img :src="scope.row.coverImageUrl" alt="" style="width: 50px;height: 30px"
                                 class="head_pic">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="coverImageUrl" label="封面图片链接" width="200" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="videoPlayUrl" label="视频地址链接" width="200" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="discussNumber" label="评论数" width="100" sortable>
                </el-table-column>
                <el-table-column prop="vipLevel" label="Vip等级" width="200" sortable>
                    <template slot-scope="scope">
                        <p v-if="scope.row.vipLevel=='0'">
                            VIP0
                        </p>
                        <p v-else-if="scope.row.vipLevel=='1'">
                            VIP1
                        </p>
                        <p v-else-if="scope.row.vipLevel=='2'">
                            VIP2
                        </p>
                        <p v-else-if="scope.row.vipLevel=='3'">
                            VIP3
                        </p>
                        <p v-else-if="scope.row.vipLevel=='4'">
                            VIP4
                        </p>
                        <p v-else-if="scope.row.vipLevel=='5'">
                            VIP5
                        </p>
                        <p v-else-if="scope.row.vipLevel=='6'">
                            VIP6
                        </p>
                        <p v-else-if="scope.row.vipLevel=='7'">
                            VIP7
                        </p>
                        <p v-else-if="scope.row.vipLevel=='8'">
                            VIP8
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="添加评论">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleDiscuss(scope.$index, scope.row)">添加评论
                        </el-button>
                    </template>
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
            <div class="block pull-right">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="query.currentPage"
                        :page-sizes="[10]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalPage">
                </el-pagination>
            </div>
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
                videoId: "",
                videos: [],
                discussTable: [],
                fileImageList: [],
                dialogTableVisible: false,
                dialogFormVisible: false,
                discussDialogVisible: false,
                dialogTitle: "添加视频",
                totalPage: 0,
                deleteId: '',
                isButtonDisable: true,
                query: {
                    queryVideoType: 0,
                    queryVideoName: '',
                    currentPage: 1
                }, imgData: {
                    url: "",
                    uid: ""
                },
                form: {
                    videoName: '',
                    coverImageUrl: '',
                    videoPlayUrl: '',
                    desc: '',
                    discussNumber: '',
                    addVideoType: 0,
                    typeName: '',
                    uploadImageCover: "",
                    vipLevel: ""
                },
                rules: {
                    videoName: [
                        {required: true, message: '请输入视频名称', trigger: 'blur'},
                        {min: 1, max: 128, message: '', trigger: 'blur'}
                    ],
                    uploadImageCover: [
                        {type: 'url', required: true, message: '请填写图片链接:http/https://**.***'}
                    ],
                    videoPlayUrl: [
                        {type: 'url', required: true, message: '请填写视频链接:http/https://**.***'}
                    ],
                    discussNumber: [
                        {required: true, message: '请填视频评论数'}
                    ]
                },
                formLabelWidth: '120px',
                options: [],
                vips: [],
                discussForm: {
                    discussContent: "",
                    disucsserName: "",
                    disucsserHeadUrl: "",
                    videoId: ""
                },
                discussRules: {
                    discussContent: [
                        {required: true, message: '请填视频评论内容'}
                    ],
                    disucsserName: [
                        {required: true, message: '请填视频评者论昵称'}
                    ],
                    disucsserHeadUrl: [
                        {required: true, message: '请填视频评论者头像连接'}
                    ]
                }
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
                this.isButtonDisable = true
            }, handlePreview: function () {

            },
            addVideoButton: function () {
                this.fileImageList = [];
                this.form = {
                    videoName: '',
                    coverImageUrl: '',
                    videoPlayUrl: '',
                    desc: '',
                    discussNumber: '',
                    addVideoType: 0
                };
                this.imgData = {
                    url: "",
                    uid: ""
                };
                this.isButtonDisable = true;
                this.form.uploadImageCover = "";
                this.dialogFormVisible = true
            },
            //获取用户列表
            getVideos: function () {
                this.queryVideo()
            }, addVideo: function (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.form.coverImageUrl = this.form.uploadImageCover;
                        this.$http.addVideo(this.form).then((res) => {
                            if (res.success) {
                                this.$utils.showSuccess("操作成功");
                                this.dialogFormVisible = false;
                                this.queryVideo()
                            } else {
                                this.$utils.showError(res.msg);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }, confirmDiscuss(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$http.addDiscuss(this.discussForm).then((data) => {
                            if (data.success) {
                                this.handleLoadDiscuss(this.videoId)
                            } else {
                                this.$utils.showError(data.msg)
                            }
                        })
                    }
                })
            },
            handleEdit: function (index, row) {
                console.log(row);
                this.form = row;
                this.form.uploadImageCover = row.coverImageUrl;
                this.imgData.uid = row.id;
                this.imgData.url = row.coverImageUrl;
                this.fileImageList.length = 0;
                this.fileImageList.push(this.imgData);
                this.isButtonDisable = false;
                this.dialogFormVisible = true
            }, handleDelete: function (index, row) {
                this.deleteId = "";
                this.deleteId = row.id;
                this.$confirm('此操作将永久删除数据, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.deleteVideo(this.deleteId).then((data) => {
                        if (data.success) {
                            this.$utils.showSuccess("删除成功");
                            this.queryVideo()
                        } else {
                            this.$utils.showError(data.msg);
                        }
                    })
                });
            }, handleDiscuss: function (index, row) {
                this.discussForm = {
                    discussContent: "",
                    disucsserName: "",
                    disucsserHeadUrl: "",
                    videoId: ""
                };
                this.discussForm.videoId = row.id;
                this.videoId = row.id;
                this.discussDialogVisible = true;
                this.handleLoadDiscuss(this.videoId)
            }, handleSizeChange(val) {

            },
            handleCurrentChange(val) {
                query.currentPage = val;
                this.queryVideo()
            }, queryVideo() {
                this.$http.queryVideo(this.query).then((data) => {
                    if (data.success) {
                        this.videos = data.data.videos;
                        this.totalPage = data.data.totalPage
                    } else {
                        this.$utils.showError(data.msg)
                    }
                })
            }, getConfig: function () {
                this.$http.getConfig().then((data) => {
                    if (data.success) {
                        this.vips = data.data.vips;
                        this.options = data.data.types;
                    }
                })
            }, handleDisEdit: function (index, row) {

            }, handleDisDelete: function (index, row) {
                this.$confirm('此操作将永久删除数据, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.deleteDiscuss(row.id).then((data) => {
                        if (data.success) {
                            this.$utils.showSuccess("删除成功");
                            this.handleLoadDiscuss(this.videoId)
                        } else {
                            this.$utils.showError(data.msg);
                        }
                    })
                });
            }, handleLoadDiscuss: function (videoId) {
                this.$http.queryDiscuss(videoId).then((data) => {
                    if (data.success) {
                        this.discussTable = data.data
                    } else {
                        this.discussTable = [];
                        this.$utils.showError(data.msg)
                    }
                })
            }
        },
        mounted() {
            this.queryVideo();
            this.getConfig()
        },
    };

</script>

<style scoped>

</style>