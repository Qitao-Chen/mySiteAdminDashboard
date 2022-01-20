<template>
  <div class="app-container">
    <!-- article title -->
    <div class="block">Blog Title</div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="form.title"
        placeholder="Please input Blog Title"
      ></el-input>
    </div>
    <!-- editor -->
    <div class="block">Blog Editor</div>
    <Editor
      :options="editorOptions"
      ref="toastuiEditor"
      :initialValue="form.editorText"
      height="600px"
    />
    <!-- blog description -->
    <div class="block">Blog Description</div>
    <el-input type="textarea" rows="6" v-model="form.description"></el-input>
    <!-- blog header image -->
    <UploadImg
      class="block"
      uploadTitle="Header Image (optional)"
      v-model="form.thumb"
    />
    <!-- blog category -->
    <div class="block">Blog Category</div>
    <el-select v-model="form.categoryValue" placeholder="Select">
      <el-option
        v-for="item in blogCategories"
        :key="item.id"
        :label="item.label"
        :value="item.id"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{
          item.value
        }}</span>
      </el-option>
    </el-select>
    <div class="block">
      <el-button type="primary" style="margin-top: 15px" @click="handleSubmit"
        >Post</el-button
      >
    </div>
  </div>
</template>

<script>
// https://www.npmjs.com/package/@toast-ui/vue-editor 'toast ui for vue 文档'
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import { Editor } from "@toast-ui/vue-editor";
import UploadImg from "@/components/UploadImg";
import { getBlogType } from "@/api/blogType.js";
import { addNewBlog, editBlog, findBlogById } from "@/api/blog.js";
export default {
  props: ["model"],
  components: {
    Editor,
    UploadImg,
  },
  data() {
    return {
      editorOptions: {
        // set toast editor task bar language
        language: "zh-CN",
      },
      form: {
        title: "",
        editorText: "",
        description: "",
        thumb: "",
        categoryValue: "",
      },
      blogCategories: [
        // {
        //   value: "JavaScript",
        //   label: "JavaScript",
        // },
        // {
        //   value: "HTML",
        //   label: "HTML",
        // },
      ],
    };
  },
  created() {
    if (this.model === "addBlog") {
      this.renderCategoryItems();
    } else if (this.model === "editBlog") {
      this.renderCategoryItems();
      this.renderBlogInfo(this.$route.params.id);
    }
  },
  methods: {
    //edit blog need
    async renderBlogInfo(id) {
      const res = await findBlogById(id);
      //exchange name
      //fill back all need data
      let {
        title,
        description,
        thumb,
        htmlContent: editorText,
        category: categoryValue,
      } = res.data;
      console.log(res.data);
      this.form = {
        title: title,
        editorText: editorText,
        description: description,
        thumb: thumb,
        categoryValue: categoryValue ? categoryValue.id : "",
      };
      //fill back Toast ui content
      this.$refs.toastuiEditor.invoke("setHTML", this.form.editorText);
    },
    //add and edit blog need
    async renderCategoryItems() {
      // console.log(this.form.blogCategories.push(1));
      // console.log(this.form.blogCategories);
      const res = await getBlogType();

      for (const item of res.data) {
        this.blogCategories.push({
          value: item.name,
          label: item.name,
          id: item.id,
        });
      }
      console.log(this.blogCategories);
    },
    handleSubmit() {
      // according to Toast Ui documents at  NPM 'TOAST UI Editor for Vue'.
      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markDown = this.$refs.toastuiEditor.invoke("getMarkdown");
      // create new blog data according to the back-end required. only need give a [] for 'toc'.
      const blogFormData = {
        title: this.form.title,
        description: this.form.description,
        createDate: Date.now(),
        categoryId: this.form.categoryValue,
        toc: [],
        htmlContent: html,
        thumb: this.form.thumb,
      };
      // check whether the data meets requirements. 'thumb' is optional
      if (
        blogFormData.title &&
        blogFormData.description &&
        blogFormData.createDate &&
        blogFormData.categoryId &&
        blogFormData.htmlContent
      ) {
        if (this.model === "addBlog") {
          addNewBlog(blogFormData).then((res) => {
            this.$message.success("Add Blog Successfully");
            this.$router.push("./blogList");
          });
        } else if (this.model === "editBlog") {
          editBlog(this.$route.params.id, blogFormData).then((res) => {
            this.$message.success("Edit Blog Successfully");
            this.$router.push("../blogList");
          });
        }
      } else {
        this.$message.error("Please Fill In All Blanks");
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.block {
  color: grey;
  margin: 15px 0;
  font-size: 20px;
  font-weight: 100;
  margin-bottom: 25px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>