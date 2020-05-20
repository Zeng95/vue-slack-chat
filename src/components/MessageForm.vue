<template>
  <div class="message-form">
    <b-form autocomplete="off" @submit.prevent="save">
      <div class="ld ld-ring ld-spin"></div>

      <b-alert variant="danger" />

      <b-form-group
        :label="`@${currentUser.username}`"
        tooltip
        label-size="sm"
        label-for="input-message"
        label-class="text-muted mb-0"
        :state="messageState"
        :invalid-feedback="invalidFeedback"
      >
        <b-input-group>
          <b-form-input
            trim
            size="lg"
            name="message"
            id="input-message"
            v-model="form.text"
            placeholder="Message..."
          />

          <b-input-group-append>
            <b-btn type="submit" variant="primary" title="send message">
              <b-icon-cursor-fill />
            </b-btn>
            <b-btn class="text-white" variant="warning" title="upload photo">
              <b-icon-image-fill />
            </b-btn>
            <b-form-file v-model="form.file" plain hidden></b-form-file>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-form>

    <TheAlert
      :visible="alertShow"
      :message="alertMessage"
      :variant="alertVariant"
      @hideAlert="alertShow = !alertShow"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BIconImageFill, BIconCursorFill } from 'bootstrap-vue'
import TheAlert from '@/components/TheAlert'

export default {
  name: 'MessageForm',
  components: {
    TheAlert,
    BIconImageFill,
    BIconCursorFill
  },
  computed: {
    ...mapGetters('users', ['currentUser']),
    ...mapGetters('channels', ['currentChannel']),
    messageState() {
      if (!this.hasValidated) return null

      return this.form.text.length > 0 ? true : false
    },
    invalidFeedback() {
      return this.form.text.length > 0 ? '' : 'Please enter the message'
    }
  },
  data() {
    return {
      form: { text: '', file: null },
      hasValidated: false,

      alertShow: false,
      alertMessage: '',
      alertVariant: ''
    }
  },
  methods: {
    ...mapActions('messages', ['fetchAllMessages', 'createMessage']),
    async save() {
      try {
        this.hasValidated = true

        // 如果校验结果为 false 则退出函数
        if (!this.messageState) return false

        await this.createMessage({
          text: this.form.text,
          timestamp: window.firebase.firestore.FieldValue.serverTimestamp()
        })

        await this.fetchAllMessages()

        this.alertShow = true
        this.alertMessage = 'Send successfully'
        this.alertVariant = 'success'
      } catch (error) {
        this.alertShow = true
        this.alertMessage = error.message
        this.alertVariant = 'danger'
      } finally {
        // Reset message
        this.form.text = ''
        this.hasValidated = false
      }
    }
  }
}
</script>