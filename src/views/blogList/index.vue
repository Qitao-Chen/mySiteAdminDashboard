<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="Index" width="80" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.$index + (query.page - 1) * query.limit + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="Preview Image"
            trigger="hover"
          >
            <el-image
              style="width: 200px"
              :src="scope.row.thumbHTTP"
              fit="cover"
              :preview-src-list="[...scope.row.thumbHTTP]"
            ></el-image>
            <a
              href="#"
              target="_blank"
              @click.prevent="jumpToBlogDetailsHandle(scope.row)"
              style="margin-left: 10px"
              slot="reference"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Description">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ScanNumber" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.scanNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CommentNumber" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.commentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Category" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.category === null
              ? "No Category"
              : scope.row.category.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CreateDate" width="230" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
        </template> </el-table-column
      >px
      <el-table-column label="Operations" align="center" width="180px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            size="mini"
            circle
            @click="handleDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next,->,total,sizes"
      :total="totalBlog"
      :page-size="query.limit"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20]"
      align="center"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>


<script>
import { getBlogByPage, deleteBlog } from "@/api/blog.js";
import { formatDate } from "@/api/tools.js";
import { server_URL } from "@/urlConfig.js";
import { frontEnd_URL } from "@/urlConfig.js";

export default {
  data() {
    return {
      totalPageNumber: 1,

      currentPage: 1,
      paginationCurrentPage: 1,
      totalBlog: 1,
      data: [],
      query: {
        page: 1,
        limit: 5,
      },
    };
  },
  created() {
    this.fetchData(this.query);
  },
  methods: {
    async fetchData(query) {
      const res = await getBlogByPage(query);
      this.data = res.data.rows;
      for (const item of this.data) {
        item.createDate = formatDate(item.createDate);
        item.thumbHTTP = server_URL + item.thumb;
      }
      this.totalBlog = res.data.total;
      // this.totalPageNumber = Math.ceil(res.data.total / this.pageLimit);
      // console.log(this.totalPageNumber);
    },
    jumpToBlogDetailsHandle(info) {
      //跳转到具体的文章
      console.log(info);
      window.open(`${frontEnd_URL}article/${info.id}`);
    },
    handleEdit(index, info) {
      console.log(info.id);
      this.$router.push(`./editBlog/${info.id}`);
    },
    handleDelete(index, info) {
      this.$confirm(
        "This will permanently delete the file. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          deleteBlog(info.id).then((res) => {
            this.fetchData(this.query);
            this.$message({
              type: "success",
              message: "Delete completed",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
    //分页部分
    sizeChangeHandle(pageSize) {
      this.query.limit = pageSize;
      this.fetchData(this.query);
    },
    currentChangeHandle(pageNum) {
      this.query.page = pageNum;
      this.fetchData(this.query);
    },
    prevClickHandle() {
      this.currentPage--;
    },
    nextClickHandle() {
      this.currentPage++;
    },
  },
};
</script> 

<style scoped lang='scss'>
.el-pagination {
  margin-top: 20px;
}
</style>