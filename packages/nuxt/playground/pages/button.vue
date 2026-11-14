<template>
    <ShowcaseContainer>
        <!-- Button Colors -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Button Colors
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Three color variants: primary, secondary, and transparent.
            </p>
            
            <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })">
                <WfButton label="Primary Button" color="primary" />
                <WfButton label="Secondary Button" color="secondary" />
                <WfButton label="Transparent Button" color="transparent" />
            </div>
        </div>

        <!-- Button Sizes -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Button Sizes
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Three size variants: sm, md (default), and lg.
            </p>
            
            <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap', alignItems: 'center' })">
                <WfButton label="Small Button" size="sm" color="primary" />
                <WfButton label="Medium Button" size="md" color="primary" />
                <WfButton label="Large Button" size="lg" color="primary" />
            </div>
        </div>

        <!-- Button Types -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Button Types
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Buttons can have different types: button (default), submit, and reset.
            </p>
            
            <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })">
                <WfButton label="Button Type" type="button" color="primary" />
                <WfButton label="Submit Type" type="submit" color="primary" />
                <WfButton label="Reset Type" type="reset" color="secondary" />
            </div>
        </div>

        <!-- Button as Link -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Button as Link
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                When the "to" prop is provided, the button renders as an anchor tag.
            </p>
            
            <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })">
                <WfButton label="Internal Link" to="/hero" color="primary" />
                <WfButton label="External Link" to="https://example.com" :external="true" color="secondary" />
            </div>
        </div>

        <!-- Disabled State -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Disabled State
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Buttons can be disabled to prevent user interaction.
            </p>
            
            <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })">
                <WfButton label="Disabled Primary" color="primary" :disabled="true" />
                <WfButton label="Disabled Secondary" color="secondary" :disabled="true" />
                <WfButton label="Disabled Transparent" color="transparent" :disabled="true" />
            </div>
        </div>

        <!-- All Combinations Grid -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                All Color and Size Combinations
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Complete matrix of all color and size variants.
            </p>
            
            <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'lg' })">
                <!-- Primary -->
                <div>
                    <h3 :class="css({ fontSize: 'lg', fontWeight: 'semibold', marginBottom: 'sm' })">
                        Primary
                    </h3>
                    <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap', alignItems: 'center' })">
                        <WfButton label="Small" size="sm" color="primary" />
                        <WfButton label="Medium" size="md" color="primary" />
                        <WfButton label="Large" size="lg" color="primary" />
                    </div>
                </div>

                <!-- Secondary -->
                <div>
                    <h3 :class="css({ fontSize: 'lg', fontWeight: 'semibold', marginBottom: 'sm' })">
                        Secondary
                    </h3>
                    <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap', alignItems: 'center' })">
                        <WfButton label="Small" size="sm" color="secondary" />
                        <WfButton label="Medium" size="md" color="secondary" />
                        <WfButton label="Large" size="lg" color="secondary" />
                    </div>
                </div>

                <!-- Transparent -->
                <div>
                    <h3 :class="css({ fontSize: 'lg', fontWeight: 'semibold', marginBottom: 'sm' })">
                        Transparent
                    </h3>
                    <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap', alignItems: 'center' })">
                        <WfButton label="Small" size="sm" color="transparent" />
                        <WfButton label="Medium" size="md" color="transparent" />
                        <WfButton label="Large" size="lg" color="transparent" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Buttons in Card -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Buttons in Context
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Buttons composed with other components in real-world scenarios.
            </p>
            
            <WfCardRoot>
                <WfCardBody>
                    <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'md' })">
                        <h3 :class="css({ fontSize: 'xl', fontWeight: 'bold' })">
                            Action Required
                        </h3>
                        <p :class="css({ color: 'text.muted' })">
                            Please confirm your email address to continue using our service. Check your inbox for a verification link.
                        </p>
                        <div :class="css({ display: 'flex', gap: 'sm', justifyContent: 'flex-end' })">
                            <WfButton label="Remind Me Later" color="transparent" size="sm" />
                            <WfButton label="Resend Email" color="secondary" size="sm" />
                            <WfButton label="Verify Now" color="primary" size="sm" />
                        </div>
                    </div>
                </WfCardBody>
            </WfCardRoot>
        </div>

        <!-- Button Group Patterns -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Button Group Patterns
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Common button grouping patterns for forms and actions.
            </p>
            
            <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'lg' })">
                <!-- Primary + Secondary -->
                <div>
                    <h4 :class="css({ fontSize: 'md', fontWeight: 'semibold', marginBottom: 'sm' })">
                        Primary with Secondary
                    </h4>
                    <div :class="css({ display: 'flex', gap: 'sm' })">
                        <WfButton label="Cancel" color="secondary" />
                        <WfButton label="Continue" color="primary" />
                    </div>
                </div>

                <!-- Multiple Actions -->
                <div>
                    <h4 :class="css({ fontSize: 'md', fontWeight: 'semibold', marginBottom: 'sm' })">
                        Multiple Actions
                    </h4>
                    <div :class="css({ display: 'flex', gap: 'sm', flexWrap: 'wrap' })">
                        <WfButton label="Save Draft" color="transparent" />
                        <WfButton label="Preview" color="secondary" />
                        <WfButton label="Publish" color="primary" />
                    </div>
                </div>

                <!-- Full Width -->
                <div>
                    <h4 :class="css({ fontSize: 'md', fontWeight: 'semibold', marginBottom: 'sm' })">
                        Full Width
                    </h4>
                    <WfButton 
                        label="Continue to Payment" 
                        color="primary" 
                        size="lg"
                        full-width
                    />
                </div>
            </div>
        </div>

        <!-- Interactive Demo -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Interactive Demo
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Click the buttons below to see console output.
            </p>
            
            <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })">
                <WfButton 
                    label="Click Me" 
                    color="primary" 
                    @click="handleClick('Primary button clicked!')"
                />
                <WfButton 
                    label="Click Me Too" 
                    color="secondary" 
                    @click="handleClick('Secondary button clicked!')"
                />
                <WfButton 
                    label="I'm Disabled" 
                    color="primary" 
                    :disabled="true"
                    @click="handleClick('This should not appear')"
                />
            </div>
            
            <p 
                v-if="clickMessage" 
                :class="css({ 
                    marginTop: 'md', 
                    padding: 'md', 
                    bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' },
                    borderRadius: 'md',
                    fontSize: 'sm'
                })"
            >
                {{ clickMessage }}
            </p>
        </div>
    </ShowcaseContainer>
</template>

<script setup lang="ts">
import { css } from 'styled-system/css';
import { ref } from 'vue';

const clickMessage = ref<string | null>(null);

const handleClick = (message: string) => {
    console.log(message);
    clickMessage.value = message;
    setTimeout(() => {
        clickMessage.value = null;
    }, 3000);
};
</script>
