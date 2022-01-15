<template>
  <form-create
    v-model="fapi"
    :rule="rule"
    :option="option"
    @submit="onSubmit"
  ></form-create>
</template>

<script>
import formCreate from "@form-create/element-ui";

export default {
  data () {
    return {
        fapi: null,
        rule: formCreate.parseJson('[{"type":"radio","field":"c2t5td89am1t","title":"单选框","info":"","effect":{"fetch":""},"options":[{"value":"1","label":"选项1"},{"value":"2","label":"选项2"}],"_fc_drag_tag":"radio","hidden":false,"display":true},{"type":"datePicker","field":"hjv5td89aqr2","title":"日期选择器","info":"","_fc_drag_tag":"datePicker","hidden":false,"display":true},{"type":"el-transfer","field":"ezj5td89av57","title":"穿梭框","info":"","props":{"data":[{"key":1,"label":"备选项 1","disabled":false},{"key":2,"label":"备选项 2","disabled":false},{"key":3,"label":"备选项 3","disabled":false},{"key":4,"label":"备选项 4","disabled":true},{"key":5,"label":"备选项 5","disabled":false},{"key":6,"label":"备选项 6","disabled":false},{"key":7,"label":"备选项 7","disabled":false},{"key":8,"label":"备选项 8","disabled":true},{"key":9,"label":"备选项 9","disabled":false},{"key":10,"label":"备选项 10","disabled":false},{"key":11,"label":"备选项 11","disabled":false},{"key":12,"label":"备选项 12","disabled":true},{"key":13,"label":"备选项 13","disabled":false},{"key":14,"label":"备选项 14","disabled":false},{"key":15,"label":"备选项 15","disabled":false}]},"_fc_drag_tag":"el-transfer","hidden":false,"display":true},{"type":"upload","field":"31u1m5oal37ra","title":"上传","info":"","props":{"action":"","onSuccess":"[[FORM-CREATE-PREFIX-function(e,t){t.url=e.data.url}-FORM-CREATE-SUFFIX]]"},"_fc_drag_tag":"upload","hidden":false,"display":true},{"type":"el-button","children":["按钮"],"_fc_drag_tag":"el-button","hidden":false,"display":true}]'),
        option: formCreate.parseJson('{"form":{"inline":false,"labelPosition":"right","size":"mini","labelWidth":"125px","hideRequiredAsterisk":false,"showMessage":true,"inlineMessage":false}}')
    }
  },
  methods: {
    onSubmit (formData) {
      console.log(FormData)
      //todo 提交表单
    }
  }
}
</script>