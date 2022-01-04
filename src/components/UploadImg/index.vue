<template>
  <div class="uploadImg-container">
    <!-- 上传组件标题 -->
    <div class="block">{{ uploadTitle }}</div>
    <!-- 上传控件 -->
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :headers="header"
      :show-file-list="true"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="value" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { server_URL } from "@/urlConfig.js";
export default {
  props: ["uploadTitle", "value"],
  computed: {
    imageUrl() {
      if (this.value) {
        return server_URL + this.value;
      }
    },
    header() {
      console.log(localStorage.getItem("adminToken"));
      return {
        Authorization: "Bearer " + localStorage.getItem("adminToken"), //从本地获取token 添加到header里面。"Bearer "需要空格！！！
        // "Content-Type": " multipart/from-data",
      };
    },
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log("successed", res, file);
      // this.imageUrl = URL.createObjectURL(file.raw);
      if (!res.code && res.data) {
        this.$emit("input", res.data);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      //config.default.js里面修改服务器接受尺寸
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log(file.size / 1024 / 1024);
      if (!isJPG) {
        this.$message.error("Avatar picture must be JPG format!");
      }
      if (!isLt2M) {
        this.$message.error("Avatar picture size can not exceed 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>