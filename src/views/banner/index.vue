<template>
  <div class="app-container">
    <!-- table -->
    <template>
      <el-table :data="data" style="width: 100%" border>
        <el-table-column label="index" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="Title" width="150">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Description" width="180">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column label="midImg" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px"
              :src="scope.row.midImgHttp"
              fit="cover"
              :preview-src-list="[...scope.row.midImgHttp]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="bigImg" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px"
              :src="scope.row.bigImgHttp"
              :preview-src-list="[...scope.row.bigImgHttp]"
              fit="cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="Operation" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="Edit"
              placement="top"
              :hideAfter="2000"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                @click="editBannerHandle(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- pop up window -->
    <el-dialog title="Home Page Editor" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <!-- title -->
        <el-form-item label="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <!-- description -->
        <el-form-item label="Description" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <div class="imgArea">
          <!-- middle image -->
          <UploadImg uploadTitle="Mid Image" v-model="form.midImg" />

          <!-- big image -->
          <UploadImg uploadTitle="Big Image" v-model="form.bigImg" />
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">Confirm</el-button>
      </span>
    </el-dialog>
    <!-- <CustomModel2 :value="initVal" @changeNumber="initVal = $event" /> -->
    <CustomModel2 v-model="initVal" />
  </div>
</template>

<script>
import { getBanner, setBanner } from "@/api/banner.js";
import { server_URL } from "@/urlConfig.js";
import UploadImg from "@/components/UploadImg";

import CustomModel2 from "@/components/CustomModel2";
export default {
  components: {
    UploadImg,
    CustomModel2,
  },
  data() {
    return {
      initVal: 0,
      data: [],
      form: { title: "", description: "", id: "", midImg: "", bigImg: "" },
      dialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleSendData() {
      console.log(this.searchText);
      console.log("🟢 SENDING DATA.....");
    },
    async fetchData() {
      const res = await getBanner();
      this.data = res.data;

      for (var item of this.data) {
        item.midImgHttp = server_URL + item.midImg;
        item.bigImgHttp = server_URL + item.bigImg;
      }
    },
    editBannerHandle(info) {
      this.form = { ...info };
      // this.form.midImg = server_URL + this.form.midImg;
      // this.form.bigImg = server_URL + this.form.bigImg;
      this.dialogFormVisible = true;
    },
    handleConfirm() {
      //从表单拿到用户修改的数据发送给服务器，根据api要求三个首页标语(并不需要headers)都需要发过去，所以先处理表单数据
      let arr = [...this.data];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == this.form.id) {
          arr[i] = this.form;
        }
      }

      setBanner(arr).then((res) => {
        this.dialogFormVisible = false; //关闭对话框
        console.log(res);
        //成功提示
        this.$message({
          message: "success changed",
          type: "success",
        });
        //重新获取数据
        this.fetchData();
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.imgArea {
  display: flex;
  justify-content: space-around;
}
/* td.el-table_1_column_4,
td.el-table_1_column_5,
td.el-table_1_column_6 {
  text-align: center;
} */
</style>