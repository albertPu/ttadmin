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
                    <el-button type="primary" v-on:click="getVidoes">查询</el-button>
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

                <el-form-item label="封面图片链接" :label-width="formLabelWidth" prop="coverImageUrl">
                    <el-input v-model="form.coverImageUrl" autocomplete="off"></el-input>

                </el-form-item>

                <el-form-item label="或上传封面" :label-width="formLabelWidth" prop="">
                    <el-upload
                            class="upload-demo"
                            :before-upload="beforeupload"
                            drag
                            :on-error="uploadError"
                            :on-success="handleAvatarSuccess"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            style="margin-left:80px;">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addVideo('form')">确 定</el-button>
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
                <el-table-column prop="coverImageUrl" label="封面图片链接" width="300" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="videoPlayUrl" label="视频地址链接" width="300" sortable :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="discussNumber" label="评论数" width="100" sortable>
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
                videos: [],
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogTitle: "添加视频",
                totalPage: 0,
                deleteId: '',
                query: {
                    queryVideoType: 0,
                    queryVideoName: '',
                    currentPage: 1
                },
                form: {
                    videoName: '',
                    coverImageUrl: '',
                    videoPlayUrl: '',
                    desc: '',
                    discussNumber: '',
                    addVideoType: 0,
                    typeName: ''
                }, rules: {
                    videoName: [
                        {required: true, message: '请输入视频名称', trigger: 'blur'},
                        {min: 1, max: 128, message: '', trigger: 'blur'}
                    ],
                    coverImageUrl: [
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
                options: [{
                    value: 0,
                    label: '国产'
                }, {
                    value: 1,
                    label: '欧美'
                }, {
                    value: 2,
                    label: '其他'
                }],
            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            }, uploadError: function () {

            }, handleAvatarSuccess: function () {

            }, beforeupload: function () {

            },
            addVideoButton: function () {
                this.form = {
                    videoName: '',
                    coverImageUrl: '',
                    videoPlayUrl: '',
                    desc: '',
                    discussNumber: '',
                    addVideoType: 0
                };
                this.dialogFormVisible = true
            },
            //获取用户列表
            getVidoes: function () {
                this.queryVideo()
            }
            , addVideo: function (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
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
            }, deleteVideo() {

            },
            handleEdit: function (index, row) {
                console.log(row);
                this.form = row;
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
            }, handleDiscuss: function () {

            }, handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
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
            }
        },
        mounted() {
            this.queryVideo();
        }
    };

</script>

<style scoped>

</style>