<template>
  <div class="app-container">
    <!-- search bar  -->
    <div style="margin-top: 15px">
      <div class="input-container">
        <el-input
          placeholder="Please input blog type, and select the priority in the left dropdown menu "
          v-model="input1"
          class="input-with-select blog-input"
        >
          <el-select
            v-model="select"
            slot="prepend"
            placeholder="Select"
            class="select-blogType-box"
          >
            <el-option label="🌟" value="1"></el-option>
            <el-option label="🌟🌟" value="2"></el-option>
            <el-option label="🌟🌟🌟" value="3"></el-option>
            <el-option label="🌟🌟🌟🌟" value="4"></el-option>
            <el-option label="🌟🌟🌟🌟🌟" value="5"></el-option>
          </el-select>
        </el-input>
        <el-button
          style="margin-left: 4px"
          icon="el-icon-check"
          type="success"
          @click="handleAddBlogType(select, input1)"
        ></el-button>
      </div>
    </div>
    <!-- table -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="Index" width="100" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Blog Type" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
          <!-- <el-popover trigger="hover" placement="top">
            <p>Name: {{ scope.row.name }}</p>
            <p>Addr: {{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover> -->
        </template>
      </el-table-column>
      <el-table-column label="Article Number" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.articleCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Priority" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            numToStar(scope.row.order)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operations" width="200" align="center">
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
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="Edit"
            placement="top"
            :hideAfter="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Shipping address" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Blog Type" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Priority" :label-width="formLabelWidth">
          <el-select
            v-model="form.order"
            placeholder="Please select a Priority"
          >
            <el-option label="🌟" value="1"></el-option>
            <el-option label="🌟🌟" value="2"></el-option>
            <el-option label="🌟🌟🌟" value="3"></el-option>
            <el-option label="🌟🌟🌟🌟" value="4"></el-option>
            <el-option label="🌟🌟🌟🌟🌟" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm()">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBlogType,
  deleteBlogType,
  changeBlogType,
  getBlogType,
} from "@/api/blogType.js";
export default {
  data() {
    return {
      form: { name: "", order: "" },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      input1: "",
      select: "",
      listLoading: false,
      data: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    numToStar(num) {
      const star = ["🌟", "🌟🌟", "🌟🌟🌟", "🌟🌟🌟🌟", "🌟🌟🌟🌟🌟"];
      return star[num - 1];
    },
    async fetchData() {
      this.listLoading = true;
      const res = await getBlogType();
      this.listLoading = false;
      this.data = res.data;
    },
    handleEdit(index, data) {
      this.form = { ...data };
      this.dialogFormVisible = true;
    },
    handleConfirm() {
      const newBlogTypeInfo = {
        id: this.form.id,
        data: {
          name: this.form.name,
          order: this.form.order,
        },
      };
      changeBlogType(newBlogTypeInfo).then((res) => {
        this.fetchData();
        this.$message({
          type: "success",
          message: "Successfully Changed! ",
        });
      });
      this.dialogFormVisible = false;
    },
    handleDelete(index, data) {
      this.$confirm(
        "This will permanently delete the Blog Type. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          deleteBlogType(data.id).then(() => {
            this.$message({
              type: "success",
              message: "Delete completed",
            });
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled",
          });
        });

      console.log(index, data);
    },
    handleAddBlogType(priorityVal, inputVal) {
      if (priorityVal && inputVal) {
        addBlogType({
          name: inputVal,
          order: priorityVal,
        }).then((res) => {
          this.$message({
            type: "success",
            message: "Successfully Added! ",
          });
          this.fetchData();
        });
      } else {
        if (!priorityVal && !inputVal) {
          //priority and input both empty
          this.$message({
            type: "warning",
            message: "Please select priority and input blog type",
          });
        } else if (!priorityVal) {
          //priority empty
          this.$message({
            type: "warning",
            message: "Please select priority",
          });
        } else {
          //input empty
          this.$message({
            type: "warning",
            message: "Please input blog type",
          });
        }
      }
    },
  },
};
</script>

<style lang="sass" scoped>
button.check-button
  display: block
  color: white
  background-color: #67C23A
.input-container
  width: 100%
  transform: translateX(25%)
.blog-input
  margin-bottom: 15px
  width: 50%
  // left: 50%
  // transform: translateX(-50%)
.select-blogType-box
  width: 110px
</style>