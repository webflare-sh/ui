<template>
  <ShowcaseContainer>
    <WfFieldInput
      name="emailAddress"
      label="E-Mail Adresse"
      placeholder="Gib deine E-Mail Adresse ein"
      type="email"
      message="This is a description message."
      error="This is an error message."
      :required="true"
    />

    <WfFieldInput
      id="login-password"
      name="password"
      label="Password"
      type="password"
      autocomplete="current-password"
      maxlength="64"
      placeholder="Enter a password"
      :required="true"
    />

    <WfFieldInput
      v-model="numberValue"
      name="quantity"
      label="Quantity"
      type="number"
      :required="true"
    />

    <WfFieldInput
      v-model="dateValue"
      name="date"
      label="Date"
      type="date"
    />

    <WfFieldUrl
      v-model="urlValue"
      name="website"
      label="Website"
      placeholder="example.com"
      :required="true"
    />

    <WfFieldTextarea
      v-model="textareaValue"
      name="message"
      label="Message"
      placeholder="Tell us more"
      :rows="4"
      :required="true"
    />

    <WfFieldSelect
      v-model="selectValue"
      name="topic"
      label="Topic"
      placeholder="Choose a topic"
      :options="selectOptions"
      :required="true"
    />

    <WfFieldCheckbox
      v-model="checkboxValue"
      name="terms"
      label="I accept the terms"
      :required="true"
    />

    <WfFieldRadioGroup
      v-model="radioValue"
      name="contact"
      label="Preferred contact"
      :options="radioOptions"
      :required="true"
    />

    <WfFieldSwitch
      v-model="switchValue"
      name="notifications"
      label="Enable notifications"
    />

    <WfFormPrompt
      id="formPrompt"
      action="/submit"
      method="post"
      name="formPrompt"
      aria-label="Form Prompt"
      placeholder="faf"
      @submit="onSubmit"
    >
      <template #footer>
        <WfFormPromptFooter>
          <template #inputs>
            <WfFieldInput
              id="name"
              name="name"
              label="Name"
              placeholder="Your full name"
              type="text"
              :required="true"
              :class="css({
                flex: '1',
                flexBasis: {
                  base: 'auto',
                },
              })"
            />

            <WfFieldInput
              name="email"
              label="E-Mail"
              placeholder="Your E-Mail address"
              type="email"
              :required="true"
              :class="css({
                flex: '1',
                flexBasis: { base: 'auto' },
              })"
            />
          </template>

          <template #action>
            <WfButton
              label="Submit"
              type="submit"
              color="primary"
              :class="css({
                width: '100%',
                '@container (min-width: 600px)': {
                  width: 'auto',
                },
              })"
            />
          </template>
        </WfFormPromptFooter>
      </template>
    </WfFormPrompt>
  </ShowcaseContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { css } from 'styled-system/css'

const numberValue = ref('')
const dateValue = ref('')
const urlValue = ref('https://localhost:3000/de')
const textareaValue = ref('')
const selectValue = ref('')
const checkboxValue = ref(false)
const radioValue = ref('')
const switchValue = ref(false)

const selectOptions = [
  { label: 'Sales', value: 'sales' },
  { label: 'Support', value: 'support' },
  { label: 'Partnership', value: 'partnership' },
]

const radioOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
]

const onSubmit = (form: HTMLFormElement | null) => {
  console.log('Form submitted:', form)
  if (form) {
    console.log(useFormData(form).getJson())
  }
}
</script>
