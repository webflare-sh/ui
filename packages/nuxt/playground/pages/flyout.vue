<template>
    <ShowcaseContainer>
        <!-- Basic Flyout -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Basic Flyout
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                A simple flyout that opens on hover with default left alignment.
            </p>
            
            <WfFlyoutRoot label="Hover me">
                <WfCardRoot>
                    <WfCardBody>
                        <div :class="css({ minWidth: '250px' })">
                            <h3 :class="css({ fontSize: 'lg', fontWeight: 'bold', marginBottom: 'sm' })">
                                Flyout Content
                            </h3>
                            <p :class="css({ fontSize: 'sm', color: 'text.muted' })">
                                This is a basic flyout that appears when you hover over the trigger.
                            </p>
                        </div>
                    </WfCardBody>
                </WfCardRoot>
            </WfFlyoutRoot>
        </div>

        <!-- Flyout with Custom Trigger -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Custom Trigger
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Flyout with a custom trigger button using the #trigger slot.
            </p>
            
            <WfFlyoutRoot aria-label="User Menu">
                <template #trigger="{ open }">
                    <WfButton 
                        :label="open ? 'Menu Open ▲' : 'User Menu ▼'"
                        color="primary"
                        size="md"
                    />
                </template>

                <WfCardRoot>
                    <WfCardBody>
                        <div :class="css({ minWidth: '200px' })">
                            <ul :class="css({ listStyle: 'none', padding: 0 })">
                                <li :class="css({ 
                                    padding: 'sm',
                                    cursor: 'pointer',
                                    borderRadius: 'md',
                                    _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                })">
                                    Profile
                                </li>
                                <li :class="css({ 
                                    padding: 'sm',
                                    cursor: 'pointer',
                                    borderRadius: 'md',
                                    _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                })">
                                    Settings
                                </li>
                                <li :class="css({ 
                                    padding: 'sm',
                                    cursor: 'pointer',
                                    borderRadius: 'md',
                                    _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                })">
                                    Logout
                                </li>
                            </ul>
                        </div>
                    </WfCardBody>
                </WfCardRoot>
            </WfFlyoutRoot>
        </div>

        <!-- Right-Aligned Flyout -->
        <div :class="css({ display: 'flex', justifyContent: 'flex-end' })">
            <div>
                <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                    Right-Aligned Flyout
                </h2>
                <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                    Flyout dropdown aligned to the right using direction="right" on FlyoutDropdown.
                </p>
                
                <WfFlyoutRoot label="Options ⚙">
                    <template #dropdown>
                        <WfFlyoutDropdown direction="right">
                                <WfCardRoot>
                                    <WfCardBody>
                                        <div :class="css({ minWidth: '220px' })">
                                            <h4 :class="css({ fontSize: 'md', fontWeight: 'bold', marginBottom: 'sm' })">
                                                Options
                                            </h4>
                                            <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'xs' })">
                                                <label :class="css({ display: 'flex', alignItems: 'center', gap: 'xs', cursor: 'pointer' })">
                                                    <input type="checkbox" />
                                                    <span :class="css({ fontSize: 'sm' })">Enable notifications</span>
                                                </label>
                                                <label :class="css({ display: 'flex', alignItems: 'center', gap: 'xs', cursor: 'pointer' })">
                                                    <input type="checkbox" />
                                                    <span :class="css({ fontSize: 'sm' })">Auto-save</span>
                                                </label>
                                                <label :class="css({ display: 'flex', alignItems: 'center', gap: 'xs', cursor: 'pointer' })">
                                                    <input type="checkbox" />
                                                    <span :class="css({ fontSize: 'sm' })">Dark mode</span>
                                                </label>
                                            </div>
                                        </div>
                                    </WfCardBody>
                                </WfCardRoot>
                            </WfFlyoutDropdown>
                    </template>
                </WfFlyoutRoot>
            </div>
        </div>

        <!-- Flyout with Rich Content -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Rich Content Flyout
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Flyout with complex content including images, text, and actions.
            </p>
            
            <WfFlyoutRoot label="Product Info">
                <WfCardRoot>
                    <WfCardBody>
                        <div :class="css({ width: '300px' })">
                            <div :class="css({ 
                                width: '100%',
                                height: '150px',
                                bg: 'primary',
                                borderRadius: 'md',
                                marginBottom: 'md',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2xl'
                            })">
                                🎨
                            </div>
                            <h3 :class="css({ fontSize: 'lg', fontWeight: 'bold', marginBottom: 'sm' })">
                                Premium Product
                            </h3>
                            <p :class="css({ 
                                fontSize: 'sm', 
                                color: 'text.muted',
                                marginBottom: 'md'
                            })">
                                A high-quality product with excellent features and great value for your money.
                            </p>
                            <div :class="css({ display: 'flex', gap: 'sm', marginBottom: 'md' })">
                                <span :class="css({ 
                                    fontSize: 'xs',
                                    padding: '2xs sm',
                                    bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' },
                                    borderRadius: 'md'
                                })">
                                    Popular
                                </span>
                                <span :class="css({ 
                                    fontSize: 'xs',
                                    padding: '2xs sm',
                                    bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' },
                                    borderRadius: 'md'
                                })">
                                    New
                                </span>
                            </div>
                            <div :class="css({ display: 'flex', gap: 'sm' })">
                                <WfButton label="Learn More" color="secondary" size="sm" />
                                <WfButton label="Buy Now" color="primary" size="sm" />
                            </div>
                        </div>
                    </WfCardBody>
                </WfCardRoot>
            </WfFlyoutRoot>
        </div>

        <!-- Multiple Flyouts in a Row -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Multiple Flyouts
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Multiple flyouts can coexist, each with its own trigger and content.
            </p>
            
            <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })">
                <WfFlyoutRoot label="File">
                    <WfCardRoot>
                        <WfCardBody>
                            <div :class="css({ minWidth: '150px' })">
                                <ul :class="css({ listStyle: 'none', padding: 0, fontSize: 'sm' })">
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        New
                                    </li>
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Open
                                    </li>
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Save
                                    </li>
                                </ul>
                            </div>
                        </WfCardBody>
                    </WfCardRoot>
                </WfFlyoutRoot>

                <WfFlyoutRoot label="Edit">
                    <WfCardRoot>
                        <WfCardBody>
                            <div :class="css({ minWidth: '150px' })">
                                <ul :class="css({ listStyle: 'none', padding: 0, fontSize: 'sm' })">
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Cut
                                    </li>
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Copy
                                    </li>
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Paste
                                    </li>
                                </ul>
                            </div>
                        </WfCardBody>
                    </WfCardRoot>
                </WfFlyoutRoot>

                <WfFlyoutRoot label="View">
                    <WfCardRoot>
                        <WfCardBody>
                            <div :class="css({ minWidth: '150px' })">
                                <ul :class="css({ listStyle: 'none', padding: 0, fontSize: 'sm' })">
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Zoom In
                                    </li>
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Zoom Out
                                    </li>
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Fullscreen
                                    </li>
                                </ul>
                            </div>
                        </WfCardBody>
                    </WfCardRoot>
                </WfFlyoutRoot>

                <WfFlyoutRoot label="Help">
                    <WfCardRoot>
                        <WfCardBody>
                            <div :class="css({ minWidth: '150px' })">
                                <ul :class="css({ listStyle: 'none', padding: 0, fontSize: 'sm' })">
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Documentation
                                    </li>
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        Support
                                    </li>
                                    <li :class="css({ 
                                        padding: 'xs',
                                        cursor: 'pointer',
                                        _hover: { bg: { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' } }
                                    })">
                                        About
                                    </li>
                                </ul>
                            </div>
                        </WfCardBody>
                    </WfCardRoot>
                </WfFlyoutRoot>
            </div>
        </div>

        <!-- Flyout with Custom Styled Trigger -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Custom Styled Trigger
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Flyout with custom trigger styling through the <code>css</code> prop (<code>trigger</code> slot).
            </p>
            
            <WfFlyoutRoot 
                label="Styled Trigger"
                :css="{ trigger: css.raw({
                    padding: 'md lg',
                    bg: 'primary',
                    color: 'white',
                    borderRadius: 'lg',
                    fontWeight: 'bold',
                    border: 'none',
                    _hover: {
                        bg: 'primary',
                        opacity: 0.9
                    }
                }) }">
                <WfCardRoot>
                    <WfCardBody>
                        <div :class="css({ minWidth: '250px' })">
                            <h3 :class="css({ fontSize: 'lg', fontWeight: 'bold', marginBottom: 'sm' })">
                                Custom Trigger Style
                            </h3>
                            <p :class="css({ fontSize: 'sm', color: 'text.muted' })">
                                The trigger button has custom styling applied via the classTrigger prop.
                            </p>
                        </div>
                    </WfCardBody>
                </WfCardRoot>
            </WfFlyoutRoot>
        </div>
    </ShowcaseContainer>
</template>

<script setup lang="ts">
import { css } from 'styled-system/css';
</script>

<style scoped>
.flyout-enter-active,
.flyout-leave-active {
  transition: all 200ms;
}
.flyout-enter-from, .flyout-leave-to {
  opacity: 0;
}
</style>
