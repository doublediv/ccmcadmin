<template>
    <div>
        <slot>上传证件照</slot>
        <div class="samll-img">
            <div v-show="havePic" class="picbox">
                <Avatar class="avatarPic" icon="person" shape="square" :src="picUrl" />
                <div class="handle-pic">
                    <Icon type="ios-eye-outline" @click.native="viewPic"></Icon>
                    <Icon type="ios-trash-outline" @click.native="removePic"></Icon>
                </div>
            </div>
            <Spin fix v-show="isSpin">
                <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
            </Spin>
            <Upload 
                v-show="isUplod" 
                class="upload"
                ref="upload"
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                type="drag"
                :before-upload="uploadBefore"
                :on-format-error="uploadFormatError"
                :on-exceeded-size="uploadMaxSize"
                :on-error="uploadError"
                :on-success="uploadSuccess"
                :data="fileType"
                action="http://192.168.1.149:8080/ccmc/upload_avatar">
                <Icon type="camera" size="20"></Icon>
            </Upload>
        </div>
        <Modal class-name="bigPic" width="360" title="查看图片" v-model="isView">
            <img :src="picUrl" alt="" />
        </Modal>
    </div>
</template>
<script>
export default {
  props: ["fileType"],
  data() {
    return {
      picUrl: "",
      havePic: false,
      isSpin: false,
      isUplod: true,
      isView: false,
      uploadType: 2
    };
  },
  methods: {
    viewPic() {
      this.isView = true;
    },
    removePic(file) {
      this.isUplod = "";
      this.havePic = false;
      this.isUplod = true;
    },
    uploadBefore() {
      this.isSpin = true;
      this.isUplod = false;
      return;
    },
    uploadFormatError(file) {
      this.isSpin = false;
      this.isUplod = true;
      this.$Notice.warning({
        title: "图片格式",
        desc: "图片" + file.name + "格式不对,请上传jpg/jpeg/png格式的图片"
      });
    },
    uploadMaxSize(file) {
      this.isSpin = false;
      this.isUplod = true;
      this.$Notice.warning({
        title: "图片大小",
        desc: "图片  " + file.name + " 过大, 请上传大小不超过2M的图片."
      });
    },
    uploadError(err) {
      this.isSpin = false;
      this.isUplod = true;
      this.$Notice.error({
        title: "上传结果",
        desc: "图片上传失败！"
      });
    },
    uploadSuccess(res, file) {
      
      let img = new Image();
      img.onload = () => {
        this.isSpin = false;
        this.havePic = true;
        this.picUrl = img.src;
        this.$emit("upSuccess", res.avatar_path);
      };
      img.src = "http://192.168.1.149:8080" + res.avatar_path;
    }
    
  }
};
</script>
<style lang="less" scoped>
.samll-img {
  position: relative;
  width: 58px;
  height: 58px;
  margin: 10px 0 24px;

  .picbox {
    width: 100%;
    height: 100%;

    .avatarPic {
      width: 100%;
      height: 100%;
    }

    .handle-pic {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 58px;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 4;
      display: none;

      i {
        font-size: 20px;
        color: #fff;
        margin: 0 2px;
        cursor: pointer;
      }
    }

    &:hover .handle-pic {
      display: block;
    }
  }

  .upload {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 58px;
  }
}
@keyframes ani-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spin-icon-load {
  animation: ani-spin 1s linear infinite;
}
</style>
<style lang="less">
.bigPic {
  img {
    width: 100%;
    display: block;
  }
}
</style>


